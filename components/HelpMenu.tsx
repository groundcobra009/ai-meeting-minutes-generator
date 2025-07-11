import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

const HelpMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors z-40"
        aria-label="ヘルプメニューを開く"
      >
        <HelpCircle size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">ヘルプ</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="閉じる"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">AI Studio APIキーの取得方法</h3>
                <ol className="space-y-4 text-gray-700">
                  <li className="flex">
                    <span className="font-bold mr-2">1.</span>
                    <div>
                      <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Google AI Studio
                      </a>
                      にアクセスします。
                    </div>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">2.</span>
                    <div>Googleアカウントでログインします。</div>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">3.</span>
                    <div>「Get API key」ボタンをクリックします。</div>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">4.</span>
                    <div>「Create API key」をクリックして新しいAPIキーを生成します。</div>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">5.</span>
                    <div>生成されたAPIキーをコピーして、このアプリケーションのAPIキー入力欄に貼り付けます。</div>
                  </li>
                </ol>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>注意:</strong> APIキーは第三者と共有しないでください。安全に保管してください。
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">使い方</h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex">
                    <span className="font-bold mr-2">1.</span>
                    <div>APIキーを設定します。</div>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">2.</span>
                    <div>音声ファイル（MP3、WAV、M4A、OGG、WEBM形式）をアップロードします。</div>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">3.</span>
                    <div>出力タイプ（議事録、要約、ToDoリスト）を選択します。</div>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-2">4.</span>
                    <div>「議事録を生成する」ボタンをクリックします。</div>
                  </li>
                </ol>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">対応ファイル形式</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>MP3</li>
                  <li>WAV</li>
                  <li>M4A</li>
                  <li>OGG</li>
                  <li>WEBM</li>
                </ul>
                <p className="mt-3 text-sm text-gray-600">
                  最大ファイルサイズ: 20MB
                </p>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpMenu;