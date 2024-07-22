// src\components\atoms\modal-control-buttons\index.tsx
import React, { KeyboardEvent } from 'react';

interface ModalControlsProps {
  id: number;
  name: string;
  onPrevCard: () => void;
  onNextCard: () => void;
}

const ModalControlButtons: React.FC<ModalControlsProps> = ({ id, name, onPrevCard, onNextCard }) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const buttonClass = "text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-maintext rounded p-1";

  return (
    <div className="flex items-center">
      <button
        className={`${buttonClass} mr-2`}
        aria-label={`View previous Pokémon (${id - 1})`}
        onClick={onPrevCard}
        onKeyDown={(e) => handleKeyDown(e, onPrevCard)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className={buttonClass}
        aria-label={`View next Pokémon (${id + 1})`}
        onClick={onNextCard}
        onKeyDown={(e) => handleKeyDown(e, onNextCard)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default ModalControlButtons;