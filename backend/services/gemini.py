from fastapi import HTTPException
import google.generativeai as genai
from google.generativeai.protos import Schema, Type
from config import config
from typing import Dict,List,Any
import json

genai.configure(api_key=config.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def parse_llm_json(response: str) -> Dict:
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse LLM response")

async def generate_content(
    prompt: str,
    max_tokens: int = 1000,
    temperature: float = 0.2,
    response_mime_type: str | None = None,
    response_schema: Schema | None = None
):
    generation_config = genai.types.GenerationConfig(
        max_output_tokens=max_tokens,
        temperature=temperature,
    )
    if response_mime_type:
        generation_config.response_mime_type = response_mime_type
    if response_schema:
        generation_config.response_schema = response_schema
    
    response = model.generate_content(
        prompt,
        generation_config=generation_config
    )
    return response.text

async def chat_completion(
    messages: List[Dict[str, str]],
    max_tokens: int = 500,
    temperature: float = 0.5,
    response_mime_type: str | None = None,
    response_schema: Schema | None = None
):

    history = []
    for msg in messages[:-1]:
        if msg['role'] == 'system':
            history.append({'role': 'user', 'parts': [msg['content']]})
            history.append({'role': 'model', 'parts': ["Understood."]})
        elif msg['role'] == 'user':
            history.append({'role': 'user', 'parts': [msg['content']]})
        elif msg['role'] == 'assistant':
            history.append({'role': 'model', 'parts': [msg['content']]})
    
    chat = model.start_chat(history=history)
    generation_config = genai.types.GenerationConfig(
        max_output_tokens=max_tokens,
        temperature=temperature,
    )
    if response_mime_type:
        generation_config.response_mime_type = response_mime_type
    if response_schema:
        generation_config.response_schema = response_schema
    response = chat.send_message(
        messages[-1]['content'],
        generation_config=generation_config
    )
    return response.text