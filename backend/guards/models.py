from django.db import models
from users.models import User


class Guard(models.Model):
    class Gender(models.TextChoices):
        MALE = 'male', 'Male'
        FEMALE = 'female', 'Female'

    class Status(models.TextChoices):
        AVAILABLE = 'available', 'Available'
        ASSIGNED = 'assigned', 'Assigned'
        INACTIVE = 'inactive', 'Inactive'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='guard_profile', null=True, blank=True)
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    gender = models.CharField(max_length=10, choices=Gender.choices, default=Gender.MALE)
    address = models.TextField(blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    id_proof_number = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.AVAILABLE)
    photo = models.ImageField(upload_to='guard_photos/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name
