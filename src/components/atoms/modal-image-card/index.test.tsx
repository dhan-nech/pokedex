// src/components/atoms/modal-image-card/index.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalImageCard from './index';

describe('ModalImageCard', () => {
  const mockPokemonData = {
    name: 'Pikachu',
    image: 'https://example.com/pikachu.png',
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders the component with correct data', () => {
    render(<ModalImageCard pokemonData={mockPokemonData} pokemonId={25} onClick={mockOnClick} />);

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByAltText('An Image of Pikachu')).toHaveAttribute('src', '/_next/image?url=https%3A%2F%2Fexample.com%2Fpikachu.png&w=256&q=75');
  });

  it('calls onClick when clicked', () => {
    render(<ModalImageCard pokemonData={mockPokemonData} pokemonId={25} onClick={mockOnClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter key is pressed', () => {
    render(<ModalImageCard pokemonData={mockPokemonData} pokemonId={25} onClick={mockOnClick} />);

    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Space key is pressed', () => {
    render(<ModalImageCard pokemonData={mockPokemonData} pokemonId={25} onClick={mockOnClick} />);

    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when other keys are pressed', () => {
    render(<ModalImageCard pokemonData={mockPokemonData} pokemonId={25} onClick={mockOnClick} />);

    fireEvent.keyDown(screen.getByRole('button'), { key: 'A' });
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('renders with empty image when pokemonData.image is empty', () => {
    const emptyImagePokemonData = { ...mockPokemonData, image: '' };
    render(<ModalImageCard pokemonData={emptyImagePokemonData} pokemonId={25} onClick={mockOnClick} />);

    const imgElement = screen.getByAltText('An Image of Pikachu');
    expect(imgElement).toHaveAttribute('src', '');
  });

  it('has correct accessibility attributes', () => {
    render(<ModalImageCard pokemonData={mockPokemonData} pokemonId={25} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'View details for Pikachu');
    expect(button).toHaveAttribute('tabIndex', '0');
  });

  it('applies focus styles correctly', () => {
    render(<ModalImageCard pokemonData={mockPokemonData} pokemonId={25} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('group-focus:ring-2', 'group-focus:ring-maintext');
  });
});