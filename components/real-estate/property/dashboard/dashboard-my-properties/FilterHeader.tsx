"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

interface FilterHeaderProps {
  onSearch: (search: string) => void;
  onSort: (sortBy: string) => void;
  initialSearch?: string;
  initialSort?: string;
  isLoading?: boolean;
  placeholder?: string;
}

const FilterHeader = ({ 
  onSearch, 
  onSort, 
  initialSearch = '', 
  initialSort = 'best-match',
  isLoading = false,
  placeholder = 'Search properties...'
}: FilterHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortValue, setSortValue] = useState(initialSort);
  const [isFocused, setIsFocused] = useState(false);
  
  // Sử dụng ref để track timeout
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Cleanup timeout khi unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Handle search change với debounce thủ công
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear timeout cũ
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set timeout mới
    searchTimeoutRef.current = setTimeout(() => {
      onSearch(value);
    }, 500); // Debounce 500ms
  }, [onSearch]);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    onSearch('');
  }, [onSearch]);

  // Handle sort change
  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortValue(value);
    onSort(value);
  }, [onSort]);

  // Keyboard shortcut: Ctrl+/ để focus vào search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('.search_area input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="dashboard_search_meta d-md-flex align-items-center justify-content-xxl-end">
      {/* Search Box */}
      <div className="item1 mb15-sm position-relative">
        <div className="search_area">
          <div className="position-relative">
            <input
              type="text"
              className={`form-control bdrs12 ${isFocused ? 'border-primary' : ''}`}
              placeholder={placeholder}
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isLoading}
              style={{ paddingRight: searchTerm ? '70px' : '40px' }}
            />
            
            {/* Search Icon */}
            <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
              <span className="flaticon-search" />
            </span>

            {/* Clear button - chỉ hiển thị khi có search term và không loading */}
            {searchTerm && !isLoading && (
              <button
                type="button"
                className="position-absolute top-50 end-0 translate-middle-y me-2 border-0 bg-transparent"
                onClick={handleClearSearch}
                style={{ color: '#6c757d', cursor: 'pointer' }}
                aria-label="Clear search"
              >
                <span className="fas fa-times" />
              </button>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="position-absolute top-50 end-0 translate-middle-y me-2">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="page_control_shorting bdr1 bdrs12 py-2 ps-3 pe-2 mx-1 mx-xxl-3 bgc-white mb15-sm maxw160">
        <div className="pcs_dropdown d-flex align-items-center">
          <span style={{ minWidth: '65px' }} className="title-color">
            Sort by:
          </span>
          <select 
            className="form-select show-tick"
            value={sortValue}
            onChange={handleSortChange}
            disabled={isLoading}
          >
            <option value="best-match">Best Match</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
      
      {/* Add New Property Button */}
      <Link 
        href="/dashboard/add-property" 
        className={`ud-btn btn-thm ${isLoading ? 'pe-none opacity-50' : ''}`}
      >
        Add New Property
        <i className="fal fa-arrow-right-long" />
      </Link>
    </div>
  );
};

export default React.memo(FilterHeader); // Thêm memo để tránh re-render không cần thiết