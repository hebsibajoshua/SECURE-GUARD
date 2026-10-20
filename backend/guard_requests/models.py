from django.db import models
from companies.models import Company
from guards.models import Guard


class GuardRequest(models.Model):
    class Shift(models.TextChoices):
        DAY = 'day', 'Day'
        NIGHT = 'night', 'Night'
        ROTATIONAL = 'rotational', 'Rotational'

    class GenderPref(models.TextChoices):
        MALE = 'male', 'Male'
        FEMALE = 'female', 'Female'
        ANY = 'any', 'Any'

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        COMPLETED = 'completed', 'Completed'
        REJECTED = 'rejected', 'Rejected'

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='requests')
    location = models.CharField(max_length=200)
    number_of_guards = models.PositiveIntegerField(default=1)
    shift = models.CharField(max_length=12, choices=Shift.choices, default=Shift.DAY)
    duty_date = models.DateField()
    gender_requirement = models.CharField(max_length=10, choices=GenderPref.choices, default=GenderPref.ANY)
    special_notes = models.TextField(blank=True)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request #{self.id} - {self.company.company_name}"


class Assignment(models.Model):
    class Status(models.TextChoices):
        ASSIGNED = 'assigned', 'Assigned'
        ON_DUTY = 'on_duty', 'On Duty'
        COMPLETED = 'completed', 'Completed'

    request = models.ForeignKey(GuardRequest, on_delete=models.CASCADE, related_name='assignments')
    guard = models.ForeignKey(Guard, on_delete=models.CASCADE, related_name='assignments')
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.ASSIGNED)
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('request', 'guard')

    def __str__(self):
        return f"{self.guard.full_name} -> Request #{self.request_id}"
