from typing import Optional, Dict, Any
from ninja import Schema, Field


class NewsSchema(Schema):
    id: int
    title: str
    content: Optional[str] = None
    publishedAt: Optional[str] = None

class NewsSchemaSubmit(Schema):
    title: str
    content: Optional[str] = None

class NewsResponseSchema(NewsSchema):
    links: Dict[str, str] = Field(..., alias="_links")
