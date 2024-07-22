// src/components/atoms/mobile-dropdown/index.test.tsx

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MobileDropdown from './index';

describe('MobileDropdown', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    label: 'Test Dropdown',
    options: ['Option 1', 'Option 2', 'Option 3'],
    selectedOptions: ['Option 1'],
    onChange: mockOnChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

//   it('renders with the correct label', () => {
//     render(<MobileDropdown {...defaultProps} />);
//     expect(screen.getByText('Test Dropdown')).toBeInTheDocument();
//   });

  it('displays selected options in the button text', () => {
    render(<MobileDropdown {...defaultProps} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('displays "label + X More" when multiple options are selected', () => {
    render(<MobileDropdown {...defaultProps} selectedOptions={['Option 1', 'Option 2']} />);
    expect(screen.getByText('Option 1 + 1 More')).toBeInTheDocument();
  });

  it('opens the dropdown when clicked', () => {
    render(<MobileDropdown {...defaultProps} />);
    fireEvent.click(screen.getByText('Option 1'));
    expect(screen.getByText('Option 2')).toBeVisible();
    expect(screen.getByText('Option 3')).toBeVisible();
  });

//   it('closes the dropdown when clicked again', () => {
//     render(<MobileDropdown {...defaultProps} />);
//     const button = screen.getByText('Option 1');
//     fireEvent.click(button);
//     fireEvent.click(button);
//     expect(screen.queryByText('Option 2')).not.toBeVisible();
//   });

  it('calls onChange when an option is selected', () => {
    render(<MobileDropdown {...defaultProps} />);
    fireEvent.click(screen.getByText('Option 1'));
    fireEvent.click(screen.getByLabelText('Option 2'));
    expect(mockOnChange).toHaveBeenCalledWith(['Option 1', 'Option 2']);
  });

  it('calls onChange when an option is deselected', () => {
    render(<MobileDropdown {...defaultProps} selectedOptions={['Option 1', 'Option 2']} />);
    fireEvent.click(screen.getByText('Option 1 + 1 More'));
    fireEvent.click(screen.getByLabelText('Option 1'));
    expect(mockOnChange).toHaveBeenCalledWith(['Option 2']);
  });

  it('renders checkboxes for each option', () => {
    render(<MobileDropdown {...defaultProps} />);
    fireEvent.click(screen.getByText('Option 1'));
    expect(screen.getByLabelText('Option 1')).toBeChecked();
    expect(screen.getByLabelText('Option 2')).not.toBeChecked();
    expect(screen.getByLabelText('Option 3')).not.toBeChecked();
  });

  it('applies correct CSS classes', () => {
    render(<MobileDropdown {...defaultProps} />);
    expect(screen.getByRole('button')).toHaveClass('w-full', 'text-left', 'bg-white', 'border', 'border-gray-300', 'rounded-md', 'px-4', 'py-2', 'flex', 'justify-between', 'items-center');
  });

  it('displays "+" when closed and "−" when open', () => {
    render(<MobileDropdown {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('+');
    fireEvent.click(button);
    expect(button).toHaveTextContent('−');
  });

  it('handles empty options array', () => {
    render(<MobileDropdown {...defaultProps} options={[]} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('handles empty selectedOptions array', () => {
    render(<MobileDropdown {...defaultProps} selectedOptions={[]} />);
    expect(screen.getByText('Test Dropdown')).toBeInTheDocument();
  });
});