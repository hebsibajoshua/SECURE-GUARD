from rest_framework import serializers
from .models import Company
from users.models import User


class CompanySerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request')
        if request and getattr(request.user, 'role', None) != User.Role.ADMIN:
            fields['is_approved'].read_only = True
        return fields

    class Meta:
        model = Company
        fields = ['id', 'user', 'email', 'company_name', 'contact_person', 'phone', 'address', 'is_approved', 'created_at']
        read_only_fields = ['user']
