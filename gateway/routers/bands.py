from typing import List, Optional
from ninja import Router
from ninja_jwt.authentication import JWTAuth
from ninja.errors import HttpError
import httpx

from services.http_client import CATALOG_SERVICE_URL, NEWS_SERVICE_URL, fetch_service
from schemas.bands import BandSchemaSubmit, BandSchemaResponse, BandSchema
from schemas.news import NewsSchema

router = Router(tags=["Bandas de Metal"])

@router.get("", response=List[BandSchema], auth=JWTAuth())
async def list(request, search: Optional[str] = None):
    params = {"search": search} if search else None
    bands = await fetch_service(f"{CATALOG_SERVICE_URL}/", params=params) or []

    for band in bands:
        band["_links"] = {
            "self": f"/api/bands/{band['id']}",
            "news": f"/api/news?search={band['name']}"
        }
    return bands

@router.get("/{band_id}", response=BandSchemaResponse, auth=JWTAuth())
async def get_band(request, band_id: int):
    band_data = await fetch_service(f"{CATALOG_SERVICE_URL}/{band_id}/")
    if not band_data:
        return HttpError(404, "Banda não encontrada")

    band_name = band_data.get("name", "")
    news_data = await fetch_service(NEWS_SERVICE_URL, params={"search": band_name}) or []

    return {
        "band": band_data,
        "news": news_data,
        "_links": {
            "self": f"/api/bands/{band_id}",
            "news_search": f"/api/news?search={band_name}",
            "all_bands": "/api/bands"
        }
    }

@router.get("/{band_id}/news", response=List[NewsSchema], auth=JWTAuth())
async def get_band_news(request, band_id: int):
    band_data = await fetch_service(f"{CATALOG_SERVICE_URL}/{band_id}/")
    if not band_data:
        return 404, {"erro": "Banda não encontrada"}

    band_name = band_data.get("name", "")
    news_data = await fetch_service(NEWS_SERVICE_URL, params={"search": band_name}) or []

    for item in news_data:
        item["_links"] = {
            "self": f"/api/news/{item['id']}",
            "band": f"/api/bands/{band_id}"
        }
    return news_data

@router.post("",response={201: BandSchema, 200: BandSchema}, auth=JWTAuth())
async def create(request, payload: BandSchemaSubmit):
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            response = await client.post(f"{CATALOG_SERVICE_URL}/", json=payload.dict())
            if response.status_code in [200, 201]:
                data = response.json()
                data["_links"] = {
                    "self": f"/api/bands/{data.get('id')}",
                    "all_bands": "/api/bands"
                }
                return response.status_code, data
            raise HttpError(response.status_code, response.textj)
        except httpx.RequestError:
            return HttpError(503, "Serviço de Catálogo indisponível no momento.")
