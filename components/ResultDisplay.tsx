
import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface ResultDisplayProps {
  result: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="relative w-full rounded-lg border border-gray-200 bg-white p-6 lg:p-8 shadow-sm">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {copied ? (
          <>
            <CheckIcon className="h-4 w-4 text-green-500" />
            コピー完了
          </>
        ) : (
          <>
            <CopyIcon className="h-4 w-4" />
            コピー
          </>
        )}
      </button>
      <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4">生成結果</h3>
      <div className="prose prose-sm lg:prose-base max-w-none whitespace-pre-wrap text-gray-700 overflow-x-auto">
        {result}
      </div>
    </div>
  );
};

export default ResultDisplay;
