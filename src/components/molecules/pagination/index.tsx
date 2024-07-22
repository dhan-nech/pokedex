// src\components\molecules\pagination\index.tsx
'use client'
import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-4">
      {currentPage > 1 && (
        <Link 
          href={`/${currentPage - 1}`} 
          className="px-4 py-2 bg-maintext text-mainbg rounded"
          aria-label="Go to previous page"
        >
          Previous
        </Link>
      )}
      <span>Page {currentPage} of {totalPages}</span>
      {currentPage < totalPages && (
        <Link 
          href={`/${currentPage + 1}`} 
          className="px-4 py-2 bg-maintext text-mainbg rounded"
          aria-label="Go to next page"
        >
          Next
        </Link>
      )}
    </div>
  );
};

export default Pagination;