import React, { useState } from 'react';
import { Search, Plus, X, Loader2, AlertCircle } from 'lucide-react';
import { WebsiteAnalysisRequest, WebsiteAnalysisResponse } from '../types/api';

interface WebsiteAnalyzerProps {
  onAnalysisComplete: (result: WebsiteAnalysisResponse) => void;
}

export const WebsiteAnalyzer: React.FC<WebsiteAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [url, setUrl] = useState('');
  const [questions, setQuestions] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addQuestion = () => {
    setQuestions([...questions, '']);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, value: string) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Mock response for demo purposes
      // In real implementation, use: await apiService.analyzeWebsite(request);
      const mockResponse: WebsiteAnalysisResponse = {
        url: url,
        analysis_timestamp: new Date().toISOString(),
        company_info: {
          industry: "Software Development",
          company_size: "Medium (50-200 employees)",
          location: "San Francisco, CA, USA",
          core_products_services: ["Cloud CRM", "Customer Support Software"],
          unique_selling_proposition: "AI-powered CRM that predicts customer churn with 95% accuracy",
          target_audience: "Small to Medium Businesses (SMBs)",
          contact_info: {
            email: "info@example.com",
            phone: "+1-555-123-4567",
            social_media: {
              linkedin: "https://linkedin.com/company/example",
              twitter: "https://twitter.com/example"
            }
          }
        },
        extracted_answers: questions.filter(q => q.trim()).map(question => ({
          question,
          answer: `AI-generated answer for: ${question}`
        }))
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onAnalysisComplete(mockResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Search className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Website Analysis</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Custom Questions (Optional)
            </label>
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((question, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  placeholder="e.g., What is their pricing model?"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Website...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Analyze Website</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};