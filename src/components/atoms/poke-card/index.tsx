// src\components\atoms\poke-card\index.tsx
'use client'
import Image from 'next/image';
import React, { KeyboardEvent } from 'react';

interface CardProps {
  imageSrc: string;
  name: string;
  number: number;
  types: string[];
  onClick: () => void;
}

const PokeCard: React.FC<CardProps> = ({ imageSrc, name, number, types, onClick }) => {
  const gradientStyle = {
    background: types.length > 1
      ? `linear-gradient(to bottom, var(--color-${types[0].toLowerCase()}) 0%, var(--color-${types[1].toLowerCase()}) 100%)`
      : `var(--color-${types[0].toLowerCase()})`,
    borderImage: 'url("data:image/svg+xml,%3csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3crect width=\'100%25\' height=\'100%25\' fill=\'none\' stroke=\'%23000000\' stroke-width=\'1\' stroke-dasharray=\'3%2c 4\' stroke-dashoffset=\'0\' stroke-linecap=\'square\'/%3e%3c/svg%3e")',
    borderImageSlice: 1,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
    overflow: 'hidden',
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick();
    }
  };

  return (
    <div
      className="p-2 flex flex-col cursor-pointer h-full w-[164px]"
      style={gradientStyle}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${name}, number ${number}`}
    >
      <div className="h-[150px] w-24 mx-auto mb-2 pt-5">
        <Image src={imageSrc} alt={`An Image of ${name}`} className="mx-auto object-contain" height={100} width={96} />
      </div>
      <span className="text-lg font-bold mb-1 text-center capitalize">{name}</span>
      <p className="text-md font-bold text-center">{number.toString().padStart(3, '0')}</p>
    </div>
  );
};

export default PokeCard;