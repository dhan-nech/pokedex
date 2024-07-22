import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GenderDD from './index';

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

describe('GenderDD', () => {
  const mockOnGenderChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with initial selected genders', () => {
    render(<GenderDD initialSelectedGenders={['Male']} onGenderChange={mockOnGenderChange} />);
    expect(screen.getByText('Gender')).toBeInTheDocument();
  });

  it('calls onGenderChange when a gender is selected', () => {
    render(<GenderDD initialSelectedGenders={[]} onGenderChange={mockOnGenderChange} />);
    fireEvent.click(screen.getByText('Female'));
    expect(mockOnGenderChange).toHaveBeenCalledWith(['Female']);
  });

  it('updates selected genders when multiple genders are chosen', () => {
    render(<GenderDD initialSelectedGenders={['Male']} onGenderChange={mockOnGenderChange} />);
    fireEvent.click(screen.getByText('Female'));
    expect(mockOnGenderChange).toHaveBeenCalledWith(['Male', 'Female']);
  });

  it('passes correct props to Dropdown component', () => {
    render(<GenderDD initialSelectedGenders={['Male']} onGenderChange={mockOnGenderChange} />);
    const dropdown = screen.getByTestId('mock-dropdown');
    expect(dropdown).toHaveTextContent('Gender');
    expect(dropdown).toHaveTextContent('Male');
    expect(dropdown).toHaveTextContent('Female');
    expect(dropdown).toHaveTextContent('Genderless');
  });
});