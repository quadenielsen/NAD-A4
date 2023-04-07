#FILE:           posts/admin.py
#PROJECT:        posts_proj
#PROGRAMMER:     Quade Nielsen
#LAST EDIT:      April 7, 2023
#DESCRIPTION:    This file contains the admin registrations of the models for the posts module of the posts_proj web application.

from django.contrib import admin
from .models import Post, Photo

# Register your models here.

admin.site.register(Post)
admin.site.register(Photo)