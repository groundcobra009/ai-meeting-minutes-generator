import React, { useState, useCallback } from 'react';
import { generateContent, initializeGeminiAI } from './services/geminiService';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import OutputTypeSelector from './components/OutputTypeSelector';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ApiKeyInput from './components/ApiKeyInput';
import HelpMenu from './components/HelpMenu';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('detailed_minutes');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [progress, setProgress] = useState<string>('');

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
    if (newApiKey) {
      initializeGeminiAI(newApiKey);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!file) {
      setError('音声ファイルを指定してください。');
      return;
    }
    if (!apiKey) {
      setError('APIキーを設定してください。');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult('');
    setProgress('音声ファイルを処理中...');

    try {
      // Show progress updates
      setTimeout(() => {
        if (isLoading) {
          setProgress('AIが内容を分析中... (これには数分かかる場合があります)');
        }
      }, 5000);

      setTimeout(() => {
        if (isLoading) {
          setProgress('議事録を生成中... もうしばらくお待ちください...');
        }
      }, 20000);

      const generatedText = await generateContent(file, selectedTemplateId, apiKey);
      setResult(generatedText);
      setProgress('');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '不明なエラーが発生しました。';
      setError(`生成に失敗しました: ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
      setProgress('');
    }
  }, [file, selectedTemplateId, apiKey]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="container mx-auto flex flex-col items-center gap-8 p-4 sm:p-8">
        <div className="w-full max-w-lg space-y-6 rounded-xl bg-white p-8 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-center text-gray-700">1. APIキーを設定</h2>
            <ApiKeyInput apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
            <h2 className="text-xl font-bold text-center text-gray-700 pt-4">2. 音声ファイルをアップロード</h2>
            <FileUpload file={file} onFileChange={setFile} />
            <h2 className="text-xl font-bold text-center text-gray-700 pt-4">3. テンプレートを選択</h2>
            <OutputTypeSelector selectedTemplateId={selectedTemplateId} onChange={setSelectedTemplateId} />
            <button
                onClick={handleGenerate}
                disabled={!file || isLoading || !apiKey}
                className="w-full rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
                {isLoading ? '生成中...' : '議事録を生成する'}
            </button>
        </div>

        {error && (
          <div className="w-full max-w-4xl rounded-md bg-red-100 p-4 text-center text-red-700">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner />
            {progress && (
              <p className="text-center text-gray-600 animate-pulse">
                {progress}
              </p>
            )}
          </div>
        )}
        
        {result && !isLoading && (
            <ResultDisplay result={result} />
        )}
      </main>
      <footer className="text-center p-4 text-sm text-gray-500">
        © 2025 keitaro. All Rights Reserved.
      </footer>
      <HelpMenu />
    </div>
  );
};

export default App;