// FilterModal.test.tsx

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterModal from '.';

// Mock the sub-components
jest.mock('../../../components/atoms/mobile-dropdown', () => {
  return function MockMobileDropdown({ label, options, selectedOptions, onChange }: any) {
    return (
      <div data-testid={`mock-dropdown-${label.toLowerCase()}`}>
        <button onClick={() => onChange(['New Option'])}>Change {label}</button>
      </div>
    );
  };
});

jest.mock('../../../components/atoms/stats-slider', () => {
  return function MockStatsSlider({ label, value, onChange }: any) {
    return (
      <div data-testid={`mock-slider-${label}`}>
        <button onClick={() => onChange([10, 200])}>Change {label}</button>
      </div>
    );
  };
});

describe('FilterModal', () => {
  const mockOnClose = jest.fn();
  const mockOnTypeChange = jest.fn();
  const mockOnGenderChange = jest.fn();
  const mockOnStatsChange = jest.fn();

  const defaultProps = {
    onClose: mockOnClose,
    selectedTypes: ['Fire', 'Water'],
    selectedGenders: ['Male'],
    statsFilter: {
      hp: [0, 100],
      attack: [0, 100],
      defense: [0, 100],
      speed: [0, 100],
      spAttack: [0, 100],
      spDef: [0, 100],
    },
    onTypeChange: mockOnTypeChange,
    onGenderChange: mockOnGenderChange,
    onStatsChange: mockOnStatsChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<FilterModal {...defaultProps} />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByTestId('mock-dropdown-type')).toBeInTheDocument();
    expect(screen.getByTestId('mock-dropdown-gender')).toBeInTheDocument();
    expect(screen.getByText('Stats')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<FilterModal {...defaultProps} />);
    fireEvent.click(screen.getByText('×'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('applies filters and closes modal when Apply button is clicked', () => {
    render(<FilterModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Apply'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders all stat sliders', () => {
    render(<FilterModal {...defaultProps} />);
    expect(screen.getByTestId('mock-slider-hp')).toBeInTheDocument();
    expect(screen.getByTestId('mock-slider-attack')).toBeInTheDocument();
    expect(screen.getByTestId('mock-slider-defense')).toBeInTheDocument();
    expect(screen.getByTestId('mock-slider-speed')).toBeInTheDocument();
    expect(screen.getByTestId('mock-slider-spAttack')).toBeInTheDocument();
    expect(screen.getByTestId('mock-slider-spDef')).toBeInTheDocument();
  });
});