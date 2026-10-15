from typing import List, Optional
from ninja import Router
from ninja.errors import HttpError
from ninja_jwt.authentication import JWTAuth
import httpx

from services.http_client import NEWS_SERVICE_URL, fetch_service
from schemas.news import NewsResponseSchema, NewsSchemaSubmit

router = Router(tags=["Notícias"])

@router.get("", response=List[NewsResponseSchema], auth=JWTAuth())
async def list_news(request, search: Optional[str] = None):
    params = {"search": search} if search else None
    news_list = await fetch_service(NEWS_SERVICE_URL, params=params) or []

    for news in news_list:
        news["_links"] = {
            "self": f"/api/news/{news.get('id')}",
            "all_news": "/api/news"
        }
    return news_list

@router.get("/{news_id}", response=NewsResponseSchema, auth=JWTAuth())
async def get_news_detail(request, news_id: int):
    news = await fetch_service(f"{NEWS_SERVICE_URL}/{news_id}")
    print(f"{NEWS_SERVICE_URL}/{news_id}",news)
    if not news:
        raise HttpError(404, "Notícia não encontrada.")

    news["_links"] = {
        "self": f"/api/news/{news_id}",
        "all_news": "/api/news"
    }
    return news

@router.post("", response={201: NewsResponseSchema, 200: NewsResponseSchema}, auth=JWTAuth())
async def create_news(request, payload: NewsSchemaSubmit):
    async with httpx.AsyncClient(timeout=5.0, follow_redirects=True) as client:
        try:
            res = await client.post(NEWS_SERVICE_URL, json=payload.dict())
            if res.status_code in [200, 201]:
                data = res.json()
                data["_links"] = {"self": f"/api/news/{data.get('id')}", "all_news": "/api/news"}
                return res.status_code, data
            raise HttpError(res.status_code, res.text)
        except httpx.RequestError:
            raise HttpError(503, "Serviço de Notícias (Spring) indisponível.")

@router.put("/{news_id}", response=NewsResponseSchema, auth=JWTAuth())
async def update_news(request, news_id: int, payload: NewsSchemaSubmit):
    async with httpx.AsyncClient(timeout=5.0, follow_redirects=True) as client:
        try:
            res = await client.put(f"{NEWS_SERVICE_URL}/{news_id}", json=payload.dict())
            if res.status_code == 200:
                data = res.json()
                data["_links"] = {"self": f"/api/news/{data.get('id')}", "all_news": "/api/news"}
                return data
            raise HttpError(res.status_code, res.text)
        except httpx.RequestError:
            raise HttpError(503, "Serviço de Notícias (Spring) indisponível.")

@router.delete("/{news_id}", response={204: None}, auth=JWTAuth())
async def delete_news(request, news_id: int):
    async with httpx.AsyncClient(timeout=5.0, follow_redirects=True) as client:
        try:
            res = await client.delete(f"{NEWS_SERVICE_URL}/{news_id}")
            if res.status_code in [200, 204]:
                return 204, None
            raise HttpError(res.status_code, "Não foi possível excluir a notícia.")
        except httpx.RequestError:
            raise HttpError(503, "Serviço de Notícias (Spring) indisponível.")
