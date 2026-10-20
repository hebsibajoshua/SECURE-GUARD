from django.utils import timezone
from rest_framework.test import APITestCase

from companies.models import Company
from guard_requests.models import Assignment, GuardRequest
from guards.models import Guard
from users.models import User


class AttendanceWorkflowTests(APITestCase):
    def setUp(self):
        self.company_user = User.objects.create_user(
            username='company',
            email='company@example.com',
            password='test-password-123',
            role=User.Role.COMPANY,
        )
        company = Company.objects.create(
            user=self.company_user,
            company_name='Example Company',
            contact_person='Example Person',
            phone='1234567890',
            address='Example address',
            is_approved=True,
        )
        self.guard_user = User.objects.create_user(
            username='guard',
            email='guard@example.com',
            password='test-password-123',
            role=User.Role.GUARD,
        )
        guard = Guard.objects.create(
            user=self.guard_user,
            full_name='Example Guard',
            phone='1234567890',
        )
        request = GuardRequest.objects.create(
            company=company,
            location='Main entrance',
            number_of_guards=1,
            duty_date=timezone.localdate(),
            status=GuardRequest.Status.APPROVED,
        )
        self.assignment = Assignment.objects.create(request=request, guard=guard)

    def test_generic_attendance_write_endpoint_is_disabled(self):
        self.client.force_authenticate(self.company_user)

        response = self.client.post('/api/attendance/', {
            'assignment': self.assignment.id,
        }, format='json')

        self.assertEqual(response.status_code, 405)

    def test_guard_can_check_in_and_out_only_once(self):
        self.client.force_authenticate(self.guard_user)

        check_in = self.client.post(
            '/api/attendance/check_in/',
            {'assignment': self.assignment.id},
            format='json',
        )
        duplicate_check_in = self.client.post(
            '/api/attendance/check_in/',
            {'assignment': self.assignment.id},
            format='json',
        )
        check_out = self.client.post(
            '/api/attendance/check_out/',
            {'assignment': self.assignment.id},
            format='json',
        )

        self.assertEqual(check_in.status_code, 200)
        self.assertEqual(duplicate_check_in.status_code, 400)
        self.assertEqual(check_out.status_code, 200)
