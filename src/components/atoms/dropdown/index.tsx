// src\components\atoms\dropdown\index.tsx
'use client'
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface DropdownProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label = 'Select', options = [], selectedOptions = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionChange = (option: string) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    onChange(newSelectedOptions);
  };

  const toggleDropdown = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return label;
    } else if (selectedOptions.length === 1) {
      return selectedOptions[0];
    } else {
      return `${selectedOptions[0]} + ${selectedOptions.length - 1} more`;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleDropdown();
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLDivElement>, option: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleOptionChange(option);
    }
  };

  return (
    <div className='flex flex-col ml-10 mt-[-21px]' ref={dropdownRef}>
      <label className='text-maintext text-[10px] flex ml-2'>{label}</label>
      <div
        className='bg-searchbox lg:w-[200px] md:w-[120px] p-2.5 mt-[1px] rounded-md cursor-pointer border'
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className='flex items-center justify-between'>
          <span className='text-sm'>{getDisplayText()}</span>
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
        {isOpen && (
          <div className='mt-2 bg-white rounded-md shadow-lg border absolute w-[200px] ml-[-10px]' role="listbox">
            {options.map((option, index) => (
              <div
                key={option}
                className={`flex items-center ${index !== options.length - 1 ? 'border-b' : ''} p-2`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionChange(option);
                }}
                onKeyDown={(e) => handleOptionKeyDown(e, option)}
                tabIndex={0}
                role="option"
                aria-selected={selectedOptions.includes(option)}
              >
                <input
                  type='checkbox'
                  id={option.toLowerCase()}
                  checked={selectedOptions.includes(option)}
                  onChange={() => {}}
                  className='mr-2'
                />
                <label htmlFor={option.toLowerCase()} className='ml-2 cursor-pointer'>
                  {option}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;