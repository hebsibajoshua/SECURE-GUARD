from django.contrib.auth import authenticate
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import UserSerializer, LoginSerializer


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response({'detail': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        })


class MeView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class RegisterCompanyView(APIView):
    """Allows a new company to self-register; admin must approve before they can submit requests."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from companies.models import Company

        data = request.data
        required = ['email', 'password', 'company_name', 'contact_person', 'phone', 'address']
        missing = [f for f in required if not data.get(f)]
        if missing:
            return Response({'detail': f"Missing fields: {', '.join(missing)}"}, status=400)

        if User.objects.filter(email=data['email']).exists():
            return Response({'detail': 'Email already registered.'}, status=400)

        user = User.objects.create_user(
            username=data['email'],
            email=data['email'],
            password=data['password'],
            role=User.Role.COMPANY,
            phone=data.get('phone', ''),
        )
        Company.objects.create(
            user=user,
            company_name=data['company_name'],
            contact_person=data['contact_person'],
            phone=data['phone'],
            address=data['address'],
        )
        return Response({'detail': 'Registration successful. You may now log in.'}, status=201)
