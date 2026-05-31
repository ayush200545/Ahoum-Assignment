from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, default='🎯')  # emoji icon

    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name


class Session(models.Model):
    STATUS_DRAFT = 'draft'
    STATUS_PUBLISHED = 'published'
    STATUS_CANCELLED = 'cancelled'
    STATUS_COMPLETED = 'completed'
    STATUS_CHOICES = [
        (STATUS_DRAFT, 'Draft'),
        (STATUS_PUBLISHED, 'Published'),
        (STATUS_CANCELLED, 'Cancelled'),
        (STATUS_COMPLETED, 'Completed'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_sessions'
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name='sessions'
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    duration_minutes = models.PositiveIntegerField(default=60)
    max_participants = models.PositiveIntegerField(default=10)
    start_time = models.DateTimeField()
    image = models.ImageField(upload_to='sessions/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PUBLISHED)
    tags = models.JSONField(default=list, blank=True)
    benefits = models.JSONField(default=list, blank=True)
    curriculum = models.JSONField(default=list, blank=True)
    requirements = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sessions'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def is_free(self):
        return self.price == 0

    @property
    def spots_remaining(self):
        confirmed_count = self.bookings.filter(status='confirmed').count()
        return max(0, self.max_participants - confirmed_count)

    @property
    def is_sold_out(self):
        return self.spots_remaining == 0

