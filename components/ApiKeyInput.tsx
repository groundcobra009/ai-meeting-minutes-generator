import React, { useState, useEffect } from 'react';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, onApiKeyChange }) => {
  const [showKey, setShowKey] = useState(false);
  const [localApiKey, setLocalApiKey] = useState(apiKey);

  useEffect(() => {
    // Load API key from localStorage on mount
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setLocalApiKey(savedApiKey);
      onApiKeyChange(savedApiKey);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setLocalApiKey(newApiKey);
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('gemini_api_key', localApiKey);
    onApiKeyChange(localApiKey);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setLocalApiKey('');
    onApiKeyChange('');
  };

  return (
    <div className="w-full max-w-lg">
      <div className="mb-2">
        <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
          Gemini API キー
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Google AI Studio から取得したAPIキーを入力してください
        </p>
      </div>
      <div className="relative">
        <input
          id="api-key"
          type={showKey ? 'text' : 'password'}
          value={localApiKey}
          onChange={handleApiKeyChange}
          placeholder="AIzaSy..."
          className="w-full px-4 py-2 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          {showKey ? '隠す' : '表示'}
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleSaveApiKey}
          disabled={!localApiKey}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          保存
        </button>
        <button
          onClick={handleClearApiKey}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          クリア
        </button>
      </div>
      {apiKey && (
        <p className="text-xs text-green-600 mt-2">
          ✓ APIキーが設定されています
        </p>
      )}
    </div>
  );
};

export default ApiKeyInput;