// src\components\atoms\input-box\index.tsx
import React from 'react';

interface GeneralInputBoxProps {
  label?: string;
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GeneralInputBox: React.FC<GeneralInputBoxProps> = ({ 
  label = 'Label', 
  placeholder = 'Enter text', 
  className = '',
  value,
  onChange
}) => {
  return (
    <div className={`flex flex-col ml-[28px] mt-[-20px] h-full md:ml-10 w-full ${className}`}>
      <label className=''>
        <span className='text-maintext text-[10px] flex ml-2'>
          {label}
        </span>
      <input
        type="text"
        placeholder={placeholder}
        className='bg-searchbox w-full p-2 ml-[10px] rounded-md md:ml-[0px]'
        value={value}
        onChange={onChange}
      />
      </label>
    </div>
  );
};

export default GeneralInputBox;