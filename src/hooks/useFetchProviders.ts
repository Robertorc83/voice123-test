import { useState } from 'react';

export interface Provider {
  id: number;
  headline?: string;
  description?: string;
  additional_details?: string;
  user: {
    id: number;
    username: string;
    name: string;
    picture_small?: string;
    picture_medium?: string;
    picture_large?: string;
    location?: string
  };
  relevant_sample?: {
    file: string;
    name?: string
  };
}

const API_BASE = 'https://api.sandbox.voice123.com/providers/search/';

export default function useFetchProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const search = async (query: string, page: number = 1): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE}?service=voice_over&keywords=${encodeURIComponent(query)}&page=${page}`
      );
      if (!response.ok) {
        throw new Error('Error fetching data');
      }

      const totalPagesFromHeader = response.headers.get('x-list-total-pages');
      console.log("totalPagesFromHeader", totalPagesFromHeader)
      setTotalPages(totalPagesFromHeader ? parseInt(totalPagesFromHeader, 10) : 1);

      const data = await response.json();
      setProviders(data.providers || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { providers, loading, error, search, totalPages };
}
