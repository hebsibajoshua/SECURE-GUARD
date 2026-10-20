"""
Seeds the database with demo data so you can log in and explore the app
without manually creating records.

Usage: python manage.py seed_data
"""
from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.db import transaction

from users.models import User
from companies.models import Company
from guards.models import Guard
from guard_requests.models import GuardRequest, Assignment


class Command(BaseCommand):
    help = 'Seed the database with demo Admin, Company, and Guard accounts plus sample data.'

    @transaction.atomic
    def handle(self, *args, **options):
        if User.objects.filter(email='admin@secureguard.com').exists():
            self.stdout.write(self.style.WARNING('Demo data already exists. Skipping.'))
            return

        # --- Admin ---
        admin = User.objects.create_superuser(
            username='admin', email='admin@secureguard.com', password='admin123', role=User.Role.ADMIN
        )

        # --- Company ---
        company_user = User.objects.create_user(
            username='brightcorp', email='company@secureguard.com', password='company123',
            role=User.Role.COMPANY,
        )
        company = Company.objects.create(
            user=company_user,
            company_name='BrightCorp Towers',
            contact_person='Asha Mehta',
            phone='9876543210',
            address='MG Road, Pune',
            is_approved=True,
        )

        # --- Guards (a mix of users with login + plain records) ---
        guard_user = User.objects.create_user(
            username='ravi.guard', email='guard@secureguard.com', password='guard123',
            role=User.Role.GUARD,
        )
        guard1 = Guard.objects.create(
            user=guard_user, full_name='Ravi Kumar', phone='9123456780', gender=Guard.Gender.MALE,
            experience_years=4, id_proof_number='AAD1234XYZ', status=Guard.Status.AVAILABLE,
        )
        guard2 = Guard.objects.create(
            full_name='Sunita Devi', phone='9988776655', gender=Guard.Gender.FEMALE,
            experience_years=2, id_proof_number='AAD5678ABC', status=Guard.Status.AVAILABLE,
        )
        guard3 = Guard.objects.create(
            full_name='Manoj Singh', phone='9090909090', gender=Guard.Gender.MALE,
            experience_years=6, id_proof_number='AAD9999LMN', status=Guard.Status.AVAILABLE,
        )

        # --- Sample requests ---
        req1 = GuardRequest.objects.create(
            company=company, location='BrightCorp Towers - Gate 2', number_of_guards=2,
            shift=GuardRequest.Shift.DAY, duty_date=date.today() + timedelta(days=1),
            gender_requirement=GuardRequest.GenderPref.ANY, special_notes='Need experienced guards for VIP visit.',
            status=GuardRequest.Status.PENDING,
        )
        req2 = GuardRequest.objects.create(
            company=company, location='BrightCorp Towers - Parking Lot', number_of_guards=1,
            shift=GuardRequest.Shift.NIGHT, duty_date=date.today(),
            gender_requirement=GuardRequest.GenderPref.MALE, status=GuardRequest.Status.APPROVED,
        )
        Assignment.objects.create(request=req2, guard=guard1)
        guard1.status = Guard.Status.ASSIGNED
        guard1.save()

        self.stdout.write(self.style.SUCCESS('Demo data created successfully!'))
        self.stdout.write('')
        self.stdout.write('Login credentials:')
        self.stdout.write('  Admin    -> admin@secureguard.com / admin123')
        self.stdout.write('  Company  -> company@secureguard.com / company123')
        self.stdout.write('  Guard    -> guard@secureguard.com / guard123')
