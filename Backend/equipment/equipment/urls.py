from django.contrib import admin
from django.urls import path, include
# from rest_framework import routers
from lab import views
from lab.views import search

# router = routers.DefaultRouter()
# router.register(r'Departments', views.DepartmentViewSet, basename='Department')
# router.register(r'Labs', views.LabViewSet, basename='Lab')
# router.register(r'PurchaseOrders', views.PurchaseOrderViewSet, basename='PurchaseOrder')
# router.register(r'Equipments', views.EquipmentViewSet, basename='Equipment')
# router.register(r'EquipmentIssues', views.EquipmentIssueViewSet, basename='EquipmentIssue')
# router.register(r'equipment_review', views.EquipmentReviewViewSet, basename='equipment_review')

from django.urls import re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/', include(router.urls)),  # Uncomment this line to include the router URLs
    path('api/user/', include('lab.urls')),
    path('api/search/', search, name='search'),
]
