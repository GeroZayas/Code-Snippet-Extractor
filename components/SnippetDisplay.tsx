import React from 'react';
import type { SnippetGroup } from '../types';
import SnippetCard from './SnippetCard';
import { CodeBracketIcon } from './icons/CodeBracketIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface SnippetDisplayProps {
  groups: SnippetGroup[] | null;
  isLoading: boolean;
  error: string | null;
  hasCode: boolean;
}

const SnippetDisplay: React.FC<SnippetDisplayProps> = ({ groups, isLoading, error, hasCode }) => {
  const handleSaveAsMarkdown = () => {
    if (!groups || groups.length === 0) return;

    let markdownContent = "# Extracted Code Snippets\n\n";

    groups.forEach(group => {
      markdownContent += `## ${group.groupTitle}\n\n`;
      markdownContent += `${group.groupDescription}\n\n`;

      group.snippets.forEach(snippet => {
        markdownContent += `### ${snippet.title}\n\n`;
        markdownContent += `*${snippet.description}*\n\n`;
        markdownContent += `\`\`\`${snippet.language.toLowerCase()}\n`;
        markdownContent += `${snippet.code}\n`;
        markdownContent += `\`\`\`\n\n`;
      });
      markdownContent += "---\n\n";
    });

    const blob = new Blob([markdownContent.trim()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code-snippets.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
        <div className="w-full flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg">
             <div className="animate-pulse flex flex-col items-center space-y-4 w-full">
                <div className="h-6 bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                <div className="w-full mt-6 space-y-6">
                    <div className="h-40 bg-gray-700 rounded-lg w-full"></div>
                    <div className="h-40 bg-gray-700 rounded-lg w-full"></div>
                    <div className="h-40 bg-gray-700 rounded-lg w-full"></div>
                </div>
            </div>
        </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-red-900/20 border border-red-500/50 rounded-lg">
        <h3 className="text-lg font-semibold text-red-400">Analysis Failed</h3>
        <p className="mt-2 text-red-300">{error}</p>
      </div>
    );
  }

  if (!groups) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-lg">
        <CodeBracketIcon className="h-12 w-12 text-gray-600" />
        <h3 className="mt-4 text-lg font-semibold text-gray-400">
          {hasCode ? "Ready to Analyze" : "Code Snippets Appear Here"}
        </h3>
        <p className="mt-1 text-gray-500">
          {hasCode ? "Click 'Analyze Code' to extract snippets." : "Paste or upload your code to get started."}
        </p>
      </div>
    );
  }
  
  if (groups.length === 0) {
     return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-lg">
            <h3 className="mt-4 text-lg font-semibold text-gray-400">No Snippets Found</h3>
            <p className="mt-1 text-gray-500">The model could not extract any distinct snippets from the provided code.</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-gray-200">Analysis Results</h2>
        <button
          onClick={handleSaveAsMarkdown}
          className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-2 px-4 rounded-md transition-colors text-sm inline-flex items-center"
          aria-label="Save all snippets as a Markdown file"
        >
          <DownloadIcon className="h-4 w-4 mr-2" />
          Save as Markdown
        </button>
      </div>

      <div className="space-y-10">
        {groups.map((group, index) => (
          <div key={index}>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-cyan-400">{group.groupTitle}</h2>
              <p className="text-gray-400 mt-1">{group.groupDescription}</p>
            </div>
            <div className="space-y-6">
              {group.snippets.map((snippet, sIndex) => (
                <SnippetCard key={sIndex} snippet={snippet} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SnippetDisplay;