import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import FilterBar from '../src/components/FilterBar';

describe('Challenge 23: useRef - Focus Management', () => {
  it('FilterBar should render search input with id search-input', () => {
    render(
      <FilterBar
        searchQuery=""
        onSearchChange={() => {}}
      />
    );
    const searchInput = document.getElementById('search-input');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput?.tagName).toBe('INPUT');
  });

  it('FilterBar should be focusable for search input', () => {
    render(
      <FilterBar
        searchQuery=""
        onSearchChange={() => {}}
      />
    );
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    expect(searchInput).toBeInTheDocument();
    searchInput?.focus();
    expect(document.activeElement).toBe(searchInput);
  });
});
