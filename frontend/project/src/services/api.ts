import { WebsiteAnalysisRequest, WebsiteAnalysisResponse, ConversationalRequest, ConversationalResponse } from '../types/api';

const API_BASE_URL = 'https://website-intelligence.onrender.com'; // FastAPI backend URL
const API_SECRET = 'kj_1234'; // This should be in environment variables

class ApiService {
  private async makeRequest<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_SECRET}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
    

    return response.json();
  }

  async analyzeWebsite(request: WebsiteAnalysisRequest): Promise<WebsiteAnalysisResponse> {
    return this.makeRequest<WebsiteAnalysisResponse>('/analyze-website', request);
  }

  async converse(request: {
    url: string;
    query: string;
    conversation_history?: { user: string; agent: string }[];
  }): Promise<{
    url: string;
    user_query: string;
    agent_response: string;
    context_sources: string[];
  }> {
    return this.makeRequest('/conversations', request);
  }
}

export const apiService = new ApiService();