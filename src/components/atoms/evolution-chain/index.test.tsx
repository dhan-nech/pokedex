import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import EvolutionChain from './index';

const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

describe('EvolutionChain', () => {
  const props = {
    id: '1',
    chainUrl: 'https://pokeapi.co/api/v2/evolution-chain/1/',
  };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders the evolution chain title', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ chain: { species: { name: 'bulbasaur' }, evolves_to: [] } }),
    });

    render(<EvolutionChain {...props} />);

    expect(screen.getByText('Evolution')).toBeInTheDocument();
  });

  it('fetches and displays a single-stage evolution chain', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ chain: { species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' }, evolves_to: [] } }),
    }).mockResolvedValueOnce({
      json: () => Promise.resolve({ 
        sprites: { other: { dream_world: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg' } } },
        types: [{ type: { name: 'grass' } }],
        stats: []
      }),
    });

    await act(async () => {
      render(<EvolutionChain {...props} />);
    });

    await waitFor(() => {
      const images = screen.getAllByAltText('An Image of bulbasaur');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg');
    });
  });

  it('fetches and displays a multi-stage evolution chain', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ 
        chain: { 
          species: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon-species/4/' }, 
          evolves_to: [{ 
            species: { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon-species/5/' },
            evolves_to: [{ 
              species: { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon-species/6/' },
              evolves_to: []
            }]
          }]
        } 
      }),
    });

    const mockPokemonResponse = (id: string) => ({
      json: () => Promise.resolve({ 
        sprites: { other: { dream_world: { front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg` } } },
        types: [{ type: { name: 'fire' } }],
        stats: []
      }),
    });

    mockFetch.mockResolvedValueOnce(mockPokemonResponse('4'))
              .mockResolvedValueOnce(mockPokemonResponse('5'))
              .mockResolvedValueOnce(mockPokemonResponse('6'));

    await act(async () => {
      render(<EvolutionChain {...props} />);
    });

    await waitFor(() => {
      expect(screen.getAllByAltText('An Image of charmander')).toHaveLength(2);
      expect(screen.getAllByAltText('An Image of charmeleon')).toHaveLength(2);
      expect(screen.getAllByAltText('An Image of charizard')).toHaveLength(2);
    });
  });

  it('handles fetch errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API error'));

    console.error = jest.fn();

    await act(async () => {
      render(<EvolutionChain {...props} />);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching evolution chain:', expect.any(Error));
    });

    expect(screen.queryByAltText(/An Image of/)).not.toBeInTheDocument();
  });

  it('displays arrow icons between evolution stages', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ 
        chain: { 
          species: { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon-species/7/' }, 
          evolves_to: [{ 
            species: { name: 'wartortle', url: 'https://pokeapi.co/api/v2/pokemon-species/8/' },
            evolves_to: []
          }]
        } 
      }),
    });

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ 
        sprites: { other: { dream_world: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/7.svg' } } },
        types: [{ type: { name: 'water' } }],
        stats: []
      }),
    }).mockResolvedValueOnce({
      json: () => Promise.resolve({ 
        sprites: { other: { dream_world: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/8.svg' } } },
        types: [{ type: { name: 'water' } }],
        stats: []
      }),
    });

    await act(async () => {
      render(<EvolutionChain {...props} />);
    });

    await waitFor(() => {
      expect(screen.getAllByAltText('An Image of squirtle')).toHaveLength(2);
      expect(screen.getAllByAltText('An Image of wartortle')).toHaveLength(2);
      expect(screen.getAllByTestId('evolution-arrow')).toHaveLength(1);
    });
  });
});