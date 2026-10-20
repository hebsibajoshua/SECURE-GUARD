from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import GuardRequest, Assignment
from .serializers import GuardRequestSerializer, AssignmentSerializer
from users.models import User
from guards.models import Guard


class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == User.Role.ADMIN
        )


class IsCompanyRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == User.Role.COMPANY
        )


class GuardRequestViewSet(viewsets.ModelViewSet):
    serializer_class = GuardRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in {'approve', 'reject', 'complete', 'assign_guard', 'update', 'partial_update', 'destroy'}:
            return [permissions.IsAuthenticated(), IsAdminRole()]
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsCompanyRole()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        qs = GuardRequest.objects.all().order_by('-created_at')
        if user.role == User.Role.COMPANY:
            qs = qs.filter(company__user=user)
        elif user.role == User.Role.GUARD:
            qs = qs.filter(assignments__guard__user=user).distinct()
        return qs

    def perform_create(self, serializer):
        company = getattr(self.request.user, 'company_profile', None)
        if company is None:
            raise PermissionDenied('A company profile is required to submit a request.')
        if not company.is_approved:
            raise PermissionDenied('Your company account is awaiting approval.')
        serializer.save(company=company)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        req = self.get_object()
        if req.status != GuardRequest.Status.PENDING:
            return Response({'detail': 'Only pending requests can be approved.'}, status=status.HTTP_400_BAD_REQUEST)
        req.status = GuardRequest.Status.APPROVED
        req.save()
        return Response(GuardRequestSerializer(req).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        req = self.get_object()
        if req.status != GuardRequest.Status.PENDING:
            return Response({'detail': 'Only pending requests can be rejected.'}, status=status.HTTP_400_BAD_REQUEST)
        req.status = GuardRequest.Status.REJECTED
        req.save()
        return Response(GuardRequestSerializer(req).data)

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def complete(self, request, pk=None):
        req = self.get_object()
        if req.status != GuardRequest.Status.APPROVED:
            return Response({'detail': 'Only approved requests can be completed.'}, status=status.HTTP_400_BAD_REQUEST)
        assignments = list(req.assignments.select_related('guard'))
        req.status = GuardRequest.Status.COMPLETED
        req.save()
        for assignment in assignments:
            assignment.status = Assignment.Status.COMPLETED
            assignment.save(update_fields=['status'])
            assignment.guard.status = Guard.Status.AVAILABLE
            assignment.guard.save(update_fields=['status'])
        return Response(GuardRequestSerializer(req).data)

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def assign_guard(self, request, pk=None):
        req = self.get_object()
        guard_id = request.data.get('guard_id')
        if not guard_id:
            return Response({'detail': 'guard_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if req.status not in {GuardRequest.Status.PENDING, GuardRequest.Status.APPROVED}:
            return Response({'detail': 'Guards can only be assigned to pending or approved requests.'}, status=status.HTTP_400_BAD_REQUEST)
        if req.assignments.count() >= req.number_of_guards:
            return Response({'detail': 'This request already has the required number of guards.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            guard_id = int(guard_id)
        except (TypeError, ValueError):
            return Response({'detail': 'guard_id must be a valid integer.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            guard = Guard.objects.select_for_update().get(id=guard_id)
        except Guard.DoesNotExist:
            return Response({'detail': 'Guard not found.'}, status=404)
        if guard.status != Guard.Status.AVAILABLE:
            return Response({'detail': 'Guard is not available.'}, status=400)
        if req.gender_requirement != GuardRequest.GenderPref.ANY and guard.gender != req.gender_requirement:
            return Response({'detail': 'Guard does not meet the request gender requirement.'}, status=400)

        Assignment.objects.create(request=req, guard=guard)
        guard.status = Guard.Status.ASSIGNED
        guard.save(update_fields=['status'])
        if req.status == GuardRequest.Status.PENDING:
            req.status = GuardRequest.Status.APPROVED
            req.save()
        return Response(GuardRequestSerializer(req).data)


class AssignmentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Assignment.objects.all().order_by('-assigned_at')
        if user.role == User.Role.GUARD:
            qs = qs.filter(guard__user=user)
        elif user.role == User.Role.COMPANY:
            qs = qs.filter(request__company__user=user)
        return qs
