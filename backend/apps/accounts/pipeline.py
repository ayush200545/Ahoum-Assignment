"""Custom social-auth pipeline step to save avatar from OAuth provider."""
import requests
from django.core.files.base import ContentFile


def save_avatar(backend, user, response, *args, **kwargs):
    """Save the OAuth provider's avatar URL on the user profile."""
    avatar_url = None

    if backend.name == 'google-oauth2':
        avatar_url = response.get('picture')
    elif backend.name == 'github':
        avatar_url = response.get('avatar_url')

    if avatar_url and not user.avatar_url:
        user.avatar_url = avatar_url
        user.save(update_fields=['avatar_url'])
