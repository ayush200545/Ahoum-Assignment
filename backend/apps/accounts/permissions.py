from rest_framework.permissions import BasePermission


class IsCreator(BasePermission):
    """Allow access only to users with creator role."""
    message = 'You must be a creator to perform this action.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.is_creator
        )


class IsOwnerOrReadOnly(BasePermission):
    """Object-level permission: only owner can edit."""

    def has_object_permission(self, request, view, obj):
        from rest_framework.permissions import SAFE_METHODS
        if request.method in SAFE_METHODS:
            return True
        return obj == request.user or getattr(obj, 'creator', None) == request.user
