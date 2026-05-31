from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    display_avatar = serializers.ReadOnlyField()
    is_creator = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name',
                  'role', 'bio', 'avatar', 'avatar_url', 'display_avatar',
                  'is_creator', 'created_at']
        read_only_fields = ['id', 'email', 'created_at']


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'bio', 'avatar', 'role']

    def validate_role(self, value):
        # Users can switch between user and creator freely
        if value not in [User.ROLE_USER, User.ROLE_CREATOR]:
            raise serializers.ValidationError('Invalid role.')
        return value
