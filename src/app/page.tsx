"use client";

import { useState, KeyboardEvent } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface Provider {
  headline?: string; 
  user: {
    username: string;
    name: string;
    picture_medium?: string;
  };
  relevant_sample?: {
    file?: string;
  };
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <span>{text}</span>;

  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} data-testid="highlight" style={{ backgroundColor: "yellow" }}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function AudioPlayer({ src }: { src: string }) {
  return (
    <Box sx={{ mt: 2 }}>
      <audio data-testid="audio-player" controls style={{ width: "100%" }}>
        <source src={src} type="audio/mpeg" />
        {/* fallback text */}
        Your browser does not support the audio element.
      </audio>
    </Box>
  );
}

function Paginator({
  currentPage,
  onPageChange,
  totalPages,
}: {
  currentPage: number;
  onPageChange: (p: number) => void;
  totalPages: number;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {/* Prev button */}
      <Button
        variant="outlined"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Prev
      </Button>

      {/* Page number buttons */}
      {pages.map((pageNum) => (
        <Button
          key={pageNum}
          variant={pageNum === currentPage ? "contained" : "outlined"}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </Button>
      ))}

      {/* Next button */}
      <Button
        variant="outlined"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </Box>
  );
}

function ResultsList({
  providers,
  query,
}: {
  providers: Provider[];
  query: string;
}) {
  return (
    <Box data-testid="results-list">
      {providers.map((provider, idx) => {
        const { user, headline, relevant_sample } = provider;
        const textToHighlight = headline ?? "";
        const audioFile = relevant_sample?.file ?? "";

        return (
          <Box key={`${user.username}-${idx}`} sx={{ mb: 3 }}>
            {/* Actor Name as a link */}
            <Typography variant="h6">
              <a
                href={`https://voice123.com/${user.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.name}
              </a>
            </Typography>

            {/* Picture if available */}
            {user.picture_medium && (
              <Box
                component="img"
                src={user.picture_medium}
                alt={user.name}
                width="100px"
              />
            )}

            {/* Highlight text */}
            <Box>
              <Highlight text={textToHighlight} query={query} />
            </Box>

            {/* Audio player */}
            {audioFile && <AudioPlayer src={audioFile} />}
          </Box>
        );
      })}
    </Box>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = async (searchText: string, pageNum: number) => {
    setLoading(true);
    setError(null);

    try {
      const url = `https://api.sandbox.voice123.com/providers/search/?service=voice_over&keywords=${encodeURIComponent(
        searchText
      )}&page=${pageNum}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const totalPagesFromHeader = response.headers.get("x-list-total-pages");
      setTotalPages(totalPagesFromHeader ? parseInt(totalPagesFromHeader, 10) : 1);

      const data = await response.json();
      setProviders(data.providers || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchProviders(query, 1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchProviders(query, newPage);
  };

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Voice123 Search
      </Typography>

      <TextField
        placeholder="Search..."
        label="Search"
        variant="outlined"
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{ mb: 4, backgroundColor: "black" }}
      >
        Search
      </Button>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {providers.length > 0 ? (
        <>
          <ResultsList providers={providers} query={query} />
          <Paginator
            currentPage={page}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </>
      ) : (
        !loading && !error && <Typography>No results found</Typography>
      )}
    </Container>
  );
}
