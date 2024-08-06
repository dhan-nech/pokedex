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

  it('renders the component with all props', () => {
    render(<CreatureInfo {...mockProps} />);
    expect(screen.getByText('Abilities')).toBeInTheDocument();
    expect(screen.getByText('Blaze, Solar Power')).toBeInTheDocument();
    expect(screen.getByText('Types')).toBeInTheDocument();
    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.getByText('Flying')).toBeInTheDocument();
    expect(screen.getByText('Weak Against')).toBeInTheDocument();
    expect(screen.getByText('water')).toBeInTheDocument();
    expect(screen.getByText('rock')).toBeInTheDocument();
  });

  it('renders correctly with a single type', () => {
    const singleTypeProps = { ...mockProps, types: [{ type: { name: 'Fire' } }] };
    render(<CreatureInfo {...singleTypeProps} />);
    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.queryByText('Flying')).not.toBeInTheDocument();
  });

  it('renders correctly with no types', () => {
    const noTypeProps = { ...mockProps, types: [] };
    render(<CreatureInfo {...noTypeProps} />);
    expect(screen.queryByText('Fire')).not.toBeInTheDocument();
    expect(screen.queryByText('Flying')).not.toBeInTheDocument();
  });

  it('renders correctly with a single ability', () => {
    const singleAbilityProps = { ...mockProps, abilities: [{ ability: { name: 'Blaze' } }] };
    render(<CreatureInfo {...singleAbilityProps} />);
    expect(screen.getByText('Blaze')).toBeInTheDocument();
    expect(screen.queryByText('Solar Power')).not.toBeInTheDocument();
  });

  it('renders correctly with no abilities', () => {
    const noAbilityProps = { ...mockProps, abilities: [] };
    render(<CreatureInfo {...noAbilityProps} />);
    expect(screen.getByText('Abilities')).toBeInTheDocument();
    expect(screen.queryByText('Blaze')).not.toBeInTheDocument();
    expect(screen.queryByText('Solar Power')).not.toBeInTheDocument();
  });

  it('renders correctly with undefined props', () => {
    render(<CreatureInfo />);
    expect(screen.getByText('Abilities')).toBeInTheDocument();
    expect(screen.getByText('Types')).toBeInTheDocument();
    expect(screen.getByText('Weak Against')).toBeInTheDocument();
  });

  it('calculates weaknesses correctly for different type combinations', () => {
    const grassWaterProps = {
      ...mockProps,
      types: [{ type: { name: 'Grass' } }, { type: { name: 'Water' } }],
    };
    render(<CreatureInfo {...grassWaterProps} />);
    expect(screen.getByText('flying')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();
    expect(screen.queryByText('water')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes to type badges', () => {
    render(<CreatureInfo {...mockProps} />);
    const fireBadge = screen.getByText('Fire');
    expect(fireBadge).toHaveClass('bg-fire');
    expect(fireBadge).toHaveClass('text-maintext');

    const flyingBadge = screen.getByText('Flying');
    expect(flyingBadge).toHaveClass('bg-flying');
    expect(flyingBadge).toHaveClass('text-maintext');
  });
});