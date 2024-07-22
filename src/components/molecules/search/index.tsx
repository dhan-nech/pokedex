// src/components/molecules/search/index.tsx
'use client'

import React, { useState } from 'react';
import GeneralInputBox from '@/components/atoms/input-box';

interface SearchBoxProps {
  initialSearchQuery: string;
  onSearch?: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ initialSearchQuery, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="relative w-[100%]">
      <GeneralInputBox 
        label="Search By" 
        placeholder="Name or Number" 
        className="pr-10" 
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)
        }
      />
    </div>
  );
};

export default SearchBox;