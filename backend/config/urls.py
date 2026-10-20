from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import LoginView, MeView, RegisterCompanyView

urlpatterns = [
    path('admin/', admin.site.urls),

    # auth
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/me/', MeView.as_view(), name='me'),
    path('api/auth/register-company/', RegisterCompanyView.as_view(), name='register_company'),

    # apps
    path('api/companies/', include('companies.urls')),
    path('api/guards/', include('guards.urls')),
    path('api/requests/', include('guard_requests.urls')),
    path('api/attendance/', include('attendance.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
