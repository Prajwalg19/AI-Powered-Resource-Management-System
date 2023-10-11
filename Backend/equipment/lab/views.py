from .serializers import DepartmentSerializer, LabSerializer, PurchaseOrderSerializer, EquipmentSerializer, EquipmentIssueSerializer, EquipmentReviewSerializer, InvoiceSerializer
from rest_framework import viewsets
from .models import Department, Lab, PurchaseOrder, Equipment, EquipmentIssue, EquipmentReview, Invoice
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from lab.serializers import SendPasswordResetEmailSerializer, UserChangePasswordSerializer, UserLoginSerializer, UserPasswordResetSerializer, UserProfileSerializer, UserRegistrationSerializer
from django.contrib.auth import authenticate
from lab.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from django.db.models import Q
from django.db import models
@authentication_classes([JWTAuthentication])
class DepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = DepartmentSerializer
    queryset = Department.objects.all()

class LabViewSet(viewsets.ModelViewSet):
    serializer_class = LabSerializer
    queryset = Lab.objects.all()

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    serializer_class = PurchaseOrderSerializer
    queryset = PurchaseOrder.objects.all()

class EquipmentViewSet(viewsets.ModelViewSet):
    serializer_class = EquipmentSerializer
    queryset = Equipment.objects.all()

class EquipmentIssueViewSet(viewsets.ModelViewSet):
    serializer_class = EquipmentIssueSerializer
    queryset = EquipmentIssue.objects.all()

class EquipmentReviewViewSet(viewsets.ModelViewSet):
    serializer_class = EquipmentReviewSerializer
    queryset = EquipmentReview.objects.all()

class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    queryset = Invoice.objects.all()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = get_tokens_for_user(user)
        return Response({'msg': 'Registration Successful'}, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
    renderer_classes = [UserRenderer]

    @authentication_classes([AllowAny])
    @permission_classes([AllowAny])
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        password = serializer.data.get('password')
        user = authenticate(email=email, password=password)
        if user is not None:
            role = user.role
            token = get_tokens_for_user(user)
            return Response({'token': token, 'role': role, 'msg': 'Login Success'}, status=status.HTTP_200_OK)
        else:
            return Response({'errors': {'non_field_errors': ['Email or Password is not Valid']}}, status=status.HTTP_404_NOT_FOUND)

class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Changed Successfully'}, status=status.HTTP_200_OK)

class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Reset link sent. Please check your Email'}, status=status.HTTP_200_OK)

class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context={'uid': uid, 'token': token})
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Reset Successfully'}, status=status.HTTP_200_OK)


@api_view(['GET'])
def search(request):
    query = request.GET.get('query', '')

    # Query departments based on department_name
    departments = Department.objects.filter(department_name__icontains=query)

    # Create a list to store related data
    related_data = []

    # Loop through departments and gather related data
    for department in departments:
        department_serializer = DepartmentSerializer(department).data
        labs = Lab.objects.filter(department_number=department)
        lab_serializer = LabSerializer(labs, many=True).data
        equipment = Equipment.objects.filter(lab_number__in=labs)
        equipment_serializer = EquipmentSerializer(equipment, many=True).data
        purchase_orders = PurchaseOrder.objects.filter(originator=department)
        purchase_order_serializer = PurchaseOrderSerializer(purchase_orders, many=True).data
        invoices = Invoice.objects.filter(purchase_order_no__in=purchase_orders)
        invoice_serializer = InvoiceSerializer(invoices, many=True).data
        equipment_issues = EquipmentIssue.objects.filter(lab_incharge__in=labs)
        equipment_issue_serializer = EquipmentIssueSerializer(equipment_issues, many=True).data
        equipment_reviews = EquipmentReview.objects.filter(equipment__in=equipment)
        equipment_review_serializer = EquipmentReviewSerializer(equipment_reviews, many=True).data

        related_data.append({
            'department': department_serializer,
            'labs': lab_serializer,
            'equipment': equipment_serializer,
            'purchase_orders': purchase_order_serializer,
            'invoices': invoice_serializer,
            'equipment_issues': equipment_issue_serializer,
            'equipment_reviews': equipment_review_serializer,
        })

    return Response(related_data)
