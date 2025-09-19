
import React, { useState, useCallback } from 'react';
import type { SnippetGroup } from './types';
import { analyzeCode } from './services/geminiService';
import CodeInput from './components/CodeInput';
import SnippetDisplay from './components/SnippetDisplay';
import { LogoIcon } from './components/icons/LogoIcon';
import { GithubIcon } from './components/icons/GithubIcon';

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [snippetGroups, setSnippetGroups] = useState<SnippetGroup[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) {
      setError("Please enter some code to analyze.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSnippetGroups(null);

    try {
      const result = await analyzeCode(code);
      setSnippetGroups(result);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze code. The model may be unable to parse this input or there might be an API issue. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <LogoIcon className="h-8 w-8 text-cyan-400" />
              <h1 className="text-xl font-bold tracking-tight text-gray-100">Code Snippet Extractor</h1>
            </div>
            <a href="https://github.com/google/generative-ai-docs" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <GithubIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="lg:sticky top-24">
            <CodeInput 
              code={code} 
              setCode={setCode} 
              onAnalyze={handleAnalyze} 
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-1">
            <SnippetDisplay 
              groups={snippetGroups} 
              isLoading={isLoading} 
              error={error}
              hasCode={!!code.trim()}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
