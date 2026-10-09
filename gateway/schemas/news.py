from typing import Optional
from ninja import Schema


class NewsSchema(Schema):
    id: int
    title: str
    content: Optional[str] = None
    publishedAt: Optional[str] = None
