// src/components/molecules/filter-modal/index.tsx

import React, { useState, useEffect } from 'react';
import MobileDropdown from '@/components/atoms/mobile-dropdown';
import StatsSlider from '@/components/atoms/stats-slider';

interface FilterModalProps {
  onClose: () => void;
  selectedTypes: string[];
  selectedGenders: string[];
  statsFilter: StatsFilter;
  onTypeChange: (types: string[]) => void;
  onGenderChange: (genders: string[]) => void;
  onStatsChange: (stats: StatsFilter) => void;
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

const FilterModal: React.FC<FilterModalProps> = ({
  onClose,
  selectedTypes,
  selectedGenders,
  statsFilter,
  onTypeChange,
  onGenderChange,
  onStatsChange
}) => {
  const [workingTypes, setWorkingTypes] = useState(selectedTypes);
  const [workingGenders, setWorkingGenders] = useState(selectedGenders);
  const [workingStats, setWorkingStats] = useState(statsFilter);

  const typeOptions = ['Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark', 'Fairy', 'Unknown', 'Shadow'];
  const genderOptions = ['Male', 'Female', 'Genderless'];

  useEffect(() => {
    setWorkingTypes(selectedTypes);
    setWorkingGenders(selectedGenders);
    setWorkingStats(statsFilter);
  }, [selectedTypes, selectedGenders, statsFilter]);

  const handleApply = () => {
    onTypeChange(workingTypes);
    onGenderChange(workingGenders);
    onStatsChange(workingStats);
    onClose();
  };

  const handleReset = () => {
    setWorkingTypes([]);
    setWorkingGenders([]);
    setWorkingStats(defaultStatsFilter);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-mainbg p-4 rounded-lg w-80 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <div className="mb-4">
          <MobileDropdown 
            label="Type" 
            options={typeOptions} 
            selectedOptions={workingTypes} 
            onChange={setWorkingTypes}
          />
        </div>
        <div className="mb-4">
          <MobileDropdown 
            label="Gender" 
            options={genderOptions} 
            selectedOptions={workingGenders} 
            onChange={setWorkingGenders}
          />
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Stats</h3>
          {Object.entries(workingStats).map(([stat, value]) => (
            <StatsSlider
              key={stat}
              label={stat}
              value={value}
              onChange={(newValue: any) => setWorkingStats(prev => ({ ...prev, [stat]: newValue }))}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-between">
          <button 
            className="px-4 py-2 bg-maintext text-white rounded"
            onClick={handleReset}
          >
            Reset
          </button>
          <button 
            className="px-4 py-2 bg-maintext text-white rounded"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;