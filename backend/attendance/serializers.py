from rest_framework import serializers
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    guard_name = serializers.CharField(source='assignment.guard.full_name', read_only=True)
    company_name = serializers.CharField(source='assignment.request.company.company_name', read_only=True)
    location = serializers.CharField(source='assignment.request.location', read_only=True)

    class Meta:
        model = Attendance
        fields = [
            'id', 'assignment', 'guard_name', 'company_name', 'location',
            'date', 'check_in_time', 'check_out_time',
        ]
