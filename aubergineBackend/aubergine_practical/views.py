from django.http.request import HttpRequest
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login, logout
import json
from django.contrib.auth.models import User
from django.db import connection
from .serializers import *
from django.core.mail import EmailMessage
import os,sys
from django.conf import settings


# Create your views here.

@csrf_exempt
@api_view(['GET', 'POST'])
def signUp(request):
    if request.method == 'POST':
        userJson = json.loads(request.body.decode("utf-8"))
        userSerializer = UserSerializer(data=userJson)
        if userSerializer.is_valid():
            email = userSerializer.data['email']
            password = userSerializer.data['password']
            try:
                new_user = User.objects.create_user(username=email, password=password)
                new_user.save() 
                userId = User.objects.filter(username = email).values('id')
                return Response(userId)
            except Exception as e:
                print(str(e))
                return Response("User already exist!")
        else:
             return Response("Invalid Serializer")

@csrf_exempt
@api_view(['GET', 'POST'])
def updateUserProfile(request):
    if request.method == 'POST':
        profileJson = json.loads(request.body.decode("utf-8"))
        profileSerializer = UserProfileSerializer(data=profileJson)
        if profileSerializer.is_valid():
            profileSerializer.save()
            return Response("User Added Successfully...")
        return Response("Invalid Serializer.")

@csrf_exempt
@api_view(['GET', 'POST'])
def exportImageViaEmail(request):
    if request.method == 'POST':
        imageJson = json.loads(request.body.decode("utf-8"))
        userEmail = str(imageJson['email'])
        try:
            email = EmailMessage(
            'Greetings From Eubergine Covid Data Project!',
            'This is the auto generated Email, Do not Reply!\nPlease find Covid data plot in the attachment.',
            settings.EMAIL_HOST_USER,
            [userEmail],
            )
            email.attach_file(settings.MEDIA_ROOT + imageJson['file_name'])
            email.send()
            return Response('SUCCESS')
        except Exception as e:
            return Response(str(e))

    