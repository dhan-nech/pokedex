import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TypeDD from './index';

// Mock the Dropdown component
jest.mock('../../atoms/dropdown', () => {
  return jest.fn(({ label, options, selectedOptions, onChange }) => (
    <div data-testid="mock-dropdown">
      <span>{label}</span>
      <ul>
        {options.map(option => (
          <li key={option} onClick={() => onChange([...selectedOptions, option])}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  ));
});

describe('TypeDD', () => {
  const mockOnTypeChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with initial selected types', () => {
    render(<TypeDD initialSelectedTypes={['Fire']} onTypeChange={mockOnTypeChange} />);
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('calls onTypeChange when a type is selected', () => {
    render(<TypeDD initialSelectedTypes={[]} onTypeChange={mockOnTypeChange} />);
    fireEvent.click(screen.getByText('Water'));
    expect(mockOnTypeChange).toHaveBeenCalledWith(['Water']);
  });

  it('updates selected types when multiple types are chosen', () => {
    render(<TypeDD initialSelectedTypes={['Fire']} onTypeChange={mockOnTypeChange} />);
    fireEvent.click(screen.getByText('Water'));
    expect(mockOnTypeChange).toHaveBeenCalledWith(['Fire', 'Water']);
  });

  it('passes correct props to Dropdown component', () => {
    render(<TypeDD initialSelectedTypes={['Fire']} onTypeChange={mockOnTypeChange} />);
    const dropdown = screen.getByTestId('mock-dropdown');
    expect(dropdown).toHaveTextContent('Type');
    expect(dropdown).toHaveTextContent('Normal');
    expect(dropdown).toHaveTextContent('Fire');
    expect(dropdown).toHaveTextContent('Water');
    // ... check for other types as needed
  });

  it('includes all expected Pokemon types', () => {
    render(<TypeDD initialSelectedTypes={[]} onTypeChange={mockOnTypeChange} />);
    const expectedTypes = ['Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass'];
    expectedTypes.forEach(type => {
      expect(screen.getByText(type)).toBeInTheDocument();
    });
  });
});