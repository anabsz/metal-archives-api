from typing import Any, List, Dict
from ninja import Schema, Field

from .news import NewsSchema

class BandSchema(Schema):
    id: int
    name: str
    genre: str
    country: str
    links: Dict[str, str] = Field(..., alias="_links")


class BandSchemaSubmit(Schema):
    name: str
    genre: str
    country: str


class BandSchemaResponse(Schema):
    band: Dict[str, Any]
    news: List[NewsSchema] = []
    links: Dict[str, str] = Field(..., alias="_links")
