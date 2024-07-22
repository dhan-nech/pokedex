// src/components/molecules/gender-dd/index.tsx
'use client'

import React, { useState } from 'react';
import Dropdown from '@/components/atoms/dropdown';

interface GenderDDProps {
  initialSelectedGenders: string[];
  onGenderChange?: (genders: string[]) => void;
}

const GenderDD: React.FC<GenderDDProps> = ({ initialSelectedGenders, onGenderChange }) => {
  const [selectedGenders, setSelectedGenders] = useState(initialSelectedGenders);
  const options = ['Male', 'Female', 'Genderless'];

  const handleGenderChange = (genders: string[]) => {
    setSelectedGenders(genders);
    if (onGenderChange) {
      onGenderChange(genders);
    }
  };

  return (
    <div>
      <Dropdown label="Gender" options={options} selectedOptions={selectedGenders} onChange={handleGenderChange} />
    </div>
  );
};

export default GenderDD;