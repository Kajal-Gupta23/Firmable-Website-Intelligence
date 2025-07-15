import React, { useState } from 'react';
import { Header } from './components/Header';
import { WebsiteAnalyzer } from './components/WebsiteAnalyzer';
import { AnalysisResults } from './components/AnalysisResults';
import { ConversationChat } from './components/ConversationChat';
import { WebsiteAnalysisResponse } from './types/api';

type AppState = 'analyzer' | 'results' | 'conversation';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('analyzer');
  const [analysisResult, setAnalysisResult] = useState<WebsiteAnalysisResponse | null>(null);

  const handleAnalysisComplete = (result: WebsiteAnalysisResponse) => {
    setAnalysisResult(result);
    setCurrentState('results');
  };

  const handleStartConversation = () => {
    setCurrentState('conversation');
  };

  const handleBackToResults = () => {
    setCurrentState('results');
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setCurrentState('analyzer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentState === 'analyzer' && (
          <div className="max-w-2xl mx-auto">
            <WebsiteAnalyzer onAnalysisComplete={handleAnalysisComplete} />
          </div>
        )}

        {currentState === 'results' && analysisResult && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Analysis for {new URL(analysisResult.url).hostname}
              </h1>
              <button
                onClick={handleNewAnalysis}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                New Analysis
              </button>
            </div>
            <AnalysisResults 
              result={analysisResult} 
              onStartConversation={handleStartConversation}
            />
          </div>
        )}

        {currentState === 'conversation' && analysisResult && (
          <div className="max-w-4xl mx-auto">
            <ConversationChat 
              analysisResult={analysisResult}
              onBack={handleBackToResults}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;