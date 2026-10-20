from rest_framework import viewsets, permissions
from .models import Guard
from .serializers import GuardSerializer
from users.models import User


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.role == User.Role.ADMIN:
            return True
        return request.method in permissions.SAFE_METHODS


class GuardViewSet(viewsets.ModelViewSet):
    serializer_class = GuardSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = Guard.objects.all().order_by('full_name')
        if user.role == User.Role.GUARD:
            return qs.filter(user=user)
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        return qs
