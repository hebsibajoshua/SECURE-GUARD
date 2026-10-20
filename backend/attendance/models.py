from django.db import models
from guard_requests.models import Assignment


class Attendance(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField(auto_now_add=True)
    check_in_time = models.DateTimeField(null=True, blank=True)
    check_out_time = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.assignment.guard.full_name} - {self.date}"
