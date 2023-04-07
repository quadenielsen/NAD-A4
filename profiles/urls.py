#FILE:           profiles/urls.py
#PROJECT:        posts_proj
#PROGRAMMER:     Quade Nielsen
#LAST EDIT:      April 7, 2023
#DESCRIPTION:    This file contains the urlpatterns for the profiles module of the posts_proj web application.

from django.urls import path
from .views import my_profile_view
app_name = 'profiles'

urlpatterns = [
    path('my/', my_profile_view, name='my-profile'),
]