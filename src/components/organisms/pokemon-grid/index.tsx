// src/components/organisms/pokemon-grid/index.tsx
'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaBars } from "react-icons/fa";
import PokeCard from '@/components/atoms/poke-card';
import Pagination from '@/components/molecules/pagination';
import GenderDD from '@/components/molecules/gender-dd';
import TypeDD from '@/components/molecules/type-dd';
import StatsDD from '@/components/molecules/stats-dd';
import SearchBox from '@/components/molecules/search';
import FilterModal from '@/components/molecules/filter-modal';

interface Pokemon {
  name: string;
  number: number;
  image: string;
  types: string[];
  gender_rate: number;
  stats?: Array<{ base_stat: number; stat: { name: string } }>;
}

interface PokemonGridProps {
  initialPokemon: Pokemon[];
  currentPage: number;
  totalPages: number;
  initialSearchQuery: string;
  initialSelectedTypes: string[];
  initialSelectedGenders: string[];
}

interface StatsFilter {
  hp: [number, number];
  attack: [number, number];
  defense: [number, number];
  speed: [number, number];
  spAttack: [number, number];
  spDef: [number, number];
}

const defaultStatsFilter: StatsFilter = {
  hp: [0, 210],
  attack: [0, 210],
  defense: [0, 210],
  speed: [0, 210],
  spAttack: [0, 210],
  spDef: [0, 210]
};

