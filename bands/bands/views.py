from rest_framework import viewsets
from .models import Band
from .serializers import BandSerializer
from rest_framework import filters

class BandViewSet(viewsets.ModelViewSet):
    queryset = Band.objects.all()
    serializer_class = BandSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]
