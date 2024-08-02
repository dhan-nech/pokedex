// src/components/atoms/mobile-dropdown/index.tsx

import React from 'react';

interface MobileDropdownProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

const MobileDropdown: React.FC<MobileDropdownProps> = ({ 
  label, 
  options, 
  selectedOptions, 
  onChange, 
  isOpen, 
  onToggle,
  children 
}) => {
  const toggleOption = (option: string) => {
    const newSelected = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    onChange(newSelected);
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) return label;
    if (selectedOptions.length === 1) return selectedOptions[0];
    return `${selectedOptions[0]} + ${selectedOptions.length - 1} More`;
  };

  return (
    <div className="w-full">
      <button
        onClick={onToggle}
        className="w-full text-left bg-white border border-gray-300 rounded-md px-4 py-2 flex justify-between items-center"
        aria-expanded={isOpen}
        aria-controls={`${label.toLowerCase()}-options`}
      >
        <span>{getDisplayText()}</span>
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div 
          id={`${label.toLowerCase()}-options`}
          className="mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg"
        >
          {children ? (
            <div className="p-4">
              {children}
            </div>
          ) : (
            options.map(option => (
              <label key={option} className="flex items-center px-4 py-2 hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => toggleOption(option)}
                  className="mr-2"
                />
                {option}
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MobileDropdown;