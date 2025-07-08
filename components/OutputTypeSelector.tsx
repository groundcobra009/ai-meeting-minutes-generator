
import React from 'react';
import { OutputType } from '../types';

interface OutputTypeSelectorProps {
  selectedType: OutputType;
  onChange: (type: OutputType) => void;
}

const OutputTypeSelector: React.FC<OutputTypeSelectorProps> = ({ selectedType, onChange }) => {
  return (
    <div className="flex w-full max-w-lg rounded-lg bg-gray-200 p-1">
      <button
        onClick={() => onChange(OutputType.MINUTES)}
        className={`w-1/2 rounded-md py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
          selectedType === OutputType.MINUTES
            ? 'bg-white text-gray-900 shadow'
            : 'bg-transparent text-gray-600 hover:bg-gray-100'
        }`}
      >
        議事録 (詳細)
      </button>
      <button
        onClick={() => onChange(OutputType.SUMMARY)}
        className={`w-1/2 rounded-md py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
          selectedType === OutputType.SUMMARY
            ? 'bg-white text-gray-900 shadow'
            : 'bg-transparent text-gray-600 hover:bg-gray-100'
        }`}
      >
        議事概要 (要約)
      </button>
    </div>
  );
};

export default OutputTypeSelector;
