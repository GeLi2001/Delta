import React from "react";

interface Props {
  temperature: number;
  setTemperature: (temp: number) => void;
}

export function TemperatureControl({ temperature, setTemperature }: Props) {
  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="temperature"
        className="text-sm font-medium text-gray-300"
      >
        Temperature:
      </label>
      <input
        type="number"
        id="temperature"
        className="w-20 p-1 border border-gray-600 rounded-md bg-[#1e1e1e] text-gray-200"
        min={0}
        max={1}
        step={0.1}
        value={temperature}
        onChange={(e) => setTemperature(parseFloat(e.target.value))}
      />
    </div>
  );
}
