
import React, { useRef } from 'react';
import { UploadIcon, FileIcon } from './icons';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ file, onFileChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileChange(event.target.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div
      onClick={handleClick}
      className="w-full max-w-lg cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-white p-8 text-center transition-colors hover:border-blue-500 hover:bg-blue-50"
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".mp3,.mp4,.wav,.m4a,audio/*,video/mp4"
      />
      {file ? (
        <div className="flex flex-col items-center justify-center text-gray-700">
          <FileIcon className="w-12 h-12 text-green-500" />
          <p className="mt-4 text-lg font-medium">{file.name}</p>
          <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
           <button 
                onClick={handleClear} 
                className="mt-4 text-sm text-red-500 hover:text-red-700 font-semibold"
            >
                ファイルを削除
            </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <UploadIcon className="w-12 h-12 text-gray-400" />
          <p className="mt-4 text-lg font-semibold text-gray-700">
            音声ファイルをここにドラッグ＆ドロップ
          </p>
          <p className="mt-1 text-sm">またはクリックしてファイルを選択</p>
          <p className="mt-4 text-xs text-gray-400">対応形式: MP3, MP4, WAV, M4Aなど</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
