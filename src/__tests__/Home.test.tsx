import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../app/page';


global.fetch = jest.fn();

/**
 * Helper to mock a successful fetch JSON response.
 */
function mockFetchResponse(data: unknown, totalPages = 1) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => data,
    headers: {
      get: (headerName: string) => {
        if (headerName === 'x-list-total-pages') {
          return String(totalPages);
        }
        return null;
      },
    },
  } as Response);
}

describe('Homepage Search Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
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
            picture_medium: 'http://example.com/some.jpg',
          },
          headline: 'This is the HEADLINE that includes the search text.',
          relevant_sample: {
            file: 'http://example.com/testAudio.mp3',
          },
        },
      ],
    });

    render(<HomePage />);
    
    const input = screen.getByPlaceholderText(/search.../i);
    const button = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(input, { target: { value: 'search text' } });
    fireEvent.click(button);

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('keywords=search%20text'));

    const actorLink = await screen.findByRole('link', { name: /Test User/i });
    expect(actorLink).toBeInTheDocument();

    const highlighted = await screen.findByText(/search text/i);
    expect(highlighted).toBeInTheDocument();

    const audioPlayer = await screen.findByTestId('audio-player');
    const sourceEl = audioPlayer.querySelector('source'); 

    expect(sourceEl).toHaveAttribute('src', 'http://example.com/testAudio.mp3');
  });

  it('performs search on Enter key press', async () => {
    mockFetchResponse({
      providers: [
        {
          user: { username: 'enterUser', name: 'Enter Key User' },
          headline: 'Headline with search text triggered by ENTER press',
        },
      ],
    });

    render(<HomePage />);
    const input = screen.getByPlaceholderText(/search.../i);

    fireEvent.change(input, { target: { value: 'search text' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('keywords=search%20text')
    );

    const userLink = await screen.findByRole('link', { name: /Enter Key User/i });
    expect(userLink).toBeInTheDocument();
  });

  it('handles pagination when "Next" is clicked', async () => {
    mockFetchResponse(
      {
        providers: [
          {
            user: { username: 'page1User', name: 'Page 1 User' },
            headline: 'Some provider name or something from page 1',
          },
        ],
      },
      2
    );

    render(<HomePage />);
    const input = screen.getByPlaceholderText(/search.../i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'search text' } });
    fireEvent.click(button);

    await screen.findByText(/Some provider name or something from page 1/i);


    mockFetchResponse(
      {
        providers: [
          {
            user: { username: 'page2User', name: 'Page 2 User' },
            headline: 'Some provider name from page 2',
          },
        ],
      },
      2
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    expect(global.fetch).toHaveBeenLastCalledWith(expect.stringContaining('page=2'));

    await screen.findByText(/Some provider name from page 2/i);
  });


  it('shows "No results found" (simplified with findByText)', async () => {
    mockFetchResponse({ providers: [] });
    render(<HomePage />);

    const input = screen.getByPlaceholderText(/search.../i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'search text' } });
    fireEvent.click(button);

    const msg = await screen.findByText(/No results found/i);
    expect(msg).toBeInTheDocument();
  });
});
