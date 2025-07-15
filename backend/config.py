import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = ""
    GEMINI_API_KEY = ""
    RATE_LIMIT = "5/minute"
    CONVERSE_RATE_LIMIT = "10/minute"

config = Config()