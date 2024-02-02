from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    DepartmentViewSet,
    LabViewSet,
    PurchaseOrderViewSet,
    EquipmentViewSet,
    EquipmentIssueViewSet,
    EquipmentReviewViewSet,
    InvoiceViewSet, 
    ConsumableViewSet,
    ConsumableStockViewSet,
    ExperimentViewSet,
    ApparatusViewSet,
    upload_excel,
    invoice_excel,
    purchase_excel,
    upload_image,
    process_and_delete_images
      # Added InvoiceViewSet
)
from lab.views import (
    SendPasswordResetEmailView,
    UserChangePasswordView,
    UserLoginView,
    UserProfileView,
    UserRegistrationView,
    UserPasswordResetView,
)
from rest_framework_simplejwt import views as jwt_views

# Create a router and register your viewsets with it.
router = DefaultRouter()
router.register(r'department', DepartmentViewSet)
router.register(r'lab', LabViewSet)
router.register(r'purchase_order', PurchaseOrderViewSet)
router.register(r'equipment', EquipmentViewSet)
router.register(r'equipment_issue', EquipmentIssueViewSet)
router.register(r'equipment_review', EquipmentReviewViewSet)
router.register(r'invoice', InvoiceViewSet)  # Register InvoiceViewSet
router.register(r'Consumable', ConsumableViewSet)  # Register InvoiceViewSet
router.register(r'ConsumableStock', ConsumableStockViewSet)  # Register InvoiceViewSet
router.register(r'Experiment', ExperimentViewSet)  # Register InvoiceViewSet
router.register(r'Apparatus', ApparatusViewSet)  # Register InvoiceViewSet

urlpatterns = [
    path('', include(router.urls)),
    path('upload_image/', upload_image, name='upload_image'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path("purchase-excel/", purchase_excel, name="purchase_excel"),
    path('upload-excel/', upload_excel, name='upload-excel'), 
    path('invoice-excel/', invoice_excel, name='invoice-excel'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('ocr/', process_and_delete_images, name='ocr_view'),


]
