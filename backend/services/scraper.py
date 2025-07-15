import httpx
from bs4 import BeautifulSoup
from fastapi import HTTPException
from typing import Dict

cache: Dict[str, str] = {}

async def scrape_homepage(url: str) -> str:
    if url in cache:
        return cache[url]
    async with httpx.AsyncClient() as client:
        try:
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/114.0.0.0"}
            resp = await client.get(url,headers=headers, timeout=10.0, follow_redirects=True)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, 'html.parser')
            text_elements = soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'li', 'div'])
            content = ' '.join([elem.get_text(strip=True) for elem in text_elements if elem.get_text(strip=True)])
            cache[url] = content
            return content
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to scrape URL: {str(e)}")