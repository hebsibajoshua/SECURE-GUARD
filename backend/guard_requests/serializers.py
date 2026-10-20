from rest_framework import serializers
from django.utils import timezone
from .models import GuardRequest, Assignment
from guards.serializers import GuardSerializer


class RequestMiniSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.company_name', read_only=True)

    class Meta:
        model = GuardRequest
        fields = ['id', 'company_name', 'location', 'shift', 'duty_date', 'status']


class AssignmentSerializer(serializers.ModelSerializer):
    guard_detail = GuardSerializer(source='guard', read_only=True)
    request_detail = RequestMiniSerializer(source='request', read_only=True)

    class Meta:
        model = Assignment
        fields = ['id', 'request', 'request_detail', 'guard', 'guard_detail', 'status', 'assigned_at']


class GuardRequestSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.company_name', read_only=True)
    assignments = AssignmentSerializer(many=True, read_only=True)

    def validate_number_of_guards(self, value):
        if value < 1:
            raise serializers.ValidationError('At least one guard is required.')
        return value

    def validate_duty_date(self, value):
        if value < timezone.localdate():
            raise serializers.ValidationError('Duty date cannot be in the past.')
        return value

    class Meta:
        model = GuardRequest
        fields = [
            'id', 'company', 'company_name', 'location', 'number_of_guards', 'shift',
            'duty_date', 'gender_requirement', 'special_notes', 'status', 'created_at',
            'assignments',
        ]
        read_only_fields = ['company', 'status']
