// src/components/molecules/search/index.test.tsx

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBox from './index';

// Mock the GeneralInputBox component
jest.mock('../../atoms/input-box', () => {
  return jest.fn(({ label, placeholder, value, onChange }) => (
    <input
      data-testid="mock-input"
      aria-label={label}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e)}
    />
  ));
});

describe('SearchBox', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with initial search query', () => {
    render(<SearchBox initialSearchQuery="Pikachu" onSearch={mockOnSearch} />);
    expect(screen.getByTestId('mock-input')).toHaveValue('Pikachu');
  });

  it('calls onSearch when input changes', async () => {
    render(<SearchBox initialSearchQuery="" onSearch={mockOnSearch} />);
    const input = screen.getByTestId('mock-input');
    
    fireEvent.change(input, { target: { value: 'Charizard' } });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('Charizard');
    });
  });

  it('debounces search calls', async () => {
    jest.useFakeTimers();
    render(<SearchBox initialSearchQuery="" onSearch={mockOnSearch} />);
    const input = screen.getByTestId('mock-input');
    
    fireEvent.change(input, { target: { value: 'Char' } });
    fireEvent.change(input, { target: { value: 'Chari' } });
    fireEvent.change(input, { target: { value: 'Chariz' } });

    jest.runAllTimers();

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledTimes(3);
      expect(mockOnSearch).toHaveBeenCalledWith('Chariz');
    });

    jest.useRealTimers();
  });

  it('does not call onSearch for empty query', async () => {
    render(<SearchBox initialSearchQuery="Pikachu" onSearch={mockOnSearch} />);
    const input = screen.getByTestId('mock-input');
    
    fireEvent.change(input, { target: { value: '' } });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });
  });

  it('passes correct props to GeneralInputBox', () => {
    render(<SearchBox initialSearchQuery="Bulbasaur" onSearch={mockOnSearch} />);
    const input = screen.getByTestId('mock-input');
    
    expect(input).toHaveAttribute('aria-label', 'Search By');
    expect(input).toHaveAttribute('placeholder', 'Name or Number');
    expect(input).toHaveValue('Bulbasaur');
  });

  it('handles special characters in search query', async () => {
    render(<SearchBox initialSearchQuery="" onSearch={mockOnSearch} />);
    const input = screen.getByTestId('mock-input');
    
    fireEvent.change(input, { target: { value: 'Mr. Mime' } });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('Mr. Mime');
    });
  });

  it('trims whitespace from search query', async () => {
    render(<SearchBox initialSearchQuery="" onSearch={mockOnSearch} />);
    const input = screen.getByTestId('mock-input');
    
    fireEvent.change(input, { target: { value: 'Snorlax' } });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('Snorlax');
    });
  });
});