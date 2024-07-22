// src/components/molecules/pagination/index.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pagination from './index';

// Mock the Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('Pagination', () => {
  it('renders the current page and total pages', () => {
    render(<Pagination currentPage={5} totalPages={10} />);
    expect(screen.getByText('Page 5 of 10')).toBeInTheDocument();
  });

  it('renders Previous and Next buttons when not on first or last page', () => {
    render(<Pagination currentPage={5} totalPages={10} />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('does not render Previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={10} />);
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('does not render Next button on last page', () => {
    render(<Pagination currentPage={10} totalPages={10} />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('links to correct pages for Previous and Next', () => {
    render(<Pagination currentPage={5} totalPages={10} />);
    expect(screen.getByText('Previous').closest('a')).toHaveAttribute('href', '/4');
    expect(screen.getByText('Next').closest('a')).toHaveAttribute('href', '/6');
  });

//   it('applies correct CSS classes', () => {
//     render(<Pagination currentPage={5} totalPages={10} />);
//     expect(screen.getByText('Previous')).toHaveClass('px-4 py-2 bg-maintext text-mainbg rounded');
//     expect(screen.getByText('Next')).toHaveClass('px-4 py-2 bg-maintext text-mainbg rounded');
//   });

  it('renders correctly for single page', () => {
    render(<Pagination currentPage={1} totalPages={1} />);
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

//   it('has correct aria-labels for accessibility', () => {
//     render(<Pagination currentPage={5} totalPages={10} />);
//     expect(screen.getByText('Previous')).toHaveAttribute('aria-label', 'Go to previous page');
//     expect(screen.getByText('Next')).toHaveAttribute('aria-label', 'Go to next page');
//   });
});