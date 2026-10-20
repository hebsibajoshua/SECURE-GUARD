from datetime import timedelta

from django.utils import timezone
from rest_framework.test import APITestCase

from companies.models import Company
from guards.models import Guard
from users.models import User

from .models import Assignment, GuardRequest


class GuardRequestWorkflowTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='test-password-123',
            role=User.Role.ADMIN,
        )
        self.company_user = User.objects.create_user(
            username='company',
            email='company@example.com',
            password='test-password-123',
            role=User.Role.COMPANY,
        )
        self.company = Company.objects.create(
            user=self.company_user,
            company_name='Example Company',
            contact_person='Example Person',
            phone='1234567890',
            address='Example address',
        )

    def make_request(self, **overrides):
        values = {
            'company': self.company,
            'location': 'Main entrance',
            'number_of_guards': 1,
            'shift': GuardRequest.Shift.DAY,
            'duty_date': timezone.localdate() + timedelta(days=1),
            'gender_requirement': GuardRequest.GenderPref.ANY,
        }
        values.update(overrides)
        return GuardRequest.objects.create(**values)

    def test_unapproved_company_cannot_submit_requests(self):
        self.client.force_authenticate(self.company_user)

        response = self.client.post('/api/requests/', {
            'location': 'Main entrance',
            'number_of_guards': 1,
            'shift': 'day',
            'duty_date': (timezone.localdate() + timedelta(days=1)).isoformat(),
            'gender_requirement': 'any',
        }, format='json')

        self.assertEqual(response.status_code, 403)
        self.assertEqual(GuardRequest.objects.count(), 0)

    def test_company_cannot_approve_own_request(self):
        request = self.make_request()
        self.client.force_authenticate(self.company_user)

        response = self.client.post(f'/api/requests/{request.id}/approve/')

        self.assertEqual(response.status_code, 403)
        request.refresh_from_db()
        self.assertEqual(request.status, GuardRequest.Status.PENDING)

    def test_assignment_enforces_gender_and_guard_count(self):
        request = self.make_request(gender_requirement=GuardRequest.GenderPref.FEMALE)
        male_guard = Guard.objects.create(
            full_name='Male Guard',
            phone='1234567890',
            gender=Guard.Gender.MALE,
        )
        female_guard = Guard.objects.create(
            full_name='Female Guard',
            phone='1234567891',
            gender=Guard.Gender.FEMALE,
        )
        self.client.force_authenticate(self.admin)

        invalid_response = self.client.post(
            f'/api/requests/{request.id}/assign_guard/',
            {'guard_id': male_guard.id},
            format='json',
        )
        valid_response = self.client.post(
            f'/api/requests/{request.id}/assign_guard/',
            {'guard_id': female_guard.id},
            format='json',
        )
        over_capacity_response = self.client.post(
            f'/api/requests/{request.id}/assign_guard/',
            {'guard_id': male_guard.id},
            format='json',
        )

        self.assertEqual(invalid_response.status_code, 400)
        self.assertEqual(valid_response.status_code, 200)
        self.assertEqual(over_capacity_response.status_code, 400)
        self.assertEqual(Assignment.objects.filter(request=request).count(), 1)
