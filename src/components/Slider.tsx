import React from 'react';

interface SliderOption {
  value: number;
  label: string;
}

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  options: SliderOption[];
}

export function Slider({ value, onChange, options }: SliderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <input
          type="range"
          min={options[0].value}
          max={options[options.length - 1].value}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[rgb(var(--color-primary))]"
          step={options[0].value}
        />
        <div className="flex justify-between mt-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`text-xs font-medium ${
                value === option.value
                  ? 'text-[rgb(var(--color-primary))]'
                  : 'text-gray-500'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}