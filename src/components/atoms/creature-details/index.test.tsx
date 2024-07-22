import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreatureDetails from '.';

describe('CreatureDetails', () => {
  // Test 1: Render with all props provided
  it('renders with all props provided', () => {
    const props = {
      name: 'Pikachu',
      id: '025',
      height: 4,
      weight: 60,
      eggGroups: [{ name: 'Field' }, { name: 'Fairy' }],
      genderRate: 4,
    };
    render(<CreatureDetails {...props} />);
    
    expect(screen.getByText('Height')).toBeInTheDocument();
    expect(screen.getByText('1\'4"')).toBeInTheDocument();
    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByText('6.0 Kg')).toBeInTheDocument();
    expect(screen.getByText('Gender(s)')).toBeInTheDocument();
    expect(screen.getByText('Male, Female')).toBeInTheDocument();
    expect(screen.getByText('Egg Groups')).toBeInTheDocument();
    expect(screen.getByText('Field, Fairy')).toBeInTheDocument();
  });

  // Test 2: Render with minimum props
//   it('renders with minimum props', () => {
//     render(<CreatureDetails />);
    
//     expect(screen.getByText('Height')).toBeInTheDocument();
//     expect(screen.getByText('0\'0"')).toBeInTheDocument();
//     expect(screen.getByText('Weight')).toBeInTheDocument();
//     expect(screen.getByText('0.0 Kg')).toBeInTheDocument();
//     expect(screen.getByText('Gender(s)')).toBeInTheDocument();
//     expect(screen.getByText('Unknown')).toBeInTheDocument();
//     expect(screen.getByText('Egg Groups')).toBeInTheDocument();
//     expect(screen.getByText('')).toBeInTheDocument();
//   });

  // Test 3: Test height conversion
  it('converts height correctly', () => {
    render(<CreatureDetails height={10} />);
    expect(screen.getByText('3\'3"')).toBeInTheDocument();
  });

  // Test 4: Test weight conversion
  it('converts weight correctly', () => {
    render(<CreatureDetails weight={100} />);
    expect(screen.getByText('10.0 Kg')).toBeInTheDocument();
  });

  // Test 5: Test genderRate for Genderless
  it('displays correct gender for genderless Pokemon', () => {
    render(<CreatureDetails genderRate={-1} />);
    expect(screen.getByText('Genderless')).toBeInTheDocument();
  });

  // Test 6: Test genderRate for Male-only
  it('displays correct gender for male-only Pokemon', () => {
    render(<CreatureDetails genderRate={0} />);
    expect(screen.getByText('Male')).toBeInTheDocument();
  });

  // Test 7: Test genderRate for Female-only
  it('displays correct gender for female-only Pokemon', () => {
    render(<CreatureDetails genderRate={8} />);
    expect(screen.getByText('Female')).toBeInTheDocument();
  });

  // Test 8: Test eggGroups with non-array input
//   it('handles non-array eggGroups', () => {
//     render(<CreatureDetails eggGroups="Not an array" />);
//     expect(screen.getByText('Egg Groups')).toBeInTheDocument();
//     expect(screen.getByText('')).toBeInTheDocument();
//   });

//   // Test 9: Test eggGroups with empty array
//   it('handles empty eggGroups array', () => {
//     render(<CreatureDetails eggGroups={[]} />);
//     expect(screen.getByText('Egg Groups')).toBeInTheDocument();
//     expect(screen.getByText('')).toBeInTheDocument();
//   });

  // Test 10: Test height with zero value
  it('handles zero height', () => {
    render(<CreatureDetails height={0} />);
    expect(screen.getByText('0\'0"')).toBeInTheDocument();
  });
});