from fastapi import Header, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from config import config


limiter = Limiter(key_func=get_remote_address)

async def verify_token(authorization: str = Header(None)):
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    if token != config.SECRET_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return token