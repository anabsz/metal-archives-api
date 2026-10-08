from ninja import Schema, Field
from typing import Dict, Any, List, Optional

class BandItemSchema(Schema):
    id: int
    name: str
    genre: str
    country: str
    links: Dict[str, str] = Field(..., alias="_links")


class BandInputSchema(Schema):
    name: str
    genre: str
    country: str

class NewsResponseSchema(Schema):
    id: int
    title: str
    content: Optional[str] = None
    publishedAt: Optional[str] = None

class BandResponseSchema(Schema):
    band: Dict[str, Any]
    news: List[NewsResponseSchema] = []
    links: Dict[str, str] = Field(..., alias="_links")
