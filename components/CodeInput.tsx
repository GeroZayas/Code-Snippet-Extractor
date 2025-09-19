
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface CodeInputProps {
  code: string;
  setCode: (code: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const CodeInput: React.FC<CodeInputProps> = ({ code, setCode, onAnalyze, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCode(text);
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-200">Your Code</h2>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".js,.ts,.tsx,.jsx,.py,.java,.go,.rs,.html,.css,.json,.md"
          />
          <button
            onClick={handleUploadClick}
            className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-2 px-4 rounded-md transition-colors text-sm inline-flex items-center"
          >
            <UploadIcon className="h-4 w-4 mr-2" />
            Upload File
          </button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        className="flex-grow w-full bg-gray-900/50 p-4 rounded-md text-gray-300 font-mono text-sm border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow resize-none"
        style={{ minHeight: '400px' }}
      />
      <button
        onClick={onAnalyze}
        disabled={isLoading || !code.trim()}
        className="mt-6 w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center shadow-lg"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <SparklesIcon className="h-5 w-5 mr-2" />
            Analyze Code
          </>
        )}
      </button>
    </div>
  );
};

export default CodeInput;
