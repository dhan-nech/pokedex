// src/components/organisms/pokemon-details/index.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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
  
  
  
  it('handles Pokemon with no gender', () => {
    const noGenderProps = {
      ...mockProps,
      initialDataSpecies: {
        ...mockProps.initialDataSpecies,
        gender_rate: -1,
      },
    };
  
    render(<PokemonPageClient {...noGenderProps} />);
  
    expect(screen.getByText('Genderless')).toBeInTheDocument();
  });
  
  it('handles Pokemon with only male gender', () => {
    const maleOnlyProps = {
      ...mockProps,
      initialDataSpecies: {
        ...mockProps.initialDataSpecies,
        gender_rate: 0,
      },
    };
  
    render(<PokemonPageClient {...maleOnlyProps} />);
  
    expect(screen.getByText('Male')).toBeInTheDocument();
  });
  
  it('handles Pokemon with only female gender', () => {
    const femaleOnlyProps = {
      ...mockProps,
      initialDataSpecies: {
        ...mockProps.initialDataSpecies,
        gender_rate: 8,
      },
    };
  
    render(<PokemonPageClient {...femaleOnlyProps} />);
  
    expect(screen.getByText('Female')).toBeInTheDocument();
  });
  
  it('handles Pokemon with multiple types', () => {
    const multiTypeProps = {
      ...mockProps,
      initialStructuredData: {
        ...mockProps.initialStructuredData,
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      },
      initialPokemonData: {
        ...mockProps.initialPokemonData,
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      },
    };
  
    render(<PokemonPageClient {...multiTypeProps} />);
  
    const typesSection = screen.getByText('Types').closest('div');
    expect(typesSection).not.toBeNull();
    
    if (typesSection) {
      expect(within(typesSection).getByText('grass')).toBeInTheDocument();
      expect(within(typesSection).getByText('poison')).toBeInTheDocument();
    }
  });
  
  it('handles long descriptions', () => {
    const longDescriptionProps = {
      ...mockProps,
      initialDataSpecies: {
        ...mockProps.initialDataSpecies,
        flavor_text_entries: [
          { 
            language: { name: 'en' }, 
            flavor_text: 'This is a very long description that exceeds 150 characters. It should be truncated in the initial view and fully visible when expanded. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
          }
        ],
      },
    };
  
    render(<PokemonPageClient {...longDescriptionProps} />);
  
    expect(screen.getByText(/This is a very long description/)).toBeInTheDocument();
    expect(screen.getByText('...Read More')).toBeInTheDocument();
  
    fireEvent.click(screen.getByText('...Read More'));
  
    expect(screen.getByText(/Lorem ipsum dolor sit amet, consectetur adipiscing elit./)).toBeInTheDocument();
  });
  
  it('handles Pokemon with all stats', () => {
    const allStatsProps = {
      ...mockProps,
      initialStructuredData: {
        ...mockProps.initialStructuredData,
        stats: [
          { base_stat: 45, stat: { name: 'hp' } },
          { base_stat: 49, stat: { name: 'attack' } },
          { base_stat: 49, stat: { name: 'defense' } },
          { base_stat: 65, stat: { name: 'special-attack' } },
          { base_stat: 65, stat: { name: 'special-defense' } },
          { base_stat: 45, stat: { name: 'speed' } },
        ],
      },
    };
  
    render(<PokemonPageClient {...allStatsProps} />);
  
    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('Attack')).toBeInTheDocument();
    expect(screen.getByText('Defense')).toBeInTheDocument();
    expect(screen.getByText('Sp. Attack')).toBeInTheDocument();
    expect(screen.getByText('Sp. Def.')).toBeInTheDocument();
    expect(screen.getByText('Speed')).toBeInTheDocument();
  });
  
});