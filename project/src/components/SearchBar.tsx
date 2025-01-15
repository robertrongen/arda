import React from 'react';
import { Era, SearchFilters } from '../types';
import { Search } from 'lucide-react';

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ filters, onFiltersChange }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search events, characters, or locations..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={filters.searchTerm}
          onChange={(e) =>
            onFiltersChange({ ...filters, searchTerm: e.target.value })
          }
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.values(Era).map((era) => (
          <label key={era} className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-indigo-600"
              checked={filters.selectedEras.includes(era)}
              onChange={(e) => {
                const newEras = e.target.checked
                  ? [...filters.selectedEras, era]
                  : filters.selectedEras.filter((e) => e !== era);
                onFiltersChange({ ...filters, selectedEras: newEras });
              }}
            />
            <span className="ml-2 text-sm text-gray-700">{era}</span>
          </label>
        ))}
      </div>
    </div>
  );
};