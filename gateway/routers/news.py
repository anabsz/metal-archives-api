from typing import List, Optional
from ninja import Router
from ninja_jwt.authentication import JWTAuth
import httpx

from services.http_client import NEWS_SERVICE_URL, fetch_service
from schemas.news import NewsSchema

router = Router(tags=["Notícias"])

@router.get("", response=List[NewsSchema], auth=JWTAuth())
async def list_news(request, search: Optional[str] = None):
    params = {"search": search} if search else {}
    response = await fetch_service(NEWS_SERVICE_URL, params=params)
    return response
