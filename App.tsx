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
    
    // Validate file type
    const supportedTypes = ['.mp3', '.mp4', '.wav', '.m4a'];
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    
    if (!supportedTypes.includes(fileExtension)) {
      setError(`サポートされていないファイル形式です。対応形式: ${supportedTypes.join(', ')}`);
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
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Initial layout with steps 1-2 on left, step 3 on right */}
        {!result && !isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side: Steps 1 & 2 */}
            <div className="space-y-6">
              <div className="rounded-xl bg-white p-6 lg:p-8 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-center text-gray-700 mb-4">1. APIキーを設定</h2>
                <ApiKeyInput apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
              </div>
              
              <div className="rounded-xl bg-white p-6 lg:p-8 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-center text-gray-700 mb-4">2. 音声ファイルをアップロード</h2>
                <FileUpload file={file} onFileChange={setFile} />
              </div>
            </div>
            
            {/* Right side: Step 3 */}
            <div className="space-y-6">
              <div className="rounded-xl bg-white p-6 lg:p-8 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-center text-gray-700 mb-4">3. 出力形式を選択</h2>
                <OutputTypeSelector selectedTemplateId={selectedTemplateId} onChange={setSelectedTemplateId} />
                
                <button
                    onClick={handleGenerate}
                    disabled={!file || isLoading || !apiKey}
                    className="w-full mt-6 rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                    {isLoading ? '生成中...' : '議事録を生成する'}
                </button>
              </div>
              
              {error && (
                <div className="w-full rounded-md bg-red-100 p-4 text-center text-red-700">
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
            </div>
          </div>
        ) : (
          /* When result exists, use compact layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Compact Input Section */}
            <div className="lg:col-span-4">
              <div className="sticky top-8 space-y-4 rounded-xl bg-white p-4 lg:p-6 shadow-sm border border-gray-200">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700">1. APIキー</h3>
                  <ApiKeyInput apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700">2. 音声ファイル</h3>
                  <FileUpload file={file} onFileChange={setFile} />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700">3. 出力形式</h3>
                  <OutputTypeSelector selectedTemplateId={selectedTemplateId} onChange={setSelectedTemplateId} />
                </div>
                
                <button
                    onClick={handleGenerate}
                    disabled={!file || isLoading || !apiKey}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                    {isLoading ? '生成中...' : '再生成'}
                </button>
              </div>
            </div>
            
            {/* Results Section */}
            <div className="lg:col-span-8">
              {error && (
                <div className="w-full rounded-md bg-red-100 p-4 text-center text-red-700 mb-4">
                  {error}
                </div>
              )}

              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
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
            </div>
          </div>
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