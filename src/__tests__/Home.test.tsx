import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../app/page';


global.fetch = jest.fn();

/**
 * Helper to mock a successful fetch JSON response.
 */
function mockFetchResponse(data: unknown) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  } as Response);
}

describe('Homepage Search Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the search input and search button on initial load', () => {
    render(<HomePage />);
    
    const input = screen.getByPlaceholderText(/search.../i);
    const button = screen.getByRole('button', { name: /search/i });
    
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('should trigger a search and display results when clicking the search button', async () => {
    mockFetchResponse({
      providers: [
        {
          user: {
            username: 'testuser',
            name: 'Test User',
            picture_medium: 'http://example.com/test.jpg',
          },
          summary: {
            paragraphs: [
              'This is a sample paragraph that includes the search text somewhere.',
            ],
          },
          demos: [
            {
              mp3_file_path: 'http://example.com/sample.mp3',
            },
          ],
        },
      ],
    });

    render(<HomePage />);
    
    const input = screen.getByPlaceholderText(/search.../i);
    const button = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(input, { target: { value: 'search text' } });
    fireEvent.click(button);

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('keywords=search%20text'));

    const actorNameLink = await screen.findByRole('link', { name: /Test User/i });
    expect(actorNameLink).toBeInTheDocument();
  });

  it('should also trigger the same search when pressing Enter in the search input', async () => {
    mockFetchResponse({
      providers: [
        {
          user: {
            username: 'anotherTestUser',
            name: 'Enter Key User',
            picture_medium: 'http://example.com/test-enter.jpg',
          },
          summary: {
            paragraphs: [
              'This paragraph includes the search text triggered by Enter key press.',
            ],
          },
          demos: [],
        },
      ],
    });

    render(<HomePage />);

    const input = screen.getByPlaceholderText(/search.../i);

    fireEvent.change(input, { target: { value: 'search text' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('keywords=search%20text'));
    const actorNameLink = await screen.findByRole('link', { name: /Enter Key User/i });
    expect(actorNameLink).toBeInTheDocument();
  });

  it('should highlight the matching text in the first paragraph', async () => {
    mockFetchResponse({
      providers: [
        {
          user: {
            username: 'testuser2',
            name: 'Test User2',
            picture_medium: 'http://example.com/test2.jpg',
          },
          summary: {
            paragraphs: [
              'Another paragraph with the important search text to highlight.',
            ],
          },
          demos: [
            {
              mp3_file_path: 'http://example.com/sample2.mp3',
            },
          ],
        },
      ],
    });

    render(<HomePage />);
    
    const input = screen.getByPlaceholderText(/search.../i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'search text' } });
    fireEvent.click(button);

    const highlightedText = await screen.findByText(/search text/i);
    expect(highlightedText).toBeInTheDocument();
  });

  it('should display an audio player for the relevant sample', async () => {
    mockFetchResponse({
      providers: [
        {
          user: {
            username: 'audioUser',
            name: 'Audio Test User',
            picture_medium: 'http://example.com/audio.jpg',
          },
          summary: {
            paragraphs: ['Some paragraph with search text.'],
          },
          demos: [
            {
              mp3_file_path: 'http://example.com/audioSample.mp3',
            },
          ],
        },
      ],
    });

    render(<HomePage />);
    
    const input = screen.getByPlaceholderText(/search.../i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'search text' } });
    fireEvent.click(button);

    const audioPlayer = await screen.findByTestId('audio-player');
    expect(audioPlayer).toBeInTheDocument();
    expect(audioPlayer).toHaveAttribute('src', 'http://example.com/audioSample.mp3');
  });

  it('should handle pagination by clicking "Next"', async () => {
    mockFetchResponse({
      providers: [
        // Some providers for page 1 ...
      ],
      next_page: 2,
    });

    render(<HomePage />);
    
    const input = screen.getByPlaceholderText(/search.../i);
    const button = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(input, { target: { value: 'search text' } });
    fireEvent.click(button);

    await screen.findByText(/Some provider name or something from page 1/i);

    mockFetchResponse({
      providers: [
        // Some providers from page 2 ...
      ],
      page: 2,
      next_page: null,
      previous_page: 1,
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    expect(global.fetch).toHaveBeenLastCalledWith(expect.stringContaining('page=2'));

    await screen.findByText(/Some provider name from page 2/i);
  });

  it('should show "No results found" if providers array is empty', async () => {
    mockFetchResponse({
      providers: [],
    });

    render(<HomePage />);

    const input = screen.getByPlaceholderText(/search.../i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'search text' } });
    fireEvent.click(button);

    const noResultsMessage = await screen.findByText(/No results found/i);
    expect(noResultsMessage).toBeInTheDocument();
  });
});
