import os
import httpx
from typing import Optional, Any

CATALOG_SERVICE_URL = os.getenv("CATALOG_SERVICE_URL", "http://localhost:8040/api/bands")
NEWS_SERVICE_URL = os.getenv("NEWS_SERVICE_URL", "http://localhost:8080/api/news")

async def fetch_service(url: str, params: Optional[dict] = None) -> Optional[Any]:
    """Realiza requisições GET para os microserviços."""
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            response = await client.get(url, params=params)
            if response.status_code == 200:
                return response.json()
            return None
        except httpx.RequestError:
            return None
