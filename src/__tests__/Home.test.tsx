import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../app/page';

// --- MOCK NEXT/NAVIGATION ---
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams('keywords=&page=1'),
}));

// --- MOCK LOTTIE-REACT ---
interface LottieProps {
  animationData: unknown;
  loop?: boolean;
  style?: React.CSSProperties;
}

jest.mock('lottie-react', () => {
  const Lottie: React.FC<LottieProps> = ({ style }) => {
    return <div data-testid="lottie-animation" style={style}>Lottie Animation Placeholder</div>;
  };
  return Lottie;
});

// --- MOCK GLOBAL FETCH ---
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
    render(<Home />);
    
    const input = screen.getByLabelText(/Search/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });
    expect(input).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  it('should trigger a search and display results when clicking the search button', async () => {
    mockFetchResponse(
      {
        providers: [
          {
            id: 1,
            user: {
              username: 'testuser',
              name: 'Test User',
              picture_medium: 'http://example.com/some.jpg',
            },
            headline: 'This is the HEADLINE that includes the search text.',
            relevant_sample: {
              file: 'https://sandbox.voice123.com/samples/luis%20-%20%20lalaa%20lalala%20la.mp3',
            },
            description: 'This is a sample description that contains search text within it.',
            additional_details: 'Some additional details that may be long.',
          },
        ],
      },
      1
    );

    render(<Home />);
    const input = screen.getByLabelText(/Search/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });
    fireEvent.change(input, { target: { value: 'search text' } });
    fireEvent.click(searchButton);

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('keywords=search%20text'));

    const actorLink = await screen.findByRole('link', { name: /Test User/i });
    expect(actorLink).toBeInTheDocument();

    const highlightedElements = await screen.findAllByText(/search text/i);
    expect(highlightedElements.length).toBeGreaterThan(0);

    const audioPlayer = await screen.findByTestId('audio-player');
    const sourceEl = audioPlayer.querySelector('source');
    expect(sourceEl).toHaveAttribute('src', 'https://sandbox.voice123.com/samples/luis%20-%20%20lalaa%20lalala%20la.mp3');
  });

  it('should perform search on Enter key press', async () => {
    mockFetchResponse(
      {
        providers: [
          {
            id: 2,
            user: {
              username: 'enterUser',
              name: 'Enter Key User',
              picture_medium: 'http://example.com/some.jpg',
            },
            headline: 'Headline with search text triggered by ENTER press',
            relevant_sample: { file: 'https://sandbox.voice123.com/samples/luis%20-%20%20lalaa%20lalala%20la.mp3' },
          },
        ],
      },
      1
    );

    render(<Home />);
    const input = screen.getByLabelText(/Search/i);
    fireEvent.change(input, { target: { value: 'search text' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('keywords=search%20text'));
    const userLink = await screen.findByRole('link', { name: /Enter Key User/i });
    expect(userLink).toBeInTheDocument();
  });

  it('should handle pagination when "Next" is clicked', async () => {
    mockFetchResponse(
      {
        providers: [
          {
            id: 3,
            user: { username: 'page1User', name: 'Page 1 User', picture_medium: 'http://example.com/some.jpg' },
            headline: 'Some provider name or something from page 1',
          },
        ],
      },
      2
    );

    render(<Home />);
    const input = screen.getByLabelText(/Search/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });
    fireEvent.change(input, { target: { value: 'search text' } });
    fireEvent.click(searchButton);

    await screen.findByText(/Some provider name or something from page 1/i);

    mockFetchResponse(
      {
        providers: [
          {
            id: 4,
            user: { username: 'page2User', name: 'Page 2 User', picture_medium: 'http://example.com/some.jpg' },
            headline: 'Some provider name from page 2',
          },
        ],
      },
      2
    );

    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);
    expect(global.fetch).toHaveBeenLastCalledWith(expect.stringContaining('page=2'));
    await screen.findByText(/Some provider name from page 2/i);
  });

  it('should show "No results found" if providers array is empty', async () => {
    mockFetchResponse({ providers: [] });
    render(<Home />);
    const input = screen.getByLabelText(/Search/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });
    fireEvent.change(input, { target: { value: 'search text' } });
    fireEvent.click(searchButton);
    const msg = await screen.findByText(/No results found/i);
    expect(msg).toBeInTheDocument();
  });
});
