from vosk import Model, KaldiRecognizer, SetLogLevel
from .model_loader import llm_Loader, vosk_loader 
import sys
import subprocess
from dateutil import parser
from decimal import Decimal
from datetime import datetime
import json
import re
import torch
from PIL import Image
import pytesseract
from .models import UploadedImage
from django.views.decorators.csrf import csrf_exempt
from .serializers import DepartmentSerializer, LabSerializer, PurchaseOrderSerializer, EquipmentSerializer, EquipmentIssueSerializer, EquipmentReviewSerializer, InvoiceSerializer, ConsumableSerializer
from .serializers import ConsumableSerializer, DepartmentSerializer, LabSerializer, PurchaseOrderSerializer, EquipmentSerializer, EquipmentIssueSerializer, EquipmentReviewSerializer, InvoiceSerializer
from rest_framework import viewsets
from .models import Department, Consumable, ConsumableStock, Lab, PurchaseOrder, Equipment, EquipmentIssue, EquipmentReview, Invoice, Experiment, Apparatus
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from lab.serializers import SendPasswordResetEmailSerializer, ConsumableStockSerializer, UserChangePasswordSerializer, UserLoginSerializer, UserPasswordResetSerializer, UserProfileSerializer, UserRegistrationSerializer, ExperimentSerializer, ApparatusSerializer
from django.contrib.auth import authenticate
from lab.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from django.db.models import Q
from django.db.models import ForeignKey, ManyToManyField
from django.db import models
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import pandas as pd
import os

from django.shortcuts import render
from django.http import JsonResponse
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM


@authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
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


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    queryset = Invoice.objects.all()


class ConsumableViewSet(viewsets.ModelViewSet):
    serializer_class = ConsumableSerializer
    queryset = Consumable.objects.all()


class ConsumableStockViewSet(viewsets.ModelViewSet):
    serializer_class = ConsumableStockSerializer
    queryset = ConsumableStock.objects.all()


class ExperimentViewSet(viewsets.ModelViewSet):
    serializer_class = ExperimentSerializer
    queryset = Experiment.objects.all()


class ApparatusViewSet(viewsets.ModelViewSet):
    serializer_class = ApparatusSerializer
    queryset = Apparatus.objects.all()


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
        serializer = UserChangePasswordSerializer(
            data=request.data, context={'user': request.user})
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
        serializer = UserPasswordResetSerializer(
            data=request.data, context={'uid': uid, 'token': token})
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Reset Successfully'}, status=status.HTTP_200_OK)


class EquipmentIssueViewSet(viewsets.ModelViewSet):
    serializer_class = EquipmentIssueSerializer
    queryset = EquipmentIssue.objects.all()


class EquipmentReviewViewSet(viewsets.ModelViewSet):
    serializer_class = EquipmentReviewSerializer
    queryset = EquipmentReview.objects.all()


