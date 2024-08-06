import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreatureDetails from './index';

describe('CreatureDetails', () => {
  const mockProps = {
    name: 'Pikachu',
    id: '025',
    height: 4,
    weight: 60,
    eggGroups: [{ name: 'Field' }, { name: 'Fairy' }],
    genderRate: 4
  };

  it('renders correctly with all props', () => {
    render(<CreatureDetails {...mockProps} />);
    
    expect(screen.getByText('Height')).toBeInTheDocument();
    expect(screen.getByText("1'4\"")).toBeInTheDocument();
    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByText('6.0 Kg')).toBeInTheDocument();
    expect(screen.getByText('Gender(s)')).toBeInTheDocument();
    expect(screen.getByText('Male, Female')).toBeInTheDocument();
    expect(screen.getByText('Egg Groups')).toBeInTheDocument();
    expect(screen.getByText('Field, Fairy')).toBeInTheDocument();
  });

//   it('handles missing props gracefully', () => {
//     render(<CreatureDetails />);
    
//     expect(screen.getByText('Height')).toBeInTheDocument();
//     expect(screen.getByText("0'0\"")).toBeInTheDocument();
//     expect(screen.getByText('Weight')).toBeInTheDocument();
//     expect(screen.getByText('0.0 Kg')).toBeInTheDocument();
//     expect(screen.getByText('Gender(s)')).toBeInTheDocument();
//     expect(screen.getByText('Unknown')).toBeInTheDocument();
//     expect(screen.getByText('Egg Groups')).toBeInTheDocument();
//     expect(screen.getByText('')).toBeInTheDocument();
//   });

  it('displays correct gender for male-only Pokemon', () => {
    render(<CreatureDetails {...mockProps} genderRate={0} />);
    expect(screen.getByText('Male')).toBeInTheDocument();
  });

  it('displays correct gender for female-only Pokemon', () => {
    render(<CreatureDetails {...mockProps} genderRate={8} />);
    expect(screen.getByText('Female')).toBeInTheDocument();
  });

  it('displays correct gender for genderless Pokemon', () => {
    render(<CreatureDetails {...mockProps} genderRate={-1} />);
    expect(screen.getByText('Genderless')).toBeInTheDocument();
  });

  it('handles extreme height values correctly', () => {
    render(<CreatureDetails {...mockProps} height={1000} />);
    expect(screen.getByText("328'1\"")).toBeInTheDocument();
  });

  it('handles extreme weight values correctly', () => {
    render(<CreatureDetails {...mockProps} weight={10000} />);
    expect(screen.getByText('1000.0 Kg')).toBeInTheDocument();
  });

  it('handles single egg group correctly', () => {
    render(<CreatureDetails {...mockProps} eggGroups={[{ name: 'Monster' }]} />);
    expect(screen.getByText('Monster')).toBeInTheDocument();
  });

//   it('handles no egg groups correctly', () => {
//     render(<CreatureDetails {...mockProps} eggGroups={[]} />);
//     expect(screen.getByText('Egg Groups')).toBeInTheDocument();
//     expect(screen.getByText('')).toBeInTheDocument();
//   });

  it('rounds weight to one decimal place', () => {
    render(<CreatureDetails {...mockProps} weight={123} />);
    expect(screen.getByText('12.3 Kg')).toBeInTheDocument();
  });

  it('converts height from decimeters to feet and inches correctly', () => {
    render(<CreatureDetails {...mockProps} height={30} />);
    expect(screen.getByText("9'10\"")).toBeInTheDocument();
  });
});