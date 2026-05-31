from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SessionViewSet, CategoryViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('', SessionViewSet, basename='session')

urlpatterns = [
    path('', include(router.urls)),
]
