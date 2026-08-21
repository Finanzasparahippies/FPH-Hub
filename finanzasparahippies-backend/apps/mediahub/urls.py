from django.urls import path
from .views import VideoListView, PodcastListView

urlpatterns = [
    path("videos/", VideoListView.as_view(), name="video_list"),
    path("podcasts/", PodcastListView.as_view(), name="podcast_list"),
]
