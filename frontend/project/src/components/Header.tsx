import React from 'react';
import { Brain, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Website Analyzer</h1>
              <p className="text-blue-100 text-sm">Extract business insights with AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-blue-100">
            <Globe className="w-4 h-4" />
            <span className="text-sm">Powered by FastAPI & LLMs</span>
          </div>
        </div>
      </div>
    </header>
  );
};