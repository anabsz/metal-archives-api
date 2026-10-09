from ninja import NinjaAPI
from ninja_jwt.routers.obtain import obtain_pair_router

from routers.bands import router as bands_routers
from routers.news import router as news_routers

api = NinjaAPI(title="Metal Archives API Gateway", description="Gateway com HATEOAS")

api.add_router("/auth", obtain_pair_router, tags=["Auth"])
api.add_router("/bands", bands_routers)
api.add_router("/news", news_routers)
