// src\components\atoms\modal-image-card\index.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ModalCardProps {
  pokemonData: any;
  pokemonId: number;
}

const ModalImageCard: React.FC<ModalCardProps> = ({ pokemonData, pokemonId }) => {
  return (
    <Link 
      href={`/pokemon/${pokemonId}-${pokemonData.name.toLowerCase()}`}
      className="focus:outline-none group"
    >
      <div 
        className="max-w-[170px] md:w-[200px] sm:w-[200px] h-[250px] rounded overflow-hidden border-2 border-dashed border-gray-300 cursor-pointer group-focus:ring-2 group-focus:ring-maintext"
        aria-label={`View details for ${pokemonData.name}`}
      >
        <div className="flex h-full flex-col justify-center items-center">
          <div className='pt-5 h-3/4 '>
            <Image 
              width={100} 
              height={100} 
              src={pokemonData && pokemonData.image ? pokemonData.image : ""} 
              alt={`An Image of ${pokemonData.name}`} 
              className='object-contain h-full'
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ModalImageCard;