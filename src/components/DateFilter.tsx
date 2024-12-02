import React from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

interface DateFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
}

export function DateFilter({ startDate, endDate, onChange }: DateFilterProps) {
  const presetRanges = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'All time', days: 0 }
  ];

  const handlePresetClick = (days: number) => {
    if (days === 0) {
      onChange(null, null);
    } else {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - days);
      onChange(start, end);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {presetRanges.map(range => (
          <button
            key={range.days}
            onClick={() => handlePresetClick(range.days)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              range.days === 0 && !startDate && !endDate
                ? 'bg-white dark:bg-gray-700 shadow-sm'
                : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Calendar className="absolute left-3 top-2 w-4 h-4 text-gray-400" />
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={([start, end]) => onChange(start, end)}
          className="pl-9 pr-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
          placeholderText="Custom range"
        />
      </div>
    </div>
  );
}