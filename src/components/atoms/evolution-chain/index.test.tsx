// src/components/atoms/evolution-chain/index.test.tsx

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EvolutionChain from './index';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock fetch function
global.fetch = jest.fn();

describe('EvolutionChain', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('1'),
    });
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders the component and fetches evolution chain data', async () => {
    const mockEvolutionChain = {
      chain: {
        species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
        evolves_to: [
          {
            species: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
            evolves_to: [
              {
                species: { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon-species/3/' },
              },
            ],
          },
        ],
      },
    };

    const mockPokemonData = {
      sprites: {
        other: {
          dream_world: {
            front_default: 'https://example.com/bulbasaur.png',
          },
        },
      },
      types: [{ type: { name: 'grass' } }],
      stats: [],
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockEvolutionChain) })
      .mockResolvedValue({ json: () => Promise.resolve(mockPokemonData) });

    render(<EvolutionChain id="001" chainUrl="https://pokeapi.co/api/v2/evolution-chain/1/" />);

    await waitFor(() => {
      expect(screen.getByText('Evolution')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByRole('img')).toHaveLength(6);
    });
  });

  it('handles error when fetching evolution chain fails', async () => {
    console.error = jest.fn();
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<EvolutionChain id="001" chainUrl="https://pokeapi.co/api/v2/evolution-chain/1/" />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching evolution chain:', expect.any(Error));
    });
  });
}); 