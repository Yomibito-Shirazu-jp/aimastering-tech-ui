import React, { useCallback, useState } from 'react';
import { UploadCloud, FileAudio, X } from 'lucide-react';

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndSelect = (file: File) => {
    setError(null);
    const validTypes = ['audio/wav', 'audio/mpeg', 'audio/aiff', 'audio/flac', 'audio/x-m4a', 'audio/mp4'];
    const maxSize = 200 * 1024 * 1024; // 200MB

    if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|mp3|aiff|flac|m4a)$/i)) {
      setError('無効なファイル形式です。WAV, MP3, AIFF, FLAC, M4Aのいずれかをアップロードしてください。');
      return;
    }
    if (file.size > maxSize) {
      setError('ファイルサイズが大きすぎます。最大200MBまで対応しています。');
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSelect(files[0]);
    }
  }, [disabled, onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSelect(files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
          ${isDragging ? 'border-primary bg-primary/10' : 'border-zinc-700 bg-card hover:border-zinc-500 hover:bg-zinc-900/50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          accept=".wav,.mp3,.aiff,.flac,.m4a,audio/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-400'}`}>
            <UploadCloud size={40} />
          </div>
          <div>
            <p className="text-lg font-medium text-zinc-200">
              ここに音声ファイルをドラッグ＆ドロップ
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              対応フォーマット: WAV, MP3, AIFF, FLAC, M4A (最大 200MB)
            </p>
          </div>
          <button 
            className="mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-sm font-medium transition-colors pointer-events-auto"
            disabled={disabled}
            onClick={() => document.querySelector('input[type="file"]')?.dispatchEvent(new MouseEvent('click'))}
          >
            ファイルを選択
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center text-red-400 text-sm">
          <X size={16} className="mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};
