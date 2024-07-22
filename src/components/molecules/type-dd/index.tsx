// src/components/molecules/type-dd/index.tsx
'use client'

import React, { useState } from 'react';
import Dropdown from '@/components/atoms/dropdown';

interface TypeDDProps {
  initialSelectedTypes: string[];
  onTypeChange?: (types: string[]) => void;
}

const TypeDD: React.FC<TypeDDProps> = ({ initialSelectedTypes, onTypeChange }) => {
  const [selectedTypes, setSelectedTypes] = useState(initialSelectedTypes);
  const options = ['Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass']

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types);
    if (onTypeChange) {
      onTypeChange(types);
    }
  };

  return (
    <div>
      <Dropdown label="Type" options={options} selectedOptions={selectedTypes} onChange={handleTypeChange} />
    </div>
  );
};

export default TypeDD;