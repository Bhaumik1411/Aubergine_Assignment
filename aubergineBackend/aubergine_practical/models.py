from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User)
    first_name = models.CharField(max_length=100,default='None')
    last_name = models.CharField(max_length=100,default='None')
    country = models.CharField(max_length=100,default='None')