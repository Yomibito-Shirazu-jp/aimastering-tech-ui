import React from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  unit?: string;
}

export const SliderControl: React.FC<SliderControlProps> = ({ label, value, min, max, step, onChange, unit = '' }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val)) return;
    // Clamp value
    val = Math.max(min, Math.min(max, val));
    onChange(val);
  };

  return (
    <div className="flex flex-col space-y-1 mb-4">
      <div className="flex justify-between items-center text-xs text-gray-400">
        <label className="font-medium">{label}</label>
        <div className="flex items-center space-x-1">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={handleInputChange}
            className="w-16 bg-zinc-900 border border-zinc-700 rounded px-1 py-0.5 text-right text-white focus:outline-none focus:border-primary"
          />
          {unit && <span>{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
};
