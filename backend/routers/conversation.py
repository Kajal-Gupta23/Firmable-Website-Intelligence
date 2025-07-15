from services.history import get_analysis_history,store_analysis_questions
from schemas.model import ConversationInput, ConversationOutput
from services.gemini import chat_completion, parse_llm_json
from fastapi import APIRouter, Depends, Request
from dependencies import limiter, verify_token
from google.generativeai.protos import Schema, Type
from services.scraper import scrape_homepage
from typing import List, Dict
from config import config

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

conversation_schema = Schema(
    type=Type.OBJECT,
    properties={
        'agent_response': Schema(type=Type.STRING),
        'context_sources': Schema(
            type=Type.ARRAY,
            items=Schema(type=Type.STRING)
        )
    },
    required=['agent_response', 'context_sources']
)

def build_conversation_messages(content: str, query: str, history: List[Dict[str, str]] | None, url: str) -> List[Dict[str, str]]:
    system_content = (
        "You are an AI agent that answers questions about a website's business insights based on its content. "
        "Be concise, accurate, and helpful. Provide context_sources as a list of relevant excerpts or paragraphs "
        "from the website content that directly support your answer."
    )
    system_content += f"\n\nWebsite content for context: {content[:8000]}"
    
    messages = [{"role": "system", "content": system_content}]
    
    # Add stored analysis history from /analyze-website
    analysis_history = get_analysis_history(url)
    if analysis_history:
        for turn in analysis_history:
            messages.append({"role": "user", "content": turn.get("user", "")})
            messages.append({"role": "assistant", "content": turn.get("agent", "")})
    
    # Add user-provided conversation history
    if history:
        for turn in history:
            messages.append({"role": "user", "content": turn.get("user", "")})
            messages.append({"role": "assistant", "content": turn.get("agent", "")})
    
    messages.append({"role": "user", "content": query})
    # logger.info(f"Built messages: {messages}")
    return messages

@router.post("/conversations", response_model=ConversationOutput)
@limiter.limit(config.CONVERSE_RATE_LIMIT)
async def converse_website(request: Request, input: ConversationInput, token: str = Depends(verify_token)):
    content = await scrape_homepage(input.url)
    
    messages = build_conversation_messages(content, input.query, input.conversation_history, input.url)
    
    response_text = await chat_completion(
        messages,
        max_tokens=500,
        temperature=0.5,
        response_mime_type="application/json",
        response_schema=conversation_schema
    )
    response_data = parse_llm_json(response_text)
    if response_data:
        history_entries = [{"user": input.query, "agent": response_data['agent_response']}]
        store_analysis_questions(input.url, history_entries)

    return ConversationOutput(
        url=input.url,
        user_query=input.query,
        agent_response=response_data['agent_response'],
        context_sources=response_data['context_sources']
    )