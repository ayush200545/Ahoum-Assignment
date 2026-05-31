from django.urls import path
from .views import (
    BookingCreateView, UserBookingsView, CreatorBookingsView,
    update_booking_status, create_stripe_checkout, stripe_webhook,
    create_razorpay_order, confirm_razorpay_payment
)

urlpatterns = [
    path('', BookingCreateView.as_view(), name='booking-create'),
    path('mine/', UserBookingsView.as_view(), name='user-bookings'),
    path('creator/', CreatorBookingsView.as_view(), name='creator-bookings'),
    path('<int:pk>/status/', update_booking_status, name='booking-status'),

    # Stripe bonus
    path('<int:booking_id>/checkout/', create_stripe_checkout, name='stripe-checkout'),
    path('webhook/stripe/', stripe_webhook, name='stripe-webhook'),

    # Razorpay integration
    path('razorpay/create/<int:booking_id>/', create_razorpay_order, name='razorpay-create'),
    path('razorpay/confirm/', confirm_razorpay_payment, name='razorpay-confirm'),
]

