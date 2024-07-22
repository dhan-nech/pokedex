// src/components/molecules/stats-dd/index.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react';
import StatsSlider from '@/components/atoms/stats-slider';

interface StatsDDProps {
  initialStats: StatsFilter;
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

const defaultStats: StatsFilter = {
  hp: [0, 210],
  attack: [0, 210],
  defense: [0, 210],
  speed: [0, 210],
  spAttack: [0, 210],
  spDef: [0, 210]
};

const statLabels: { [key in keyof StatsFilter]: string } = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  speed: 'Speed',
  spAttack: 'Sp. Attack',
  spDef: 'Sp. Defense'
};

const StatsDD: React.FC<StatsDDProps> = ({ initialStats, onStatsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState(initialStats);
  const [workingStats, setWorkingStats] = useState(initialStats);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleStatsChange = (stat: keyof StatsFilter, newValue: [number, number]) => {
    setWorkingStats(prev => ({ ...prev, [stat]: newValue }));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setWorkingStats(stats); // Reset working stats to current stats when opening
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setWorkingStats(stats); // Reset working stats when closing without applying
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [stats]);

  const resetStats = () => {
    setWorkingStats(defaultStats);
  };

  const applyStats = () => {
    setStats(workingStats);
    onStatsChange(workingStats);
    setIsOpen(false);
  };

  const hasChanges = JSON.stringify(stats) !== JSON.stringify(workingStats);
  const isDefault = JSON.stringify(stats) === JSON.stringify(defaultStats);

  return (
    <div className='flex flex-col ml-10 mt-[-21px] relative' ref={dropdownRef}>
      <label className='text-maintext text-[10px] flex ml-2'>Stats</label>
      <div
        data-testid="stats-dropdown-button"
        className='bg-searchbox w-[200px] p-2.5 mt-[1px] rounded-md cursor-pointer border'
        onClick={toggleDropdown}
      >
        <div className='flex items-center justify-between'>
          <span className='text-sm'>Stats {!isDefault ? '(Filtered)' : ''}</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      </div>
      {isOpen && (
        <div className="mt-2 bg-white rounded-md shadow-lg border absolute w-72 top-full right-0 p-4 z-10">
          {Object.entries(workingStats).map(([stat, value]) => (
            <div key={stat} className="flex items-center justify-between mb-4">
              <span className="w-24 text-sm">{statLabels[stat as keyof StatsFilter]}</span>
              <div className="flex-1 ml-2">
                <StatsSlider
                  label={stat}
                  value={value}
                  onChange={(newValue: any) => handleStatsChange(stat as keyof StatsFilter, newValue)}
                />
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <button
              onClick={resetStats}
              className="px-4 py-2 bg-white text-gray-800 rounded hover:bg-gray-300 border border-maintext"
            >
              Reset
            </button>
            <button
              onClick={applyStats}
              className={`px-4 py-2 ${
                hasChanges ? 'bg-maintext hover:bg-maintext' : 'bg-gray-300'
              } text-white rounded`}
              disabled={!hasChanges}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsDD;