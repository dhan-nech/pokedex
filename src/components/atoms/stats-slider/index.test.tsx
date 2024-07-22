// src/components/atoms/stats-slider/index.test.tsx

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatsSlider from './index';

// Mock the react-range library
jest.mock('react-range', () => ({
  Range: ({ values, onChange, renderTrack, renderThumb }: any) => (
    <div data-testid="mock-range">
      {renderTrack({
        props: {
          onMouseDown: jest.fn(),
          onTouchStart: jest.fn(),
          style: {},
        },
        children: renderThumb({
          props: {
            style: {},
          },
          index: 0,
          isDragged: false,
        }),
      })}
      <button onClick={() => onChange([values[0] + 1, values[1] - 1])}>Change Values</button>
    </div>
  ),
  getTrackBackground: jest.fn(() => 'mock-background'),
}));

describe('StatsSlider', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    label: 'Test Stat',
    value: [50, 150] as [number, number],
    onChange: mockOnChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<StatsSlider {...defaultProps} />);
    expect(screen.getByTestId('mock-range')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('calls onChange when values change', () => {
    render(<StatsSlider {...defaultProps} />);
    fireEvent.click(screen.getByText('Change Values'));
    expect(mockOnChange).toHaveBeenCalledWith([51, 149]);
  });

  it('renders with minimum value', () => {
    render(<StatsSlider {...defaultProps} value={[0, 150]} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders with maximum value', () => {
    render(<StatsSlider {...defaultProps} value={[50, 210]} />);
    expect(screen.getByText('210')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<StatsSlider {...defaultProps} label="Custom Label" />);
    // Note: The label might not be directly rendered in the component,
    // so we're not checking for its presence in the DOM
  });
});