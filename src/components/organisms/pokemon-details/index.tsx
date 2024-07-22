'use client'

import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import CreatureInfo from '@/components/atoms/creature-info';
import CreatureDetails from '@/components/atoms/creature-details';
import Stats from '@/components/atoms/modal-stats';
import EvolutionChain from '@/components/atoms/evolution-chain';
import ModalControlButtons from '@/components/atoms/modal-control-buttons';
import CloseButton from '@/components/atoms/close-button';

interface PokemonPageClientProps {
  initialStructuredData: any;
  initialDataSpecies: any;
  initialPokemonData: {
    image: string;
    types: any[];
    id: number;
    name: string;
  };
}

// New helper function to format Pokemon number
const formatPokemonNumber = (id: number): string => {
  return id.toString().padStart(3, '0');
};

async function fetchPokemonData(id: string) {
  try {
    const [pokemonRes, speciesRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    ]);

    const pokemonData = await pokemonRes.json();
    const speciesData = await speciesRes.json();

    return {
      structuredData: pokemonData,
      dataSpecies: speciesData,
      pokemonData: {
        image: pokemonData.sprites.other.dream_world.front_default || pokemonData.sprites.front_default,
        types: pokemonData.types,
        id: pokemonData.id,
        name: pokemonData.name
      }
    };
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    return null;
  }
}

const PokemonPageClient: React.FC<PokemonPageClientProps> = ({
  initialStructuredData,
  initialDataSpecies,
  initialPokemonData
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const originalPage = searchParams.get('from') || '1';
  const [structuredData, setStructuredData] = useState(initialStructuredData);
  const [dataSpecies, setDataSpecies] = useState(initialDataSpecies);
  const [pokemonData, setPokemonData] = useState(initialPokemonData);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleReadMore = () => setShowFullDescription(true);
  const handleReadLess = () => setShowFullDescription(false);

  const handleClose = () => router.push(`/${originalPage}`);

  const handlePrevCard = async () => {
    if (pokemonData.id > 1) {
      const prevId = pokemonData.id - 1;
      const prevPokemonData = await fetchPokemonData(prevId.toString());
      if (prevPokemonData) {
        setPokemonData(prevPokemonData.pokemonData);
        setStructuredData(prevPokemonData.structuredData);
        setDataSpecies(prevPokemonData.dataSpecies);
        router.push(`/pokemon/${prevId}-${prevPokemonData.pokemonData.name.toLowerCase()}?from=${originalPage}`);
      }
    }
  };

  const handleNextCard = async () => {
    const nextId = pokemonData.id + 1;
    const nextPokemonData = await fetchPokemonData(nextId.toString());
    if (nextPokemonData) {
      setPokemonData(nextPokemonData.pokemonData);
      setStructuredData(nextPokemonData.structuredData);
      setDataSpecies(nextPokemonData.dataSpecies);
      router.push(`/pokemon/${nextId}-${nextPokemonData.pokemonData.name.toLowerCase()}?from=${originalPage}`);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const description = dataSpecies?.flavor_text_entries
    .filter((entry: { language: { name: string; }; }) => entry.language.name === 'en')
    .slice(0, 8)
    .map((entry: { flavor_text: string; }) => entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' '))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim() || 'No description available.';

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getBackgroundColor = () => {
    if (pokemonData.types && pokemonData.types.length > 0) {
      const type1 = pokemonData.types[0].type.name.toLowerCase();
      if (pokemonData.types.length > 1) {
        const type2 = pokemonData.types[1].type.name.toLowerCase();
        return `linear-gradient(to bottom, var(--color-${type1}) 0%, var(--color-${type2}) 100%)`;
      } else {
        return `var(--color-${type1})`;
      }
    }
    return 'var(--color-normal)';
  };

  // Use the new formatting function
  const formattedPokemonNumber = formatPokemonNumber(pokemonData.id);

  return (
    <div className="fixed inset-0 z-50 flex overflow-y-auto justify-center bg-pokdetbg">
      <div className="p-5 bg-mainbg h-fit rounded-lg max-w-4xl w-full relative flex flex-col" role="dialog" aria-labelledby="pokemon-details-title">
        <div className="flex ">
          <div className="w-1/3 h-full p-4">
            <div 
              className="max-w-[170px] md:w-[200px] sm:w-[200px] h-[250px] rounded overflow-hidden border-2 border-dashed border-gray-300"
              style={{ background: getBackgroundColor() }}
            >
              <div className="flex h-full flex-col justify-center items-center">
                <div className='pt-5 h-3/4 '>
                  <Image 
                    width={100} 
                    height={100} 
                    src={pokemonData.image} 
                    alt={`An Image of ${pokemonData.name}`} 
                    className='object-contain h-full'
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-2/3 p-4">
            <div className="flex justify-between items-center border-b pb-4 mb-4 ">
              <h1 id="pokemon-details-title" className='text-2xl font-bold border-r border-SECONDARY pr-5'>
                {capitalizeFirstLetter(structuredData?.name)}
              </h1>
              <div className='text-xl font-medium border-r border-SECONDARY pr-5'>
                {formattedPokemonNumber}
              </div>
              <div className="hidden sm:block">
                <ModalControlButtons 
                  onPrevCard={handlePrevCard}
                  onNextCard={handleNextCard}
                  id={pokemonData.id}
                  name={pokemonData.name}
                />
              </div>
              <div className='block'>
                <CloseButton onClick={handleClose} />
              </div>
            </div>
            <div className="text-gray-700">
              {`${description.slice(0, 150)}...`}
              {!showFullDescription && (
                <button
                  className="text-blue-500 hover:text-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded px-1"
                  onClick={handleReadMore}
                  onKeyDown={(e) => handleKeyDown(e, handleReadMore)}
                >
                  ...Read More
                </button>
              )}
            </div>
          </div>
          {showFullDescription && (
            <div className="flex bg-blue-900 rounded-md justify-between items-start top-72 absolute ml-4 mr-8">
              <div className='flex w-8/10 p-2'>
                <p className="text-white">{description}</p>
              </div>
              <div className='flex w-2/10 pr-3'>
                <button
                  className="text-white hover:text-gray-300 focus:ring-2 focus:ring-white focus:outline-none rounded px-1"
                  onClick={handleReadLess}
                  onKeyDown={(e) => handleKeyDown(e, handleReadLess)}
                  aria-label="Close full description"
                >
                  X
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <CreatureDetails
            name={structuredData?.name}
            id={formattedPokemonNumber}
            height={structuredData?.height}
            weight={structuredData?.weight}
            eggGroups={dataSpecies?.egg_groups}
            genderRate={dataSpecies?.gender_rate}
          />
          <CreatureInfo
            name={structuredData?.name}
            id={pokemonData.id}
            types={structuredData?.types}
            abilities={structuredData?.abilities}
          />
          <Stats
            data={structuredData?.stats}
          />
         
          <EvolutionChain id={formattedPokemonNumber} chainUrl={dataSpecies?.evolution_chain.url}/>
        </div>
      </div>
    </div>
  );
}

export default PokemonPageClient;