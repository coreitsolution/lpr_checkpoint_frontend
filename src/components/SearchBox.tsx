import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { SearchResult } from '../types/index';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  onSelectResult: (result: SearchResult) => void;
  results: SearchResult[];
  isSearching: boolean;
  error: string | null;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  onSelectResult,
  results,
  isSearching,
  error
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10 w-72 text-black">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search place or coordinates (lat, lng)"
          className="w-full px-4 py-2 pr-10 bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
          disabled={isSearching}
        >
          <Search className="w-5 h-5 text-gray-500" />
        </button>
      </form>

      {isSearching && (
        <div className="mt-2 p-2 bg-white rounded-lg shadow-md">
          Searching...
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-50 text-red-600 rounded-lg shadow-md">
          {error}
        </div>
      )}

      {results.length > 0 && !error && (
        <div className="mt-2 bg-white rounded-lg shadow-md overflow-hidden">
          {results.map((result, index) => (
            <button
              key={result.placeId || index}
              onClick={() => onSelectResult(result)}
              className="w-full p-2 text-left hover:bg-gray-100 transition-colors border-b last:border-b-0"
            >
              {result.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox