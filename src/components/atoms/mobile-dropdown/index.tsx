// src/components/atoms/mobile-dropdown/index.tsx

import React, { useState } from 'react';

interface MobileDropdownProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

const MobileDropdown: React.FC<MobileDropdownProps> = ({ label, options, selectedOptions, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option: string) => {
    const newSelected = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    onChange(newSelected);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const getDisplayText = () => {
    if (selectedOptions.length === 0) return label;
    if (selectedOptions.length === 1) return selectedOptions[0];
    return `${selectedOptions[0]} + ${selectedOptions.length - 1} More`;
  };

  return (
    <div className="w-full">
      <button
        onClick={toggleDropdown}
        className="w-full text-left bg-white border border-gray-300 rounded-md px-4 py-2 flex justify-between items-center"
      >
        <span>{getDisplayText()}</span>
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map(option => (
            <label key={option} className="flex items-center px-4 py-2 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => toggleOption(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileDropdown;