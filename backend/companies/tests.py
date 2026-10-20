from rest_framework.test import APITestCase

from .models import Company
from users.models import User


class CompanyApprovalTests(APITestCase):
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

    def test_company_cannot_approve_itself(self):
        self.client.force_authenticate(self.company_user)

        response = self.client.patch(
            f'/api/companies/{self.company.id}/',
            {'is_approved': True},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.company.refresh_from_db()
        self.assertFalse(self.company.is_approved)

    def test_admin_can_approve_company(self):
        self.client.force_authenticate(self.admin)

        response = self.client.patch(
            f'/api/companies/{self.company.id}/',
            {'is_approved': True},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.company.refresh_from_db()
        self.assertTrue(self.company.is_approved)
