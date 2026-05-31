from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator

from .models import Session, Category
from .serializers import SessionSerializer, CategorySerializer
from apps.accounts.permissions import IsCreator


class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.select_related('creator', 'category').filter(
        status=Session.STATUS_PUBLISHED
    )
    serializer_class = SessionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['price', 'start_time', 'created_at']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsCreator()]
        return [IsAuthenticatedOrReadOnly()]

    def get_queryset(self):
        qs = super().get_queryset()
        # Creators see their own drafts too
        if self.request.user.is_authenticated and self.request.user.is_creator:
            qs = Session.objects.select_related('creator', 'category').filter(
                creator=self.request.user
            ) | qs
        return qs.distinct()

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def perform_update(self, serializer):
        # Only the creator can update their own session
        instance = self.get_object()
        if instance.creator != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You can only edit your own sessions.')
        serializer.save()

    @action(detail=False, methods=['get'], permission_classes=[IsCreator])
    def my_sessions(self, request):
        """Creator: get all their own sessions including drafts."""
        sessions = Session.objects.filter(creator=request.user).select_related('category')
        serializer = self.get_serializer(sessions, many=True)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
