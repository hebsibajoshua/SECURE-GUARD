from rest_framework.routers import DefaultRouter
from .views import GuardRequestViewSet, AssignmentViewSet

router = DefaultRouter()
router.register('assignments', AssignmentViewSet, basename='assignment')
router.register('', GuardRequestViewSet, basename='guardrequest')

urlpatterns = router.urls
