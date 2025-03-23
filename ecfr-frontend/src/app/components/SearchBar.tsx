'use client';

import React, { useState, useEffect } from 'react';
import { fetchSearchResults } from '../../../utils/api';

interface SearchBarProps {
  setResults: (results: any[] | null) => void;
  setQuery: (query: string) => void;
}

const exampleQueries = [
  "Environmental Protection",
  "Health & Safety",
  "Energy Efficiency",
  "Consumer Protection",
];

const SearchBar: React.FC<SearchBarProps> = ({ setResults, setQuery }) => {
  const [query, setLocalQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [placeholder, setPlaceholder] = useState(exampleQueries[0]);

  // Rotate example placeholder every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((prev) => {
        const currentIndex = exampleQueries.indexOf(prev);
        const nextIndex = (currentIndex + 1) % exampleQueries.length;
        return exampleQueries[nextIndex];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Debounce logic (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch results when debouncedQuery updates
  useEffect(() => {
    setQuery(query);
    if (debouncedQuery) {
      fetchSearchResults(debouncedQuery)
        .then((response) => {
          const parsed = JSON.parse(response);
          setResults(parsed.results || []);
        })
        .catch((error) => {
          console.error('Error fetching search results:', error);
          setResults([]);
        });
    } else {
      setResults(null);
    }
  }, [debouncedQuery, setResults, setQuery, query]);

  return (
    <input
      type="text"
      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-300"
      placeholder={`e.g., ${placeholder}`}
      value={query}
      onChange={(e) => setLocalQuery(e.target.value)}
    />
  );
};

export default SearchBar;
