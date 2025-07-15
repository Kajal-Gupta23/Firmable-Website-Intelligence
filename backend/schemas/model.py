from pydantic import BaseModel
from typing import List, Optional, Dict


class ContactInfo(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    social_media: Dict[str, Optional[str]] = {}

class CompanyInfo(BaseModel):
    industry: str
    company_size: str
    location: str
    core_products_services: List[str]
    unique_selling_proposition: str
    target_audience: str
    contact_info: ContactInfo

class ExtractedAnswer(BaseModel):
    question: str
    answer: str

class AnalysisInput(BaseModel):
    url: str
    questions: Optional[List[str]] = None

class AnalysisOutput(BaseModel):
    url: str
    analysis_timestamp: str
    company_info: CompanyInfo
    extracted_answers: List[ExtractedAnswer]

class ConversationInput(BaseModel):
    url: str
    query: str
    conversation_history: Optional[List[Dict[str, str]]] = None

class ConversationOutput(BaseModel):
    url: str
    user_query: str
    agent_response: str
    context_sources: List[str]