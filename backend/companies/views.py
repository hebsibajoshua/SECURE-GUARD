from rest_framework import viewsets, permissions
from .models import Company
from .serializers import CompanySerializer
from users.models import User


class IsAdminOrSelf(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.role == User.Role.ADMIN:
            return True
        return request.method in permissions.SAFE_METHODS or view.action in ['retrieve', 'partial_update', 'update']

    def has_object_permission(self, request, view, obj):
        if request.user.role == User.Role.ADMIN:
            return True
        return obj.user_id == request.user.id


class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSelf]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.Role.ADMIN:
            return Company.objects.all().order_by('-created_at')
        return Company.objects.filter(user=user)
