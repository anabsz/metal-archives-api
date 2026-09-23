# gateway/api.py
from ninja import NinjaAPI
from ninja_jwt.controller import NinjaJWTDefaultController
from ninja_jwt.authentication import JWTAuth
from ninja_jwt.routers.obtain import obtain_pair_router
import httpx
import asyncio

from .schema import BandInputSchema, BandResponseSchema

api = NinjaAPI(title="Metal Archives API Gateway", description="Gateway com HATEOAS")

api.add_router("/auth", obtain_pair_router)


API_BANDS = "http://localhost:8001/api/bands"
JSON_PLACEHOLDER_TODOS = "https://jsonplaceholder.typicode.com/todos"

@api.get("/bands/{band_id}", response=BandResponseSchema, auth=JWTAuth())
async def get_band_details(request, band_id: int):
    async with httpx.AsyncClient() as client:
        band_task = client.get(f"{API_BANDS}/{band_id}/")
        json_task = client.get(f"{JSON_PLACEHOLDER_TODOS}/") # JsonPlaceholder só pra testar

        band_response, todos_response = await asyncio.gather(band_task, json_task)

    if band_response.status_code != 200:
        return api.create_response(request, {"erro": "Banda não encontrada"}, status=404)

    return {
        "band": band_response.json(),
        "todos": todos_response.json() if todos_response.status_code == 200 else [],
        "_links": {
            "self": f"/api/bands/{band_id}",
            "todos": f"/api/bands/{band_id}/todos",
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
