import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { ConversationEntry, WebsiteAnalysisResponse } from '../types/api';
import { apiService } from '../services/api'; // Adjust the import based on your project structure

interface ConversationChatProps {
  analysisResult: WebsiteAnalysisResponse;
  onBack: () => void;
}

export const ConversationChat: React.FC<ConversationChatProps> = ({ analysisResult, onBack }) => {
  const [messages, setMessages] = useState<ConversationEntry[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuery.trim() || isLoading) return;

    const userQuery = currentQuery.trim();
    setCurrentQuery('');
    setIsLoading(true);

    // Add user message immediately
    const userMessage: ConversationEntry = {
      user_query: userQuery,
      agent_response: '',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]); // Optimistically update the UI

    try {
      const response = await apiService.converse({
        url: analysisResult.url,
        query: userQuery,
        conversation_history: [...messages, userMessage].map(m => ({ user: m.user_query, agent: m.agent_response }))
      });

      const completeMessage: ConversationEntry = {
        user_query: userQuery,
        agent_response: response.agent_response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, completeMessage]);
    } catch (error) {
      const errorMessage: ConversationEntry = {
        user_query: userQuery,
        agent_response: 'Sorry, I encountered an error processing your question. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-xl font-bold text-gray-900">AI Conversation</h2>
          <p className="text-sm text-gray-600">Ask questions about {new URL(analysisResult.url).hostname}</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← Back to Analysis
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Start a conversation by asking questions about the analyzed website!</p>
            <p className="text-sm mt-2">Try asking about pricing, competitors, or business model.</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className="space-y-4">
            {/* User Message */}
            <div className="flex items-start space-x-3 justify-end">
              <div className="bg-blue-600 text-white p-3 rounded-lg max-w-md">
                <p>{message.user_query}</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Agent Response */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg max-w-md">
                <p className="whitespace-pre-wrap">{message.agent_response}</p>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                <span className="text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={currentQuery}
            onChange={(e) => setCurrentQuery(e.target.value)}
            placeholder="Ask a question about the website..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!currentQuery.trim() || isLoading}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};