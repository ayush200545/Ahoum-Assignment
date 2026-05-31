from django.conf import settings
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django_ratelimit.decorators import ratelimit

from .serializers import UserSerializer, UserUpdateSerializer

User = get_user_model()


def get_tokens_for_user(user):
    """Generate JWT access + refresh tokens for a user."""
    refresh = RefreshToken.for_user(user)
    refresh['role'] = user.role
    refresh['email'] = user.email
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='5/m', block=True)
def register_view(request):
    """
    Register a new user with email, username, password, and optional role.
    Returns JWT tokens + user profile on success.
    """
    email = request.data.get('email', '').strip().lower()
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')
    confirm_password = request.data.get('confirm_password', '')
    first_name = request.data.get('first_name', '').strip()
    last_name = request.data.get('last_name', '').strip()
    role = request.data.get('role', User.ROLE_USER)

    # --- Validation ---
    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not username:
        return Response({'error': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not password:
        return Response({'error': 'Password is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if password != confirm_password:
        return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)
    if len(password) < 8:
        return Response({'error': 'Password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)
    if role not in [User.ROLE_USER, User.ROLE_CREATOR]:
        role = User.ROLE_USER

    # --- Uniqueness checks ---
    if User.objects.filter(email=email).exists():
        return Response({'error': 'An account with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'This username is already taken.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=role,
        )
        tokens = get_tokens_for_user(user)
        return Response({
            'tokens': tokens,
            'user': UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='5/m', block=True)
def login_view(request):
    """Local login using email and password. Returns clear error if credentials are wrong."""
    from django.contrib.auth import authenticate
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')

    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if user exists first (better error messages)
    if not User.objects.filter(email=email).exists():
        return Response(
            {'error': 'No account found with this email address. Please register first.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    user = authenticate(request, username=email, password=password)

    if user and user.is_active:
        tokens = get_tokens_for_user(user)
        return Response({
            'tokens': tokens,
            'user': UserSerializer(user).data
        })

    return Response(
        {'error': 'Incorrect password. Please try again.'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([AllowAny])
def oauth_redirect(request):
    """
    After successful social authentication (Google/GitHub), social-django
    calls LOGIN_REDIRECT_URL which points here.
    We generate JWT tokens and redirect the user back to the React frontend
    with the tokens in the query parameters.
    """
    if not request.user.is_authenticated:
        frontend_error_url = f"{settings.FRONTEND_URL}/auth/callback?error=not_authenticated"
        return redirect(frontend_error_url)

    tokens = get_tokens_for_user(request.user)
    redirect_url = (
        f"{settings.FRONTEND_URL}/auth/callback"
        f"?access={tokens['access']}&refresh={tokens['refresh']}"
    )
    return redirect(redirect_url)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def me(request):
    """Get or update current user profile."""
    if request.method == 'GET':
        return Response(UserSerializer(request.user).data)

    serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(UserSerializer(request.user).data)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Blacklist the refresh token."""
    try:
        from django.contrib.auth import logout as django_logout
        django_logout(request)  # Clear the Django session cookie

        refresh_token = request.data['refresh']
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Logged out successfully'}, status=205)
    except Exception:
        return Response({'error': 'Invalid token'}, status=400)
