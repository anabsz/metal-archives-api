import asyncio
import os

import httpx
from ninja import NinjaAPI
from ninja_jwt.authentication import JWTAuth
from ninja_jwt.routers.obtain import obtain_pair_router

from typing import List, Optional
from .schemas import BandInputSchema, BandResponseSchema, NewsResponseSchema, BandItemSchema

api = NinjaAPI(title="Metal Archives API Gateway", description="Gateway com HATEOAS")

api.add_router("/auth", obtain_pair_router)

API_BANDS = os.getenv("CATALOG_SERVICE_URL", "http://localhost:8040/api/bands/")
API_NEWS = os.getenv("NEWS_SERVICE_URL", "http://localhost:8080/api/news")

@api.get("/bands", response=List[BandItemSchema], auth=JWTAuth(), tags=["Catálogo de Bandas"])
async def list_bands(request, search: Optional[str]= None):
    """
    Lista todas as bandas registradas no Catálogo.
    Suporta busca por nome via parâmetro ?search=
    Enriquece cada registro com links HATEOAS.
    """
    print(search)
    params = {"search": search} if search else {}
    print(params)

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{API_BANDS}/", params=params)
            if response.status_code != 200:
                return []
            bands = response.json()
        except httpx.RequestError:
            return []

    for band in bands:
        band["_links"] = {
            "self": f"/api/bands/{band['id']}",
            "news": f"/api/news?search={band['name']}"
        }

    return bands
@api.get("/bands/{band_id}", response=BandResponseSchema, auth=JWTAuth())
async def get_band_details(request, band_id: int):
    async with httpx.AsyncClient() as client:
        band_response = await client.get(f"{API_BANDS}/{band_id}/")

        if band_response.status_code != 200:
            return api.create_response(request, {"erro": "Banda não encontrada"}, status=404)

        band_data = band_response.json()
        band_name = band_data.get("name", "")

        news_response = await client.get(API_NEWS, params={"search": band_name})
        news_data = (
            news_response.json() if news_response.status_code == 200 else []
        )

    return {
        "band": band_data,
        "news": news_data,
        "_links": {
            "self": f"/api/bands/{band_id}",
            "news_seach": f"/api/news?search={band_name}",
            "all_bands": "/api/bands"
        }
    }

@api.post("/bands/", auth=JWTAuth())
async def create_band(request, payload: BandInputSchema):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{API_BANDS}/", json=payload.dict())

    data = response.json()
    if response.status_code == 201:
        data["_links"] = {"self": f"/api/bands/{data['id']}"}

    return api.create_response(request, data, status=response.status_code)

@api.get("/news", response=List[NewsResponseSchema], auth=JWTAuth())
async def list_news(request, search: Optional[str] = None):
    params = {"search": search} if search else {}
    async with httpx.AsyncClient() as client:
        response = await client.get(API_NEWS, params=params)

    if response.status_code != 200:
        return []
    return response.json()
