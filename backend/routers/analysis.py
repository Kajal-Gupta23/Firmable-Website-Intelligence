from fastapi import APIRouter, Depends, Request
from datetime import datetime
from typing import List
from dependencies import limiter, verify_token
from schemas.model import AnalysisInput, AnalysisOutput, CompanyInfo, ExtractedAnswer
from services.scraper import scrape_homepage
from services.gemini import generate_content, parse_llm_json
from services.history import store_analysis_questions
from config import config
from google.generativeai.protos import Schema, Type

router = APIRouter()

company_schema = Schema(
    type=Type.OBJECT,
    properties={
        'industry': Schema(type=Type.STRING),
        'company_size': Schema(type=Type.STRING),
        'location': Schema(type=Type.STRING),
        'core_products_services': Schema(
            type=Type.ARRAY,
            items=Schema(type=Type.STRING)
        ),
        'unique_selling_proposition': Schema(type=Type.STRING),
        'target_audience': Schema(type=Type.STRING),
        'contact_info': Schema(
            type=Type.OBJECT,
            properties={
                'email': Schema(type=Type.STRING, nullable=True),
                'phone': Schema(type=Type.STRING, nullable=True),
                'social_media': Schema(
                    type=Type.OBJECT,
                    properties={
                        'linkedin': Schema(type=Type.STRING, nullable=True),
                        'twitter': Schema(type=Type.STRING, nullable=True)
                    }
                )
            }
        )
    },
    required=['industry', 'company_size', 'location', 'core_products_services', 'unique_selling_proposition', 'target_audience', 'contact_info']
)

def get_core_extraction_prompt(content: str) -> str:
    return f"""
Analyze the following website content and extract the key business insights.
Use "Not specified" for strings if information is not found or inferable.
Use [] for empty lists.
Use null for optional fields like email, phone, social media links if not present.
Only include the specified fields.

Content: {content[:8000]}
"""

@router.post("/analyze-website", response_model=AnalysisOutput)
@limiter.limit(config.RATE_LIMIT)
async def analyze_website(request: Request, input: AnalysisInput, token: str = Depends(verify_token)):
    content = await scrape_homepage(input.url)
    
    core_prompt = get_core_extraction_prompt(content)
    core_response = await generate_content(
        core_prompt,
        max_tokens=1000,
        temperature=0.2,
        response_mime_type="application/json",
        response_schema=company_schema
    )
    core_json = parse_llm_json(core_response)
    company_info = CompanyInfo(**core_json)
    
    extracted_answers = []
    if input.questions:
        for question in input.questions:
            qa_prompt = f"Based on the website content, answer the question concisely.\nQuestion: {question}\nContent: {content[:4000]}"
            qa_response = await generate_content(qa_prompt, max_tokens=300, temperature=0.3)
            answer = qa_response.strip()
            extracted_answers.append(ExtractedAnswer(question=question, answer=answer))
    
    # Store questions and answers in history
    if extracted_answers:
        history_entries = [{"user": answer.question, "agent": answer.answer} for answer in extracted_answers]
        store_analysis_questions(input.url, history_entries)
    
    return AnalysisOutput(
        url=input.url,
        analysis_timestamp=datetime.utcnow().isoformat() + "Z",
        company_info=company_info,
        extracted_answers=extracted_answers
    )