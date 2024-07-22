import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import PokemonGrid from './index';


global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

jest.mock('./index', () => {
    const originalModule = jest.requireActual('./index');
    return {
      __esModule: true,
      ...originalModule,
      default: jest.fn(originalModule.default),
    };
  });

// Mocking next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mocking next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock components
jest.mock('../../../components/atoms/poke-card', () => ({
  __esModule: true,
  default: ({ name, number, onClick }: any) => (
    <div data-testid={`poke-card-${number}`} onClick={onClick}>
      {name}
    </div>
  ),
}));

jest.mock('../../../components/molecules/pagination', () => ({
  __esModule: true,
  default: ({ currentPage, totalPages }: any) => (
    <div data-testid="pagination">
      Page {currentPage} of {totalPages}
    </div>
  ),
}));

jest.mock('../../../components/molecules/gender-dd', () => ({
  __esModule: true,
  default: ({ initialSelectedGenders, onGenderChange }: any) => (
    <select
      data-testid="gender-dropdown"
      onChange={(e) => onGenderChange([e.target.value])}
      value={initialSelectedGenders[0] || ''}
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>
  ),
}));

jest.mock('../../../components/molecules/type-dd', () => ({
  __esModule: true,
  default: ({ initialSelectedTypes, onTypeChange }: any) => (
    <select
      data-testid="type-dropdown"
      onChange={(e) => onTypeChange([e.target.value])}
      value={initialSelectedTypes[0] || ''}
    >
      <option value="">Select Type</option>
      <option value="Fire">Fire</option>
      <option value="Water">Water</option>
    </select>
  ),
}));

jest.mock('../../../components/molecules/stats-dd', () => ({
  __esModule: true,
  default: ({ initialStats, onStatsChange }: any) => (
    <button
      data-testid="stats-dropdown"
      onClick={() => onStatsChange({ ...initialStats, hp: [0, 100] })}
    >
      Change Stats
    </button>
  ),
}));

jest.mock('../../../components/molecules/search', () => ({
  __esModule: true,
  default: ({ initialSearchQuery, onSearch }: any) => (
    <input
      data-testid="search-box"
      value={initialSearchQuery}
      onChange={(e) => onSearch(e.target.value)}
    />
  ),
}));

