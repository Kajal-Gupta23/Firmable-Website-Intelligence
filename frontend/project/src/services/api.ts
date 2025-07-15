import { WebsiteAnalysisRequest, WebsiteAnalysisResponse, ConversationalRequest, ConversationalResponse } from '../types/api';

const API_BASE_URL = 'http://localhost:8000'; // FastAPI backend URL
const API_SECRET = 'your-secret-key-here'; // This should be in environment variables

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

  async askQuestion(request: ConversationalRequest): Promise<ConversationalResponse> {
    return this.makeRequest<ConversationalResponse>('/ask-question', request);
  }
}

export const apiService = new ApiService();