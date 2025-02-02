"use client";

import { FC, KeyboardEvent } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface SearchBarProps {
  query: string;
  onQueryChange: (newQuery: string) => void;
  onSearch: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const SearchBar: FC<SearchBarProps> = ({ query, onQueryChange, onSearch, onKeyDown }) => {
  return (
    <Box sx={{ mb: 4, display: "flex", gap: 2, alignItems: "center" }}>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <Button variant="contained" onClick={onSearch} sx={{ backgroundColor: "black", padding: 2 }}>
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
