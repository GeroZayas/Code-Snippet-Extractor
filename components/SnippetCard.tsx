
import React, { useState } from 'react';
import type { Snippet } from '../types';
// Note: In a real project, you would install these packages.
// For this environment, we rely on them being available.
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface SnippetCardProps {
  snippet: Snippet;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  // Normalize language for syntax highlighter
  const language = snippet.language.toLowerCase().replace(/typescript/,'ts').replace(/javascript/,'js');

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-md">
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-bold text-gray-100">{snippet.title}</h3>
        <p className="text-sm text-gray-400 mt-1">{snippet.description}</p>
      </div>
      <div className="relative group">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{ margin: 0, borderRadius: '0 0 0.5rem 0.5rem', background: '#1F2937' }}
          codeTagProps={{ className: 'font-mono' }}
        >
          {snippet.code}
        </SyntaxHighlighter>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 bg-gray-700 rounded-md text-gray-300 hover:bg-gray-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Copy code"
        >
          {isCopied ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

export default SnippetCard;
