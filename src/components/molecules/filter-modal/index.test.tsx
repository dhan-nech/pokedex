import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';
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

  it('renders FilterModal correctly', () => {
    render(<FilterModal {...defaultProps} />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByTestId('mock-dropdown-type')).toBeInTheDocument();
    expect(screen.getByTestId('mock-dropdown-gender')).toBeInTheDocument();
    expect(screen.getByTestId('mock-dropdown-stats')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<FilterModal {...defaultProps} />);
    fireEvent.click(screen.getByText('×'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onTypeChange when type is changed', () => {
    render(<FilterModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Change Type'));
    expect(mockOnTypeChange).toHaveBeenCalledTimes(0);
  });

  it('calls onGenderChange when gender is changed', () => {
    render(<FilterModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Change Gender'));
    expect(mockOnGenderChange).toHaveBeenCalledTimes(0);
  });

  it('applies filters and closes modal when Apply button is clicked', () => {
    render(<FilterModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Apply'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnTypeChange).toHaveBeenCalledTimes(1);
    expect(mockOnGenderChange).toHaveBeenCalledTimes(1);
    expect(mockOnStatsChange).toHaveBeenCalledTimes(1);
  });

  it('resets filters when Reset button is clicked', () => {
    render(<FilterModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Reset'));
    expect(mockOnTypeChange).toHaveBeenCalledTimes(0);
    expect(mockOnGenderChange).toHaveBeenCalledTimes(0);
    expect(mockOnStatsChange).toHaveBeenCalledTimes(0)
  });
});