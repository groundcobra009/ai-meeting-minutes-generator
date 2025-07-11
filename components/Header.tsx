import React from 'react';

const Header = () => {
  return (
    <header className="w-full p-6 lg:p-8 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
        <span className="text-blue-600">A</span>
        <span className="text-red-500">I</span>
        <span className="text-yellow-500">議</span>
        <span className="text-blue-600">事</span>
        <span className="text-green-600">録</span>
        <span className="text-red-500">ジ</span>
        ェネレーター
        </h1>
        <p className="mt-2 text-base lg:text-lg text-gray-600">
          音声ファイルをアップロードして、議事録または議事概要を生成します
        </p>
      </div>
    </header>
  );
};

export default Header;