const PokemonGrid: React.FC<PokemonGridProps> = ({ 
  initialPokemon, 
  currentPage, 
  totalPages, 
  initialSearchQuery, 
  initialSelectedTypes, 
  initialSelectedGenders 
}) => {
  const [pokemon, setPokemon] = useState<Pokemon[]>(initialPokemon);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>(initialPokemon);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedTypes, setSelectedTypes] = useState(initialSelectedTypes);
  const [selectedGenders, setSelectedGenders] = useState(initialSelectedGenders);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const router = useRouter();

  // const parseStatsFromURL = useCallback(() => {
  //   if (typeof window !== 'undefined') {
  //     const params = new URLSearchParams(window.location.search);
  //     const newStatsFilter = {...defaultStatsFilter};
  //     Object.keys(defaultStatsFilter).forEach(key => {
  //       const param = params.get(`stats_${key}`);
  //       if (param) {
  //         const [min, max] = param.split(',').map(Number);
  //         newStatsFilter[key as keyof StatsFilter] = [min, max];
  //       }
  //     });
  //     return newStatsFilter;
  //   }
  //   return defaultStatsFilter;
  // }, []);

  const parseStatsFromURL = useCallback(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const newStatsFilter = {...defaultStatsFilter};
      let hasStats = false;
      Object.keys(defaultStatsFilter).forEach(key => {
        const param = params.get(`stats_${key}`);
        if (param) {
          hasStats = true;
          const [min, max] = param.split(',').map(Number);
          newStatsFilter[key as keyof StatsFilter] = [min, max];
        }
      });
      return hasStats ? newStatsFilter : defaultStatsFilter;
    }
    return defaultStatsFilter;
  }, []);

  const [statsFilter, setStatsFilter] = useState<StatsFilter>(() => parseStatsFromURL());

  const fetchPokemonDetails = useCallback(async (pokemonList: Pokemon[]) => {
    const updatedPokemon = await Promise.all(pokemonList.map(async (p) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.number}/`);
      const data = await response.json();
      return {
        ...p,
        stats: data.stats
      };
    }));
    setPokemon(updatedPokemon);
    setFilteredPokemon(updatedPokemon);
  }, []);

  useEffect(() => {
    fetchPokemonDetails(initialPokemon);
    setSearchQuery(initialSearchQuery);
    setSelectedTypes(initialSelectedTypes);
    setSelectedGenders(initialSelectedGenders);
    setStatsFilter(parseStatsFromURL());
  }, [initialPokemon, fetchPokemonDetails, initialSearchQuery, initialSelectedTypes, initialSelectedGenders, parseStatsFromURL]);

  // const updateURL = useCallback((newSearch?: string, newTypes?: string[], newGenders?: string[], newStats?: StatsFilter) => {
  //   const params = new URLSearchParams();
  //   if (newSearch !== undefined && newSearch !== '') params.append('search', newSearch);
  //   if (newTypes !== undefined && newTypes.length > 0) params.append('types', newTypes.join(','));
  //   if (newGenders !== undefined && newGenders.length > 0) params.append('genders', newGenders.join(','));
  //   if (newStats !== undefined) {
  //     Object.entries(newStats).forEach(([key, value]) => {
  //       params.append(`stats_${key}`, `${value[0]},${value[1]}`);
  //     });
  //   }
    
  //   router.push(`/${currentPage}?${params.toString()}`, { scroll: false });
  // }, [currentPage, router]);

  const updateURL = useCallback((newSearch?: string, newTypes?: string[], newGenders?: string[], newStats?: StatsFilter) => {
    const params = new URLSearchParams();
    if (newSearch !== undefined && newSearch !== '') params.append('search', newSearch);
    if (newTypes !== undefined && newTypes.length > 0) params.append('types', newTypes.join(','));
    if (newGenders !== undefined && newGenders.length > 0) params.append('genders', newGenders.join(','));
    
    if (newStats !== undefined) {
      const hasNonDefaultStats = Object.entries(newStats).some(([key, value]) => {
        return value[0] !== defaultStatsFilter[key as keyof StatsFilter][0] || 
               value[1] !== defaultStatsFilter[key as keyof StatsFilter][1];
      });

      if (hasNonDefaultStats) {
        Object.entries(newStats).forEach(([key, value]) => {
          if (value[0] !== defaultStatsFilter[key as keyof StatsFilter][0] || 
              value[1] !== defaultStatsFilter[key as keyof StatsFilter][1]) {
            params.append(`stats_${key}`, `${value[0]},${value[1]}`);
          }
        });
      }
    }

    router.push(`/${currentPage}?${params.toString()}`, { scroll: false });
  }, [currentPage, router]);

  useEffect(() => {
    const filtered = pokemon.filter(p => {
      const paddedNumber = p.number.toString().padStart(3, '0');
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            paddedNumber.includes(searchQuery);
      const matchesType = selectedTypes.length === 0 || 
                          selectedTypes.some(selectedType => 
                            p.types.includes(selectedType.toLowerCase())
                          );
      
      const matchesGender = selectedGenders.length === 0 || 
                            (selectedGenders.includes('Male') && p.gender_rate !== 8) ||
                            (selectedGenders.includes('Female') && p.gender_rate !== 0) ||
                            (selectedGenders.includes('Genderless') && p.gender_rate === -1);
      
      const matchesStats = Object.entries(statsFilter).every(([stat, [min, max]]) => {
        let statName = stat.toLowerCase();
        if (statName === 'spattack') statName = 'special-attack';
        if (statName === 'spdef') statName = 'special-defense';
        
        const pokemonStat = p.stats?.find(s => s.stat.name === statName)?.base_stat;
        
        return pokemonStat === undefined || (pokemonStat >= min && pokemonStat <= max);
      });

      return matchesSearch && matchesType && matchesGender && matchesStats;
    });
    
    setFilteredPokemon(filtered);
  }, [searchQuery, selectedTypes, selectedGenders, statsFilter, pokemon]);

  const handleCardClick = (number: number, name: string) => {
    router.push(`/pokemon/${number}-${name.toLowerCase()}?from=${currentPage}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateURL(query, selectedTypes, selectedGenders, statsFilter);
  };

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types);
    updateURL(searchQuery, types, selectedGenders, statsFilter);
  };

  const handleGenderChange = (genders: string[]) => {
    setSelectedGenders(genders);
    updateURL(searchQuery, selectedTypes, genders, statsFilter);
  };

  const handleStatsChange = (newStats: StatsFilter) => {
    setStatsFilter(newStats);
    updateURL(searchQuery, selectedTypes, selectedGenders, newStats);
  };

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  }
  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  }

  return (
    <>
      <div className="sr-only">
        <a href="#main-content">Skip to main content</a>
      </div>
      <div className="flex items-center p-4 mb-[-20px] mt-[-30px]">
        <div className="flex items-center flex-wrap ml-[-40px] w-full">
          <SearchBox 
            initialSearchQuery={searchQuery} 
            onSearch={handleSearch}
          />
        </div>
        <button 
            className="ml-2 p-2 rounded-md lg:hidden mt-[-6px] relative z-10"
            onClick={openFilterModal}
            aria-label="Open filter options"
          >
            <FaBars />
          </button>
        <div className="hidden lg:flex mt-[-5px]">
          <div className='mt-[5px] ml-[0px]'>
          <TypeDD 
            initialSelectedTypes={selectedTypes} 
            onTypeChange={handleTypeChange}
          />
          </div>
          <div className='mt-[5px]'>
          <GenderDD 
            initialSelectedGenders={selectedGenders} 
            onGenderChange={handleGenderChange}
          />
          </div>
          <div className='ml-[0px] mt-[5px]'>
          <StatsDD 
            initialStats={statsFilter}
            onStatsChange={handleStatsChange}
          />
          </div>
        </div>
      </div>
      
      <main id="main-content">
        {filteredPokemon.length === 0 ? (
          <div className="text-center py-8">No Pokémon found matching the current filters.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
              {filteredPokemon.map((p) => (
                <PokeCard
                  key={p.number}
                  imageSrc={p.image}
                  name={p.name}
                  number={p.number}
                  types={p.types}
                  onClick={() => handleCardClick(p.number, p.name)}
                />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </>
        )}
      </main>

      {isFilterModalOpen && (
        <FilterModal
          onClose={closeFilterModal}
          selectedTypes={selectedTypes}
          selectedGenders={selectedGenders}
          statsFilter={statsFilter}
          onTypeChange={handleTypeChange}
          onGenderChange={handleGenderChange}
          onStatsChange={handleStatsChange}
        />
      )}
    </>
  );
};

export default PokemonGrid;