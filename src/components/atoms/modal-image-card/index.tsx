// src/components/atoms/modal-image-card/index.tsx
'use client';

import React from 'react';
import Image from 'next/image';

interface ModalCardProps {
  pokemonData: {
    name: string;
    image: string;
  };
  pokemonId: number;
  onClick: () => void;
}

const ModalImageCard: React.FC<ModalCardProps> = ({ pokemonData, pokemonId, onClick }) => {
  return (
    <div 
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="max-w-[170px] md:w-[200px] sm:w-[200px] h-[250px] rounded overflow-hidden border-2 border-dashed border-gray-300 cursor-pointer group-focus:ring-2 group-focus:ring-maintext"
      aria-label={`View details for ${pokemonData.name}`}
      role="button"
      tabIndex={0}
    >
      <div className="flex h-full flex-col justify-center items-center">
        <div className='pt-5 h-3/4 '>
          <Image 
            width={100} 
            height={100} 
            src={pokemonData.image ? pokemonData.image : ""} 
            alt={`An Image of ${pokemonData.name}`} 
            className='object-contain h-full'
          />
        </div>
      </div>
      <div className="text-center mt-2">
        <p className="text-sm font-semibold capitalize">{pokemonData.name}</p>
      </div>
    </div>
  );
};

export default ModalImageCard;