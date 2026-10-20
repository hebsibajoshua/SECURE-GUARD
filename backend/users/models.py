from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user with a role: admin, company, or guard."""

    class Role(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        COMPANY = 'company', 'Company'
        GUARD = 'guard', 'Guard'

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.GUARD)
    phone = models.CharField(max_length=20, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email} ({self.role})"
