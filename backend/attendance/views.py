from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Attendance
from .serializers import AttendanceSerializer
from guard_requests.models import Assignment, GuardRequest
from users.models import User


class AttendanceViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Attendance.objects.all().order_by('-date')
        if user.role == User.Role.GUARD:
            qs = qs.filter(assignment__guard__user=user)
        elif user.role == User.Role.COMPANY:
            qs = qs.filter(assignment__request__company__user=user)
        return qs

    def _get_guard_assignment(self, request):
        try:
            assignment_id = int(request.data.get('assignment'))
        except (TypeError, ValueError):
            return None, Response(
                {'detail': 'A valid assignment id is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            assignment = Assignment.objects.select_related('request').get(
                id=assignment_id,
                guard__user=request.user,
            )
        except Assignment.DoesNotExist:
            return None, Response({'detail': 'Assignment not found.'}, status=404)
        return assignment, None

    @action(detail=False, methods=['post'])
    def check_in(self, request):
        assignment, error = self._get_guard_assignment(request)
        if error:
            return error

        if (
            assignment.status not in {Assignment.Status.ASSIGNED, Assignment.Status.ON_DUTY}
            or assignment.request.status != GuardRequest.Status.APPROVED
        ):
            return Response({'detail': 'This assignment is not active.'}, status=status.HTTP_400_BAD_REQUEST)
        if assignment.request.duty_date != timezone.localdate():
            return Response({'detail': 'You can only check in on the duty date.'}, status=status.HTTP_400_BAD_REQUEST)

        record, _ = Attendance.objects.get_or_create(
            assignment=assignment,
            date=timezone.localdate(),
        )
        if record.check_in_time:
            return Response({'detail': 'Already checked in.'}, status=400)
        record.check_in_time = timezone.now()
        record.save()
        assignment.status = Assignment.Status.ON_DUTY
        assignment.save()
        return Response(AttendanceSerializer(record).data)

    @action(detail=False, methods=['post'])
    def check_out(self, request):
        assignment, error = self._get_guard_assignment(request)
        if error:
            return error

        if assignment.request.duty_date != timezone.localdate():
            return Response({'detail': 'You can only check out on the duty date.'}, status=status.HTTP_400_BAD_REQUEST)
        if assignment.status == Assignment.Status.COMPLETED:
            return Response({'detail': 'This assignment is already completed.'}, status=status.HTTP_400_BAD_REQUEST)
        if assignment.status != Assignment.Status.ON_DUTY:
            return Response({'detail': 'You must check in first.'}, status=status.HTTP_400_BAD_REQUEST)
        record = Attendance.objects.filter(assignment=assignment, date=timezone.localdate()).first()
        if not record or not record.check_in_time:
            return Response({'detail': 'You must check in first.'}, status=400)
        if record.check_out_time:
            return Response({'detail': 'Already checked out.'}, status=400)
        record.check_out_time = timezone.now()
        record.save()
        return Response(AttendanceSerializer(record).data)
