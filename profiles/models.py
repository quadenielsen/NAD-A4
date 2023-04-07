#FILE:           profiles/models.py
#PROJECT:        posts_proj
#PROGRAMMER:     Quade Nielsen
#LAST EDIT:      April 7, 2023
#DESCRIPTION:    This file contains the models for the profiles module of the posts_proj web application.

from django.db import models
from django.contrib.auth.models import User

# Create your models here.

#   NAME:           Profile
#   DESCRIPTION:    This model represents a user profile in a standard social media web application.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(default='avatar.png', upload_to='avatars')
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"profile of the user {self.user.username}"