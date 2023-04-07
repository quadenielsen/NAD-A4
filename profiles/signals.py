#FILE:           profiles/signals.py
#PROJECT:        posts_proj
#PROGRAMMER:     Quade Nielsen
#LAST EDIT:      April 7, 2023
#DESCRIPTION:    This file contains the signals for the profiles module of the posts_proj web application.

from .models import Profile
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def post_save_create_profile(sender, instance, created, *args, **kwargs):
    print(sender)
    print(instance)
    print(created)
    if created:
        Profile.objects.create(user=instance)