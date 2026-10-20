from rest_framework import serializers
from .models import Guard


class GuardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guard
        fields = [
            'id', 'user', 'full_name', 'phone', 'gender', 'address',
            'experience_years', 'id_proof_number', 'status', 'photo', 'created_at',
        ]
