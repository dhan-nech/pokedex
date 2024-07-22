// src/components/atoms/stats-slider/index.tsx
import React from 'react';
import { Range, getTrackBackground } from 'react-range';

interface StatsSliderProps {
  label: string;
  value: [number, number];
  // onChange: (newValue: [number, number]) => void;
  onChange: any;
}

const StatsSlider: React.FC<StatsSliderProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex-1">
      <Range
        values={value}
        step={1}
        min={0}
        max={210}
        onChange={onChange} 
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            className="h-3 w-full flex"
            style={{
              ...props.style,
            }}
          >
            <div
              ref={props.ref}
              className="h-1 w-full rounded-lg self-center"
              style={{
                background: getTrackBackground({
                  values: value,
                  colors: ['#ccc', '#548BF4', '#ccc'],
                  min: 0,
                  max: 210,
                }),
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ index, props, isDragged }) => (
          <div
            {...props}
            className={`h-4 w-4 rounded-full bg-mainbg shadow flex justify-center items-center ${
              isDragged ? 'ring-2 ring-red-500' : ''
            }`}
            style={{
              ...props.style,
              boxShadow: '0px 2px 6px #AAA',
            }}
          >
            <div className="h-2 w-2 bg-maintext rounded-full" />
          </div>
        )}
      />
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>{value[0]}</span>
        <span>{value[1]}</span>
      </div>
    </div>
  );
};

export default StatsSlider;