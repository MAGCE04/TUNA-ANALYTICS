import React from 'react';

type TimeRange = '7d' | '30d' | '90d' | 'all';

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onChange: (range: TimeRange) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onChange
}) => {
  const ranges: TimeRange[] = ['7d', '30d', '90d', 'all'];
  
  return (
    <div className="flex space-x-2 mb-4">
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            selectedRange === range
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {range === 'all' ? 'All Time' : range}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;