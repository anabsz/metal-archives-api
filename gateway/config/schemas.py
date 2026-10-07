from ninja import Schema, Field
from typing import Dict, Any, List, Optional

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