@api_view(['GET'])
def search(request):
    query = request.GET.get('query', '')

    # Create a list to store related data
    related_data = []
    if re.search(r'.*computer.*', query.lower()):
        query = "CSE"
    elif re.search(r'.*communication.*', query.lower()):
        query = "ECE"
    elif re.search(r'.*information.*', query.lower()):
        query = "ISE"
    elif re.search(r'.*civil.*', query.lower()):
        query = "CIVIL"
    elif re.search(r'.*elect.*', query.lower()):
        query = "EEE"
    elif re.search(r'.*mech.*', query.lower()):
        query = "MECHANICAL"

    # Query departments based on department_name
    departments = Department.objects.filter(
        Q(department_name__icontains=query) | Q(hod_name__icontains=query))
    for department in departments:
        department_data = DepartmentSerializer(department).data
        labs = Lab.objects.filter(department_name=department)
        lab_data = LabSerializer(labs, many=True).data
        equipment = Equipment.objects.filter(lab_number__in=labs)
        equipment_data = EquipmentSerializer(equipment, many=True).data
        purchase_orders = PurchaseOrder.objects.filter(originator=department)
        purchase_order_data = PurchaseOrderSerializer(
            purchase_orders, many=True).data
        invoices = Invoice.objects.filter(
            purchase_order_no__in=purchase_orders)
        invoice_data = InvoiceSerializer(invoices, many=True).data
        equipment_issues = EquipmentIssue.objects.filter(lab_incharge__in=labs)
        equipment_issue_data = EquipmentIssueSerializer(
            equipment_issues, many=True).data
        equipment_reviews = EquipmentReview.objects.filter(
            equipment__in=equipment)
        equipment_review_data = EquipmentReviewSerializer(
            equipment_reviews, many=True).data

        related_data.append({
            'department': department_data,
            'labs': lab_data,
            'equipment': equipment_data,
            'purchase_orders': purchase_order_data,
            'invoices': invoice_data,
            'equipment_issues': equipment_issue_data,
            'equipment_reviews': equipment_review_data,
        })

    # Query labs
    labs = Lab.objects.filter(
        Q(lab_name__icontains=query) | Q(lab_incharge__icontains=query))
    for lab in labs:
        lab_data = LabSerializer(lab).data
        department = lab.department_name  # Assuming lab has a foreign key to department
        department_data = DepartmentSerializer(department).data
        equipment = Equipment.objects.filter(lab_number=lab)
        equipment_data = EquipmentSerializer(equipment, many=True).data
        purchase_orders = PurchaseOrder.objects.filter(originator=department)
        purchase_order_data = PurchaseOrderSerializer(
            purchase_orders, many=True).data
        invoices = Invoice.objects.filter(
            purchase_order_no__in=purchase_orders)
        invoice_data = InvoiceSerializer(invoices, many=True).data
        equipment_issues = EquipmentIssue.objects.filter(lab_incharge=lab)
        equipment_issue_data = EquipmentIssueSerializer(
            equipment_issues, many=True).data
        equipment_reviews = EquipmentReview.objects.filter(
            equipment__in=equipment)
        equipment_review_data = EquipmentReviewSerializer(
            equipment_reviews, many=True).data

        related_data.append({
            'department': department_data,
            'labs': lab_data,
            'equipment': equipment_data,
            'purchase_orders': purchase_order_data,
            'invoices': invoice_data,
            'equipment_issues': equipment_issue_data,
            'equipment_reviews': equipment_review_data,
        })

    # Query purchase_orders
    purchase_orders = PurchaseOrder.objects.filter(
        purchase_order_number__icontains=query)
    for purchase_order in purchase_orders:
        purchase_order_data = PurchaseOrderSerializer(purchase_order).data
        invoices = Invoice.objects.filter(
            purchase_order_no__in=purchase_orders)
        invoice_data = InvoiceSerializer(invoices, many=True).data

        related_data.append({
            'purchase_orders': purchase_order_data,
            'invoices': invoice_data,
        })

    # Query equipment
    equipment = Equipment.objects.filter(
        equipment_serial_number__icontains=query)
    for equip in equipment:
        equipment_data = EquipmentSerializer(equip).data
        lab = equip.lab_number  # Assuming equipment has a foreign key to lab
        lab_data = LabSerializer(lab).data
        purchase_orders = PurchaseOrder.objects.filter(
            originator=lab.department_name)
        purchase_order_data = PurchaseOrderSerializer(
            purchase_orders, many=True).data
        invoices = Invoice.objects.filter(
            purchase_order_no__in=purchase_orders)
        invoice_data = InvoiceSerializer(invoices, many=True).data

        related_data.append({
            'labs': lab_data,
            'equipment': equipment_data,
            'purchase_orders': purchase_order_data,
            'invoices': invoice_data,
        })

    # Query invoices
    invoices = Invoice.objects.filter(invoice_number__icontains=query)
    for invoice in invoices:
        invoice_data = InvoiceSerializer(invoice).data
        purchase_order = invoice.purchase_order_no
        purchase_order_data = PurchaseOrderSerializer(purchase_order).data
        department = purchase_order.originator
        department_data = DepartmentSerializer(department).data

        related_data.append({
            'department': department_data,
            'purchase_orders': purchase_order_data,
            'invoices': invoice_data,
        })

    return Response(related_data)


