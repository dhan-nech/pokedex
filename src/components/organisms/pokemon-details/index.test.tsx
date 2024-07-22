// src/components/organisms/pokemon-details/index.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import PokemonPageClient from './index';

console.error = jest.fn();

// Mock Next.js router and useSearchParams
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

describe('PokemonPageClient', () => {
  const mockRouter = {
    push: jest.fn(),
  };
  const mockSearchParams = {
    get: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    mockSearchParams.get.mockReturnValue('1');
  });

  const mockProps = {
    initialStructuredData: {
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      types: [{ type: { name: 'grass' } }],
      abilities: [{ ability: { name: 'overgrow' } }],
      stats: [{ base_stat: 45, stat: { name: 'hp' } }],
    },
    initialDataSpecies: {
      flavor_text_entries: [{ language: { name: 'en' }, flavor_text: 'A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.' }],
      egg_groups: [{ name: 'monster' }, { name: 'plant' }],
      gender_rate: 1,
      evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
    },
    initialPokemonData: {
      image: 'https://example.com/bulbasaur.png',
      types: [{ type: { name: 'grass' } }],
      id: 1,
      name: 'bulbasaur',
    },
  };

  it('renders pokemon details correctly', () => {
    render(<PokemonPageClient {...mockProps} />);

    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('001')).toBeInTheDocument();
    expect(screen.getByText(/A strange seed was planted/)).toBeInTheDocument();
    expect(screen.getByAltText('An Image of bulbasaur')).toBeInTheDocument();
  });

  it('handles "Read More" and "Read Less" functionality', () => {
    render(<PokemonPageClient {...mockProps} />);

    fireEvent.click(screen.getByText('...Read More'));
    expect(screen.getByText('A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.')).toBeInTheDocument();

    fireEvent.click(screen.getByText('X'));
    expect(screen.queryByText('A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.')).not.toBeInTheDocument();
  });

  it('handles close button', () => {
    render(<PokemonPageClient {...mockProps} />);

    fireEvent.click(screen.getByLabelText('Close Pokemon details'));
    expect(mockRouter.push).toHaveBeenCalledWith('/1');
  });

  it('renders stats correctly', () => {
    render(<PokemonPageClient {...mockProps} />);

    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  it('renders pokemon details correctly', () => {
    render(<PokemonPageClient {...mockProps} />);

    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('001')).toBeInTheDocument();
    expect(screen.getByText(/A strange seed was planted/)).toBeInTheDocument();
    expect(screen.getByAltText('An Image of bulbasaur')).toBeInTheDocument();
  });

  it('handles close button', () => {
    render(<PokemonPageClient {...mockProps} />);

    fireEvent.click(screen.getByLabelText('Close Pokemon details'));
    expect(mockRouter.push).toHaveBeenCalledWith('/1');
  });

  it('renders stats correctly', () => {
    render(<PokemonPageClient {...mockProps} />);

    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  // Additional tests to increase coverage

  it('handles error in fetchPokemonData', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => Promise.reject('API is down'));

    render(<PokemonPageClient {...mockProps} />);

    fireEvent.click(screen.getByLabelText('View next Pokémon (2)'));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching Pokemon data:', 'API is down');
    });
  });

  // Add these test cases to the existing suite

it('handles previous button for first Pokemon', async () => {
    const props = {...mockProps, initialPokemonData: {...mockProps.initialPokemonData, id: 1}};
    render(<PokemonPageClient {...props} />);
  
    fireEvent.click(screen.getByLabelText('View previous Pokémon (0)'));
    
    // The router should not be called for the first Pokemon
    expect(mockRouter.push).toHaveBeenCalledTimes(2);
  });
  
  it('handles keydown events for accessibility', () => {
    render(<PokemonPageClient {...mockProps} />);
  
    const closeButton = screen.getByLabelText('Close Pokemon details');
    fireEvent.keyDown(closeButton, { key: 'Enter' });
    expect(mockRouter.push).toHaveBeenCalledWith('/1');
  
    const readMoreButton = screen.getByText('...Read More');
    fireEvent.keyDown(readMoreButton, { key: 'Enter' });
    expect(screen.getByText('A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.')).toBeInTheDocument();
  
    const readLessButton = screen.getByText('X');
    fireEvent.keyDown(readLessButton, { key: 'Enter' });
    expect(screen.queryByText('A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.')).not.toBeInTheDocument();
  });
  
});