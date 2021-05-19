from django.conf.urls import url
from .views import *


urlpatterns = [
    url(r'^signUp/', signUp),
    url(r'^updateUserProfile/', updateUserProfile),
    url(r'^exportImageViaEmail/', exportImageViaEmail),
]
