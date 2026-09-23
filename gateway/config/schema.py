# gateway/schemas.py
from ninja import Schema
from typing import List, Dict, Any, Optional

class BandInputSchema(Schema):
    name: str
    genre: str
    country: str

class BandResponseSchema(Schema):
    band_: Dict[str, Any]
    links: Dict[str, str]
