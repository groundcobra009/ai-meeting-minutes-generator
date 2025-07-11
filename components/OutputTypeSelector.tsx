import React from 'react';
import { SUMMARY_TEMPLATES, SummaryTemplate } from '../types/templates';

interface OutputTypeSelectorProps {
  selectedTemplateId: string;
  onChange: (templateId: string) => void;
}

const OutputTypeSelector: React.FC<OutputTypeSelectorProps> = ({ selectedTemplateId, onChange }) => {
  return (
    <div className="w-full max-w-4xl">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">テンプレートを選択してください</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUMMARY_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onChange(template.id)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200 text-left
              hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500
              ${selectedTemplateId === template.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{template.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OutputTypeSelector;