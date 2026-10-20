from rest_framework.routers import DefaultRouter
from .views import GuardViewSet

router = DefaultRouter()
router.register('', GuardViewSet, basename='guard')

urlpatterns = router.urls
