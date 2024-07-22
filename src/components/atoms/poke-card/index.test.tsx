// src/components/atoms/poke-card/index.test.tsx

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokeCard from './index';

describe('PokeCard', () => {
  const mockOnClick = jest.fn();
  const defaultProps = {
    imageSrc: '/pikachu.png',
    name: 'Pikachu',
    number: 25,
    types: ['electric'],
    onClick: mockOnClick,
  };

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders the Pokemon name', () => {
    render(<PokeCard {...defaultProps} />);
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
  });

  it('renders the Pokemon number padded with zeros', () => {
    render(<PokeCard {...defaultProps} />);
    expect(screen.getByText('025')).toBeInTheDocument();
  });

  it('renders the Pokemon image', () => {
    render(<PokeCard {...defaultProps} />);
    const image = screen.getByAltText('An Image of Pikachu') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('pikachu.png');
  });

  it('applies correct background color for single type', () => {
    render(<PokeCard {...defaultProps} />);
    const card = screen.getByRole('button');
    expect(card).toHaveStyle('background: var(--color-electric)');
  });

  it('applies gradient background for dual types', () => {
    render(<PokeCard {...defaultProps} types={['fire', 'flying']} />);
    const card = screen.getByRole('button');
    expect(card).toHaveStyle('background: linear-gradient(to bottom, var(--color-fire) 0%, var(--color-flying) 100%)');
  });

  it('calls onClick when clicked', () => {
    render(<PokeCard {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter key is pressed', () => {
    render(<PokeCard {...defaultProps} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Space key is pressed', () => {
    render(<PokeCard {...defaultProps} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick for other key presses', () => {
    render(<PokeCard {...defaultProps} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'A' });
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('has correct accessibility attributes', () => {
    render(<PokeCard {...defaultProps} />);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label', 'View details for Pikachu, number 25');
  });

  it('applies correct CSS classes', () => {
    render(<PokeCard {...defaultProps} />);
    const card = screen.getByRole('button');
    expect(card).toHaveClass('p-2', 'flex', 'flex-col', 'cursor-pointer', 'h-full', 'w-[164px]');
  });

  it('renders correctly with a large Pokemon number', () => {
    render(<PokeCard {...defaultProps} number={1000} />);
    expect(screen.getByText('1000')).toBeInTheDocument();
  });

  it('handles missing image gracefully', () => {
    render(<PokeCard {...defaultProps} imageSrc="" />);
    const image = screen.getByAltText('An Image of Pikachu') as HTMLImageElement;
    expect(image.src).toBe('http://localhost/');
  });
});