@api_view(['POST'])
# Ensure that this view is protected by authentication
@authentication_classes([JWTAuthentication])
def upload_excel(request):
    if request.method == 'POST':
        # Assuming the file input field has the name 'file'
        file = request.FILES['file']

        if file.name.endswith('.xls') or file.name.endswith('.xlsx'):
            try:
                df = pd.read_excel(file)
                for index, row in df.iterrows():

                    Equipment.objects.create(
                        equipment_serial_number=row['equipment_serial_number'],
                        lab_number=get_object_or_404(
                            Lab, lab_number=row['lab_number']),
                        description=row['description'],
                        invoice_number=get_object_or_404(
                            Invoice, invoice_number=row['invoice_number']),
                        life=row['life'],
                        residual_value=row['residual_value']
                    )
                return JsonResponse({'message': 'Data uploaded successfully'}, status=200)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=400)
        else:
            return JsonResponse({'error': 'Invalid file format'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


@api_view(['POST'])
# Ensure that this view is protected by authentication
@authentication_classes([JWTAuthentication])
def invoice_excel(request):
    if request.method == 'POST':
        # Assuming the file input field has the name 'file'
        file = request.FILES['file']

        if file.name.endswith('.xls') or file.name.endswith('.xlsx'):
            try:
                df = pd.read_excel(file)
                for index, row in df.iterrows():

                    Invoice.objects.create(
                        purchase_order_no=get_object_or_404(
                            PurchaseOrder, purchase_order_number=row['purchase_order_number']),
                        purchase_date=row['purchase_date'],
                        item_cost=row['item_cost'],
                        quantity=row['quantity'],
                        item_name=row['item_name'],
                        invoice_number=row['invoice_number']
                    )
                return JsonResponse({'message': 'Data uploaded successfully'}, status=200)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=400)
        else:
            return JsonResponse({'error': 'Invalid file format'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


@api_view(['POST'])
# Ensure that this view is protected by authentication
@authentication_classes([JWTAuthentication])
def purchase_excel(request):
    if request.method == 'POST':
        # Assuming the file input field has the name 'file'
        file = request.FILES['file']

        if file.name.endswith('.xls') or file.name.endswith('.xlsx'):
            try:
                df = pd.read_excel(file)
                for index, row in df.iterrows():

                    if row['originator'] == 'CSE':
                        row['originator'] = '1'
                    elif row['originator'] == 'ISE':
                        row['originator'] = '2'
                    elif row['originator'] == 'ECE':
                        row['originator'] = '3'
                    elif row['originator'] == 'EEE':
                        row['originator'] = '4'
                    elif row['originator'] == 'MECHANICAL':
                        row["originator"] = '5'
                    elif row['originator'] == 'CIVIL':
                        row["originator"] = '6'

                    PurchaseOrder.objects.create(
                        purchase_order_number=row['purchase_order_number'],
                        purchase_order_date=row['purchase_order_date'],
                        originator=get_object_or_404(
                            Department, department_number=row['originator']),
                        supplier=row['supplier'],
                        total_value=row['total_value'],
                    )
                return JsonResponse({'message': 'Data uploaded successfully'}, status=200)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=400)
        else:
            return JsonResponse({'error': 'Invalid file format'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def upload_image(request):
    if request.method == 'POST':
        image = request.FILES.get('image')

        if image:
            uploaded_image = UploadedImage.objects.create(image=image)
            return JsonResponse({'success': True, 'image_url': uploaded_image.image.url})

    return JsonResponse({'success': False})


# invoice processing


def perform_ocr_and_query(image_path, questions, tokenizer, model, tok_len):
    image = Image.open(image_path)

    extracted_text = pytesseract.image_to_string(image)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(device)
    model = model.to(device)

    def query_from_list(query, options, tok_len):
        t5query = f"""Question: "{query}" Context: {options}"""
        inputs = tokenizer(t5query, return_tensors="pt").to(device)
        outputs = model.generate(**inputs, max_new_tokens=tok_len)
        return tokenizer.batch_decode(outputs, skip_special_tokens=True)

    input_data = extracted_text
    results = {question: query_from_list(
        question, input_data, tok_len) for question in questions}
    print(results)
    return results


@csrf_exempt
def process_and_delete_images(request):
    try:
        decoded_body = request.body.decode('utf-8')
        json_data = json.loads(decoded_body)
        path = json_data.get('path', None)
        depNo = json_data.get('selection', None)
        files = os.listdir(path)

        for file_name in files:
            if file_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                image_path = os.path.join(path, file_name)

                model_name = "google/flan-t5-large"
                local_model_directory = "/flan-t5-large/"

                if not os.path.exists(local_model_directory):
                    tokenizer = AutoTokenizer.from_pretrained(model_name)
                    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

                    tokenizer.save_pretrained(local_model_directory)
                    model.save_pretrained(local_model_directory)
                else:
                    tokenizer = llm_Loader.tokenizer
                    model = llm_Loader.model

                questions = [
                    "What is the Invoice no?",
                    "What is the Invoice issue Date?",
                    "What is the supplier name?",
                    "What is the Total amount?",
                ]

                results = perform_ocr_and_query(
                    image_path, questions, tokenizer, model, 60)

                for question, answer_list in results.items():
                    if question == "What is the Invoice no?":
                        purchase_order_number = answer_list[0]
                    elif question == "What is the Invoice issue Date?":
                        try:
                            purchase_order_date = parser.parse(
                                answer_list[0]).date()
                        except ValueError:
                            purchase_order_date = None  # Set to None if parsing fails
                    elif question == "What is the supplier name?":
                        supplier_name = answer_list[0]
                    elif question == "What is the Total amount?":
                        total_amount_str = answer_list[0]
                        tt = ""
                        for char in total_amount_str:
                            if char.isdigit() or char == '.':
                                tt += char
                        try:
                            total_amount = Decimal(tt)
                        except:
                            numbers = tt.split()
                            total_amount = sum(Decimal(number)
                                               for number in numbers)

                department, created = Department.objects.get_or_create(
                    department_number=depNo,
                )
                purchase_order, created = PurchaseOrder.objects.update_or_create(
                    purchase_order_number=purchase_order_number,
                    originator=department,
                    defaults={
                        'purchase_order_date': purchase_order_date,
                        'supplier': supplier_name,
                        'total_value': total_amount,
                    }
                )

                os.remove(image_path)

        return JsonResponse({'success': True, 'message': results})

    except Exception as e:
        os.remove(image_path)
        return JsonResponse({'success': False, "error": str(e)})


# speech to text

#!/usr/bin/env python3
@api_view(['POST'])
@csrf_exempt
def speechToTextSearch(request):
    if request.method == 'POST' and request.FILES['audio']:
        audio_file = request.FILES['audio']
        print(audio_file)

    SAMPLE_RATE = 16000
    SetLogLevel(0)

    rec = vosk_loader.rec

    ffmpeg_cmd = ["ffmpeg", "-loglevel", "quiet", "-i", "pipe:0", "-ar", str(SAMPLE_RATE), "-ac", "1", "-f", "s16le", "-"]
    with subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE) as process:
           # Write the content of the audio file to the stdin of ffmpeg
          process.stdin.write(audio_file.read())
          process.stdin.close()

           # Read the output of ffmpeg and feed it to the recognizer
          while True:
                   data = process.stdout.read(4000)
                   if len(data) == 0:
                       break
                   if rec.AcceptWaveform(data):
                       print(rec.Result())
                   else:
                       print(rec.PartialResult())

       # Get the final transcription
    final_result = rec.FinalResult()
    result_dict = json.loads(final_result)
    print(result_dict)
    transcribed_text = result_dict.get("text", "")
    print(transcribed_text)

    query = transcribed_text
    if(query == "") :
        return Response({"status": False, "speech":"", "data": "" })
    # Create a list to store related data

    related_data = []
    if re.search(r'.*computer.*', query.lower()):
        query = "CSE"
    elif re.search(r'.*communication.*', query.lower()):
        query = "ECE"
    elif re.search(r'.*information.*', query.lower()):
        query = "ISE"
    elif re.search(r'.*civil.*', query.lower()):
        query = "CIVIL"
    elif re.search(r'.*elect.*', query.lower()):
        query = "EEE"
    elif re.search(r'.*mech.*', query.lower()):
        query = "MECHANICAL"



    # Query departments based on department_name
    departments = Department.objects.filter(
        Q(department_name__icontains=query) | Q(hod_name__icontains=query))
    for department in departments:
        department_data = DepartmentSerializer(department).data
        labs = Lab.objects.filter(department_name=department)
        lab_data = LabSerializer(labs, many=True).data
        equipment = Equipment.objects.filter(lab_number__in=labs)
        equipment_data = EquipmentSerializer(equipment, many=True).data
        purchase_orders = PurchaseOrder.objects.filter(originator=department)
        purchase_order_data = PurchaseOrderSerializer(
            purchase_orders, many=True).data
        invoices = Invoice.objects.filter(
            purchase_order_no__in=purchase_orders)
        invoice_data = InvoiceSerializer(invoices, many=True).data
        equipment_issues = EquipmentIssue.objects.filter(lab_incharge__in=labs)
        equipment_issue_data = EquipmentIssueSerializer(
            equipment_issues, many=True).data
        equipment_reviews = EquipmentReview.objects.filter(
            equipment__in=equipment)
        equipment_review_data = EquipmentReviewSerializer(
            equipment_reviews, many=True).data

        related_data.append({
            'department': department_data,
            'labs': lab_data,
            'equipment': equipment_data,
            'purchase_orders': purchase_order_data,
            'invoices': invoice_data,
            'equipment_issues': equipment_issue_data,
            'equipment_reviews': equipment_review_data,
        })

    # Query labs
    labs = Lab.objects.filter(
        Q(lab_name__icontains=query) | Q(lab_incharge__icontains=query))
    for lab in labs:
        lab_data = LabSerializer(lab).data
        department = lab.department_name  # Assuming lab has a foreign key to department
        department_data = DepartmentSerializer(department).data
        equipment = Equipment.objects.filter(lab_number=lab)
        equipment_data = EquipmentSerializer(equipment, many=True).data
        purchase_orders = PurchaseOrder.objects.filter(originator=department)
        purchase_order_data = PurchaseOrderSerializer(
            purchase_orders, many=True).data
        invoices = Invoice.objects.filter(
            purchase_order_no__in=purchase_orders)
        invoice_data = InvoiceSerializer(invoices, many=True).data
        equipment_issues = EquipmentIssue.objects.filter(lab_incharge=lab)
        equipment_issue_data = EquipmentIssueSerializer(
            equipment_issues, many=True).data
        equipment_reviews = EquipmentReview.objects.filter(
            equipment__in=equipment)
        equipment_review_data = EquipmentReviewSerializer(
            equipment_reviews, many=True).data

        related_data.append({
            'department': department_data,
            'labs': lab_data,
            'equipment': equipment_data,
            'purchase_orders': purchase_order_data,
            'invoices': invoice_data,
            'equipment_issues': equipment_issue_data,
            'equipment_reviews': equipment_review_data,
        })

    # Query purchase_orders
    purchase_orders = PurchaseOrder.objects.filter(
        purchase_order_number__icontains=query)
    for purchase_order in purchase_orders:
        purchase_order_data = PurchaseOrderSerializer(purchase_order).data
        invoices = Invoice.objects.filter(
            purchase_order_no__in=purchase_orders)
        invoice_data = InvoiceSerializer(invoices, many=True).data

        related_data.append({
            'purchase_orders': purchase_order_data,
            'invoices': invoice_data,
        })

    # Query equipment
    equipment = Equipment.objects.filter(
        equipment_serial_number__icontains=query)
    for equip in equipment:
        equipment_data = EquipmentSerializer(equip).data
        lab = equip.lab_number  # Assuming equipment has a foreign key to lab
        lab_data = LabSerializer(lab).data
        purchase_orders = PurchaseOrder.objects.filter(
            originator=lab.department_name)
        purchase_order_data = PurchaseOrderSerializer(
            purchase_orders, many=True).data
        invoices = Invoice.objects.filter(
            purchase_order_no__in=purchase_orders)
        invoice_data = InvoiceSerializer(invoices, many=True).data

        related_data.append({
            'labs': lab_data,
            'equipment': equipment_data,
            'purchase_orders': purchase_order_data,
            'invoices': invoice_data,
        })

    # Query invoices
    invoices = Invoice.objects.filter(invoice_number__icontains=query)
    for invoice in invoices:
        invoice_data = InvoiceSerializer(invoice).data
        purchase_order = invoice.purchase_order_no
        purchase_order_data = PurchaseOrderSerializer(purchase_order).data
        department = purchase_order.originator
        department_data = DepartmentSerializer(department).data

        related_data.append({
            'department': department_data,
            'purchase_orders': purchase_order_data,
            'invoices': invoice_data,
        })
    status = False
    if(related_data != []):
        status = True
    return Response({"data": related_data, "speech": transcribed_text , "status": status} )





