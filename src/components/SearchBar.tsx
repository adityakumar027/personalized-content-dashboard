"use client";

import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebounce";

export default function SearchBar({
  onSearch,
  placeholder = "Search news, movies, posts...",
}: {
  onSearch: (query: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const debounced = useDebouncedValue(value, 300);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <input
      type="search"
      role="searchbox"
      aria-label="Search content"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full max-w-md rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        color: "var(--text)",
      }}
    />
  );
}
