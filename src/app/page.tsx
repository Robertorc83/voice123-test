"use client";

import { useEffect, useState, KeyboardEvent } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ResultsList from "@/features/ResultsList";
import useFetchProviders from "@/hooks/useFetchProviders";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@mui/material/Pagination";
import SearchBar from "@/features/SearchBar"; // New import for SearchBar

import Lottie from "lottie-react";
import microphoneAnimation from "../../public/animations/microphone.json";
import errorAnimation from "../../public/animations/error.json";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("keywords") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [query, setQuery] = useState<string>(initialQuery);
  const [activeQuery, setActiveQuery] = useState<string>(initialQuery);
  const [page, setPage] = useState<number>(initialPage);

  const { providers, loading, error, search, totalPages } = useFetchProviders();

  useEffect(() => {
    if (initialQuery) {
      setActiveQuery(initialQuery);
      search(initialQuery, initialPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    setPage(1);
    setActiveQuery(query);
    router.push(`?keywords=${encodeURIComponent(query)}&page=1`);
    search(query, 1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
    router.push(`?keywords=${encodeURIComponent(activeQuery)}&page=${newPage}`);
    search(activeQuery, newPage);
  };

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Voice123 Search
      </Typography>
      
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onKeyDown={handleKeyDown}
      />

      {loading && (
        <Lottie animationData={microphoneAnimation} loop style={{ height: 150, marginTop: 16 }} />
      )}
      {error && (
        <Lottie animationData={errorAnimation} loop style={{ height: 150, marginTop: 16 }} />
      )}
      {providers.length > 0 ? (
        <>
          <ResultsList providers={providers} query={activeQuery} />
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            boundaryCount={1}
            showFirstButton
            showLastButton
            sx={{
              mt: 8,
              display: "flex",
              justifyContent: "center",
              "& .MuiPaginationItem-root": {
                border: "1px solid black",
                color: "black",
              },
              "& .Mui-selected": {
                backgroundColor: "black",
                color: "white",
                border: "1px solid black",
              },
            }}
          />
        </>
      ) : (
        !loading && !error && <Typography>No results found</Typography>
      )}
    </Container>
  );
}
