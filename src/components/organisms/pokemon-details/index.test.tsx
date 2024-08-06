import React from 'react';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import PokemonPageClient from './index';

// Mock Next.js router and useSearchParams
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('../../atoms/evolution-chain', () => {
  return function DummyEvolutionChain() {
    return <div>Evolution Chain</div>;
  }
});

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

describe('PokemonPageClient', () => {
  const mockInitialData = {
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
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg',
      types: [{ type: { name: 'grass' } }],
      id: 1,
      name: 'bulbasaur',
    },
  };

  const mockRouter = {
    push: jest.fn(),
  };

  const mockSearchParams = {
    get: jest.fn().mockReturnValue('1'),
  };

  // beforeEach(() => {
  //   (useRouter as jest.Mock).mockReturnValue(mockRouter);
  //   (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  // });

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    jest.clearAllMocks();
  });

  it('renders PokemonPageClient correctly', () => {
    render(<PokemonPageClient {...mockInitialData} />);
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('001')).toBeInTheDocument();
    expect(screen.getByAltText('An Image of bulbasaur')).toBeInTheDocument();
  });

  it('displays Pokemon description', () => {
    render(<PokemonPageClient {...mockInitialData} />);
    expect(screen.getByText(/A strange seed was planted on its back at birth/)).toBeInTheDocument();
  });


  it('handles close button', () => {
    render(<PokemonPageClient {...mockInitialData} />);
    fireEvent.click(screen.getByLabelText('Close Pokemon details'));
    expect(mockRouter.push).toHaveBeenCalledWith('/1');
  });

  it('renders CreatureDetails correctly', () => {
    render(<PokemonPageClient {...mockInitialData} />);
    expect(screen.getByText('Height')).toBeInTheDocument();
    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByText('Gender(s)')).toBeInTheDocument();
    expect(screen.getByText('Egg Groups')).toBeInTheDocument();
  });

  it('renders CreatureInfo correctly', () => {
    render(<PokemonPageClient {...mockInitialData} />);
    expect(screen.getByText('Abilities')).toBeInTheDocument();
    expect(screen.getByText('Types')).toBeInTheDocument();
    expect(screen.getByText('Weak Against')).toBeInTheDocument();
  });

  it('renders Stats correctly', () => {
    render(<PokemonPageClient {...mockInitialData} />);
    expect(screen.getByText('Stats')).toBeInTheDocument();
    expect(screen.getByText('HP')).toBeInTheDocument();
  });

  it('renders EvolutionChain correctly', () => {
    render(<PokemonPageClient {...mockInitialData} />);
    expect(screen.getByText('Evolution Chain')).toBeInTheDocument();
  });

  it('renders EvolutionChain correctly', () => {
    render(<PokemonPageClient {...mockInitialData} />);
    const evolutionSection = screen.getByText('Evolution Chain');
    expect(evolutionSection).toBeInTheDocument();
    expect(evolutionSection.closest('div')).toBeInTheDocument();
  });
  
  it('handles read more and read less functionality', async () => {
    render(<PokemonPageClient {...mockInitialData} />);
    const readMoreButton = screen.getByText('...Read More');
    fireEvent.click(readMoreButton);
    
    await waitFor(() => {
      expect(screen.getByText('X')).toBeInTheDocument();
    });

    const readLessButton = screen.getByText('X');
    fireEvent.click(readLessButton);

    await waitFor(() => {
      expect(screen.queryByText('X')).not.toBeInTheDocument();
    });
  });

  it('handles previous Pokemon navigation', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          ...mockInitialData.initialStructuredData,
          id: 1,
          name: 'bulbasaur'
        }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
          evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
        }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
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
        }),
      });
  
    render(<PokemonPageClient {...mockInitialData} />);
    
    const prevButtons = screen.getAllByLabelText('View previous Pokémon (0)');
    
    await act(async () => {
      fireEvent.click(prevButtons[0]);
    });
  
    expect(mockRouter.push).toHaveBeenCalledTimes(0);
  });
  
  it('handles previous Pokemon navigation on mobile', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          ...mockInitialData.initialStructuredData,
          id: 1,
          name: 'bulbasaur'
        }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
          evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
        }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
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
        }),
      });
    
    render(<PokemonPageClient {...mockInitialData} />);
    
    const prevButtons = screen.getAllByLabelText('View previous Pokémon (0)');
    
    await act(async () => {
      fireEvent.click(prevButtons[1]);
    });
  
    expect(mockRouter.push).toHaveBeenCalledTimes(0);
  });

  it('handles next Pokemon navigation', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          ...mockInitialData.initialStructuredData,
          id: 2,
          name: 'ivysaur'
        }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
          evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
        }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
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
        }),
      });
  
    render(<PokemonPageClient {...mockInitialData} />);
    
    const nextButtons = screen.getAllByLabelText('View next Pokémon (2)');
    
    await act(async () => {
      fireEvent.click(nextButtons[0]);
    });
  
    expect(mockRouter.push).toHaveBeenCalledTimes(0);
  });
  
  it('handles next Pokemon navigation on mobile', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          ...mockInitialData.initialStructuredData,
          id: 2,
          name: 'ivysaur'
        }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
          evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
        }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
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
        }),
      });
    
    render(<PokemonPageClient {...mockInitialData} />);
    
    const nextButtons = screen.getAllByLabelText('View next Pokémon (2)');
    
    await act(async () => {
      fireEvent.click(nextButtons[1]);
    });
  
    expect(mockRouter.push).toHaveBeenCalledTimes(0);
  });

  

  it('handles keyboard navigation', () => {
    render(<PokemonPageClient {...mockInitialData} />);
    const closeButton = screen.getByLabelText('Close Pokemon details');
    fireEvent.keyDown(closeButton, { key: 'Enter' });
    expect(mockRouter.push).toHaveBeenCalledWith('/1');
  });

  it('displays full description when it\'s short', () => {
    const shortDescriptionData = {
      ...mockInitialData,
      initialDataSpecies: {
        ...mockInitialData.initialDataSpecies,
        flavor_text_entries: [{ language: { name: 'en' }, flavor_text: 'Short description.' }],
      },
    };
    render(<PokemonPageClient {...shortDescriptionData} />);
    expect(screen.getByText('Short description....', { exact: false })).toBeInTheDocument();
    
    // Check if the "Read More" button is present
    const readMoreButton = screen.getByText('...Read More');
    expect(readMoreButton).toBeInTheDocument();
    
    // Optionally, you can check if clicking the button doesn't change anything
    fireEvent.click(readMoreButton);
    expect(screen.getByText('Short description....', { exact: false })).toBeInTheDocument();
  });

  it('handles missing flavor text entries', () => {
    const noDescriptionData = {
      ...mockInitialData,
      initialDataSpecies: {
        ...mockInitialData.initialDataSpecies,
        flavor_text_entries: [],
      },
    };
    render(<PokemonPageClient {...noDescriptionData} />);
    expect(screen.getByText('No description available.', { exact: false })).toBeInTheDocument();
  });

  it('displays correct gender information', () => {
    const femaleOnlyData = {
      ...mockInitialData,
      initialDataSpecies: {
        ...mockInitialData.initialDataSpecies,
        gender_rate: 8,
      },
    };
    render(<PokemonPageClient {...femaleOnlyData} />);
    expect(screen.getByText('Female')).toBeInTheDocument();
  });

  it('handles missing egg groups', () => {
    const noEggGroupsData = {
      ...mockInitialData,
      initialDataSpecies: {
        ...mockInitialData.initialDataSpecies,
        egg_groups: [],
      },
    };
    render(<PokemonPageClient {...noEggGroupsData} />);
    expect(screen.getByText('Egg Groups')).toBeInTheDocument();
    expect(screen.getByText('Egg Groups').nextSibling).toHaveTextContent('');
  });

  it('displays correct type information for multiple types', () => {
    const multiTypeData = {
      ...mockInitialData,
      initialStructuredData: {
        ...mockInitialData.initialStructuredData,
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      },
    };
    render(<PokemonPageClient {...multiTypeData} />);
    
    // Check for the Types section
    const typesSection = screen.getByText('Types').closest('div');
    expect(typesSection).not.toBeNull();
    
    if (typesSection) {
      expect(within(typesSection).getByText('grass')).toBeInTheDocument();
      expect(within(typesSection).getByText('poison')).toBeInTheDocument();
    }
  });
});