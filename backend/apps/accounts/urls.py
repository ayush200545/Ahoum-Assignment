from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Local Auth
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout, name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # OAuth callback (called by social-django after provider redirect)
    path('oauth-redirect/', views.oauth_redirect, name='oauth-redirect'),

    # Profile
    path('me/', views.me, name='me'),
]
