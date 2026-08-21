from rest_framework import generics, permissions
from .models import Video, Podcast
from .serializers import VideoSerializer, PodcastSerializer

class VideoListView(generics.ListAPIView):
    queryset = Video.objects.all().order_by('-published_at')
    serializer_class = VideoSerializer
    permission_classes = (permissions.AllowAny,)

class PodcastListView(generics.ListAPIView):
    queryset = Podcast.objects.all().order_by('-published_at')
    serializer_class = PodcastSerializer
    permission_classes = (permissions.AllowAny,)
