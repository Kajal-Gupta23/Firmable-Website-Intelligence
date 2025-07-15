export interface WebsiteAnalysisRequest {
  url: string;
  questions?: string[];
}

export interface ConversationalRequest {
  url: string;
  query: string;
  conversation_history?: ConversationEntry[];
}

export interface ConversationEntry {
  user_query: string;
  agent_response: string;
  timestamp: string;
}

export interface CompanyInfo {
  industry: string;
  company_size: string;
  location: string;
  core_products_services: string[];
  unique_selling_proposition: string;
  target_audience: string;
  contact_info: {
    email?: string;
    phone?: string;
    social_media?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
    };
  };
}

export interface ExtractedAnswer {
  question: string;
  answer: string;
}

export interface WebsiteAnalysisResponse {
  url: string;
  analysis_timestamp: string;
  company_info: CompanyInfo;
  extracted_answers: ExtractedAnswer[];
}

export interface ConversationalResponse {
  url: string;
  query: string;
  response: string;
  timestamp: string;
  conversation_id: string;
}

export interface ApiError {
  detail: string;
  status_code: number;
}