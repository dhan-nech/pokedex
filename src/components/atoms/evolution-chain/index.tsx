// src\components\atoms\evolution-chain\index.tsx
'use client';
import React, { useEffect, useState } from 'react';
import ModalImageCard from '../modal-image-card';

interface EvolutionChainProps {
  id: string;
  chainUrl: string;
}

const EvolutionChain: React.FC<EvolutionChainProps> = ({ id, chainUrl }) => {
  const [evolutionChainData, setEvolutionChainData] = useState<any>();
  const [speciesList, setSpeciesList] = useState<any[]>([]);
  const [cardListData, setCardListData] = useState<any[]>([]);

  const fetchEvolutionChain = async (url: string = chainUrl) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setEvolutionChainData(data);
    } catch (err) {
      console.error('Error fetching evolution chain:', err);
    }
  }

  useEffect(() => {
    fetchEvolutionChain();
  }, [chainUrl]);

  const extractSpecies = (chain: any) => {
    let speciesArray: any[] = [];

    const traverseChain = (node: any) => {
      if (node.species) {
        speciesArray.push(node.species);
      }
      if (node.evolves_to && node.evolves_to.length > 0) {
        node.evolves_to.forEach((evolution: any) => traverseChain(evolution));
      }
    };

    traverseChain(chain);
    setSpeciesList(speciesArray);
  };

  useEffect(() => {
    if (evolutionChainData) {
      extractSpecies(evolutionChainData.chain);
    }
  }, [evolutionChainData]);

  const fetchPokemonImage = async (pokemonId: number) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Pokemon image:', error);
    }
  };

  const cleanList = async () => {
    if (speciesList && speciesList.length > 0) {
      const cleanedData = await Promise.all(
        speciesList.map(async (species: any) => {
          const urlParts = species.url.split('/');
          const pid = parseInt(urlParts[urlParts.length - 2]);
          const data = await fetchPokemonImage(pid);
          return {
            name: species.name,
            id: pid,
            image: data.sprites.other.dream_world.front_default || data.sprites.front_default,
            types: data.types,
            stats: data.stats,
          };
        })
      );
      setCardListData(cleanedData);
    }
  };

  useEffect(() => {
    cleanList();
  }, [speciesList]);

  return (
    <div className='py-4'>
      <h2 className="text-lg font-bold mb-2">Evolution</h2>
      <div className="flex justify-center items-center">
        <div className="flex items-center justify-between w-full">
          {cardListData.map((cardData, index) => (
            <React.Fragment key={index}>
              <div className='hidden md:block'>
                <ModalImageCard
                  pokemonData={cardData}
                  pokemonId={cardData.id}
                />
              </div>
              <div className='md:hidden'>
                <ModalImageCard
                  pokemonData={cardData}
                  pokemonId={cardData.id}
                />
              </div>
              {index < cardListData.length - 1 && (
                <div className="flex items-center" data-testid="evolution-arrow">
                  <div className="flex-grow border-t-2 border-gray-400"></div>
                  <div className="ml-2 mr-2">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                  <div className="flex-grow border-t-2 border-gray-400"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvolutionChain;