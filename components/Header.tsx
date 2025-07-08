import React from 'react';

const Header = () => {
  return (
    <header className="text-center p-6 bg-white border-b border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800">
        <span className="text-blue-600">A</span>
        <span className="text-red-500">I</span>
        <span className="text-yellow-500">議</span>
        <span className="text-blue-600">事</span>
        <span className="text-green-600">録</span>
        <span className="text-red-500">ジ</span>
        ェネレーター
      </h1>
      <p className="mt-2 text-lg text-gray-600">
        竹谷さん専用の音声ファイルをアップロードして、議事録または議事概要を生成します
      </p>
    </header>
  );
};

export default Header;