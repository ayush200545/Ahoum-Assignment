from rest_framework import serializers
from .models import Session, Category
from apps.accounts.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon']


class SessionSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False
    )
    spots_remaining = serializers.ReadOnlyField()
    is_sold_out = serializers.ReadOnlyField()
    is_free = serializers.ReadOnlyField()
    bookings_count = serializers.SerializerMethodField()

    class Meta:
        model = Session
        fields = [
            'id', 'title', 'description', 'creator', 'category', 'category_id',
            'price', 'duration_minutes', 'max_participants', 'start_time',
            'image', 'status', 'tags', 'spots_remaining', 'is_sold_out',
            'is_free', 'bookings_count', 'benefits', 'curriculum', 'requirements',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'creator', 'created_at', 'updated_at']

    def get_bookings_count(self, obj):
        return obj.bookings.filter(status='confirmed').count()

    def create(self, validated_data):
        validated_data['creator'] = self.context['request'].user
        return super().create(validated_data)