jest.mock('../../../components/molecules/filter-modal', () => ({
  __esModule: true,
  default: ({ onClose, onTypeChange, onGenderChange, onStatsChange }: any) => (
    <div data-testid="filter-modal">
      <button onClick={() => onTypeChange(['Fire'])}>Change Type</button>
      <button onClick={() => onGenderChange(['Male'])}>Change Gender</button>
      <button onClick={() => onStatsChange({ hp: [0, 100] })}>Change Stats</button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe('PokemonGrid', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockPokemon = [
    { name: 'Bulbasaur', number: 1, image: '/bulbasaur.png', types: ['grass'], gender_rate: 1, stats: [{ base_stat: 45, stat: { name: 'hp' } }] },
    { name: 'Charmander', number: 4, image: '/charmander.png', types: ['fire'], gender_rate: 1, stats: [{ base_stat: 39, stat: { name: 'hp' } }] },
  ];

  const defaultProps = {
    initialPokemon: mockPokemon,
    currentPage: 1,
    totalPages: 5,
    initialSearchQuery: '',
    initialSelectedTypes: [],
    initialSelectedGenders: [],
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders the PokemonGrid component', () => {
    render(<PokemonGrid {...defaultProps} />);
    expect(screen.getByTestId('search-box')).toBeInTheDocument();
    expect(screen.getByTestId('type-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('gender-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('stats-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByTestId('poke-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('poke-card-4')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    render(<PokemonGrid {...defaultProps} />);
    const searchBox = screen.getByTestId('search-box');
    
    await act(async () => {
      fireEvent.change(searchBox, { target: { value: 'Bulba' } });
    });
  
    await waitFor(() => {
      expect(screen.getByTestId('poke-card-1')).toBeInTheDocument();
      expect(screen.queryByTestId('poke-card-4')).not.toBeInTheDocument();
    });
  });

  it('handles type filter', async () => {
    render(<PokemonGrid {...defaultProps} />);
    const typeDropdown = screen.getByTestId('type-dropdown');
    fireEvent.change(typeDropdown, { target: { value: 'Fire' } });
    await waitFor(() => {
      expect(screen.queryByTestId('poke-card-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('poke-card-4')).toBeInTheDocument();
    });
  });

  it('handles gender filter', async () => {
    render(<PokemonGrid {...defaultProps} />);
    const genderDropdown = screen.getByTestId('gender-dropdown');
    fireEvent.change(genderDropdown, { target: { value: 'Male' } });
    await waitFor(() => {
      expect(screen.getByTestId('poke-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('poke-card-4')).toBeInTheDocument();
    });
  });

  it('handles stats filter', async () => {
    render(<PokemonGrid {...defaultProps} />);
    const statsDropdown = screen.getByTestId('stats-dropdown');
    fireEvent.click(statsDropdown);
    await waitFor(() => {
      expect(screen.getByTestId('poke-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('poke-card-4')).toBeInTheDocument();
    });
  });

  // it('handles card click', async () => {
  //   render(<PokemonGrid {...defaultProps} />);
  //   const card = screen.getByTestId('poke-card-1');
  //   fireEvent.click(card);
  //   expect(mockRouter.push).toHaveBeenCalledWith('/pokemon/1-bulbasaur');
  // });

//   it('handles filter modal on mobile', async () => {
//     Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
//     window.dispatchEvent(new Event('resize'));

//     render(<PokemonGrid {...defaultProps} />);
//     const filterButton = screen.getByLabelText('Open filter options');
//     fireEvent.click(filterButton);

//     await waitFor(() => {
//       expect(screen.getByTestId('filter-modal')).toBeInTheDocument();
//     });

//     fireEvent.click(screen.getByText('Change Type'));
//     fireEvent.click(screen.getByText('Change Gender'));
//     fireEvent.click(screen.getByText('Change Stats'));
//     fireEvent.click(screen.getByText('Close'));

//     await waitFor(() => {
//       expect(screen.queryByTestId('filter-modal')).not.toBeInTheDocument();
//     });
//   });

it('handles card click correctly', () => {
  const mockRouter = { push: jest.fn() };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  const mockProps = {
    initialPokemon: [
      { name: 'Bulbasaur', number: 1, image: 'bulbasaur.png', types: ['grass'], gender_rate: 1 }
    ],
    currentPage: 1,
    totalPages: 1,
    initialSearchQuery: '',
    initialSelectedTypes: [],
    initialSelectedGenders: [],
  };

  render(<PokemonGrid {...mockProps} />);

  const pokemonCard = screen.getByText('Bulbasaur');
  fireEvent.click(pokemonCard);

  expect(mockRouter.push).toHaveBeenCalledWith('/pokemon/1-bulbasaur?from=1');
});

  it('displays "No Pokémon found" message when filtered list is empty', async () => {
    render(<PokemonGrid {...defaultProps} />);
    const searchBox = screen.getByTestId('search-box');
    fireEvent.change(searchBox, { target: { value: 'Nonexistent Pokemon' } });
    await waitFor(() => {
      expect(screen.getByText('No Pokémon found matching the current filters.')).toBeInTheDocument();
    });
  });

  it('updates URL when filters change', async () => {
    render(<PokemonGrid {...defaultProps} />);
    const searchBox = screen.getByTestId('search-box');
    
    await act(async () => {
      fireEvent.change(searchBox, { target: { value: 'Bulba' } });
    });
  
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        expect.stringContaining('/1?search=Bulba'),
        { scroll: false }
      );
    });
  
    // Reset mock calls
    mockRouter.push.mockClear();
  
    const typeDropdown = screen.getByTestId('type-dropdown');
    
    await act(async () => {
      fireEvent.change(typeDropdown, { target: { value: 'Fire' } });
    });
  
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        expect.stringContaining('/1?search=Bulba&types=Fire'),
        { scroll: false }
      );
    });
  
    // Reset mock calls
    mockRouter.push.mockClear();
  
    const genderDropdown = screen.getByTestId('gender-dropdown');
    
    await act(async () => {
      fireEvent.change(genderDropdown, { target: { value: 'Male' } });
    });
  
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        expect.stringContaining('/1?search=Bulba&types=Fire&genders=Male'),
        { scroll: false }
      );
    });
  });
});