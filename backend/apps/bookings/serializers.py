from rest_framework import serializers
from .models import Booking
from apps.sessions.models import Session
from apps.sessions.serializers import SessionSerializer
from apps.accounts.serializers import UserSerializer


class BookingSerializer(serializers.ModelSerializer):
    session = SessionSerializer(read_only=True)
    session_id = serializers.PrimaryKeyRelatedField(
        queryset=Session.objects.all(),
        source='session',
        write_only=True
    )
    user = UserSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'session', 'session_id', 'status',
            'payment_status', 'stripe_session_id', 'razorpay_order_id',
            'razorpay_payment_id', 'notes', 'booked_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'status', 'payment_status', 'booked_at']

    def validate_session_id(self, session):
        user = self.context['request'].user
        if Booking.objects.filter(user=user, session=session).exists():
            raise serializers.ValidationError('You have already booked this session.')
        if session.spots_remaining <= 0:
            raise serializers.ValidationError('This session is sold out.')
        return session
