import React from 'react';
import { render, screen } from '@testing-library/react';
import ModalImageCard from './index';
import { useRouter } from 'next/navigation';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ModalImageCard', () => {
  const mockPokemonData = {
    name: 'Pikachu',
    image: '/pikachu.png',
  };
  const mockPokemonId = 25;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    render(<ModalImageCard pokemonData={mockPokemonData} pokemonId={mockPokemonId} />);
  });

  it('renders the Pokemon image', () => {
    const image = screen.getByAltText('An Image of Pikachu');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('pikachu.png'));
  });

  it('has correct link to Pokemon details', () => {
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/pokemon/25-pikachu');
  });

  it('applies correct CSS classes', () => {
    const container = screen.getByRole('link').firstChild;
    expect(container).toHaveClass('max-w-[170px]', 'md:w-[200px]', 'sm:w-[200px]', 'h-[250px]', 'rounded', 'overflow-hidden', 'border-2', 'border-dashed', 'border-gray-300', 'cursor-pointer', 'group-focus:ring-2', 'group-focus:ring-maintext');
  });

//   it('handles missing image gracefully', () => {
//     const { rerender } = render(<ModalImageCard pokemonData={{...mockPokemonData, image: ''}} pokemonId={mockPokemonId} />);
//     const image = screen.getByAltText('An Image of Pikachu');
//     expect(image).toHaveAttribute('src', '');
//     rerender(<ModalImageCard pokemonData={{...mockPokemonData, image: undefined}} pokemonId={mockPokemonId} />);
//     expect(image).toHaveAttribute('src', '');
//   });
});