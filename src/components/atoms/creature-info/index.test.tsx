import React from 'react';
import { render, screen } from '@testing-library/react';
import CreatureInfo from './index';

describe('CreatureInfo', () => {
  const mockProps = {
    name: 'Charizard',
    id: 6,
    types: [
      { type: { name: 'Fire' } },
      { type: { name: 'Flying' } },
    ],
    abilities: [
      { ability: { name: 'Blaze' } },
      { ability: { name: 'Solar Power' } },
    ],
  };

  beforeEach(() => {
    render(<CreatureInfo {...mockProps} />);
  });

  it('renders the abilities correctly', () => {
    expect(screen.getByText('Abilities')).toBeInTheDocument();
    expect(screen.getByText('Blaze, Solar Power')).toBeInTheDocument();
  });

  it('renders the types correctly', () => {
    expect(screen.getByText('Types')).toBeInTheDocument();
    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.getByText('Flying')).toBeInTheDocument();
  });

  it('renders the weaknesses correctly', () => {
    expect(screen.getByText('Weak Against')).toBeInTheDocument();
    expect(screen.getByText('water')).toBeInTheDocument();
    expect(screen.getByText('ground')).toBeInTheDocument();
    expect(screen.getByText('rock')).toBeInTheDocument();
  });

  it('applies correct CSS classes to type badges', () => {
    const fireBadge = screen.getByText('Fire');
    expect(fireBadge).toHaveClass('bg-fire');
    expect(fireBadge).toHaveClass('text-maintext');

    const flyingBadge = screen.getByText('Flying');
    expect(flyingBadge).toHaveClass('bg-flying');
    expect(flyingBadge).toHaveClass('text-maintext');
  });
});