#FILE:           posts/models.py
#PROJECT:        posts_proj
#PROGRAMMER:     Quade Nielsen
#LAST EDIT:      April 7, 2023
#DESCRIPTION:    This file contains the models for the posts module of the posts_proj web application.

from django.db import models
from django.contrib.auth.models import User
from profiles.models import Profile

# Create your models here.

#   NAME:           Post
#   DESCRIPTION:    This model represents a user post in a standard social media web application.
class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    liked = models.ManyToManyField(User, blank=True)
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.title)
    


    
    @property
    def like_count(self):
        return self.liked.all().count()
    
    def get_photos(self):
        return self.photo_set.all()
    

    class Meta:
        ordering = ("-created",)

    

    
#   NAME:           Post
#   DESCRIPTION:    This model represents a photo in a standard social media web application.
class Photo(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="photos")
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.post.title}-{self.pk}"