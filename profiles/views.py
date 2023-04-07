#FILE:           profiles/views.py
#PROJECT:        posts_proj
#PROGRAMMER:     Quade Nielsen
#LAST EDIT:      April 7, 2023
#DESCRIPTION:    This file contains the views for the profiles module of the posts_proj web application.

from django.shortcuts import render
from .models import Profile
from .forms import ProfileForm
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

# Create your views here.

#   NAME:           is_ajax
#   
#   DESCRIPTION:    Checks a request object to see if it is an ajax request.  Since request.is_ajax() is deprecated, this function is used instead.
#
#   PARAMETERS:     request:    the request to be checked
#
#   RETURNS:        true if the request is an ajax request
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'



#   NAME:           my_profile_view
#   
#   DESCRIPTION:    This view is called when a user requests to nagvigate to the profiles page.  It gets the profile data and sends it with the web page as a response.
#
#   PARAMETERS:     request:    the request being received by the server
#
#   RETURNS:        an HttpResponse containg the page and the relevant data
@login_required
def my_profile_view(request):
    obj = Profile.objects.get(user=request.user)
    form = ProfileForm(request.POST or None, request.FILES or None, instance=obj)
    if is_ajax(request=request):
        if form.is_valid():
            instance = form.save()
            return JsonResponse({
                'bio': instance.bio,
                'avatar': instance.avatar.url,
                'user': instance.user.username,
            })
    context = {
        'obj': obj,
        'form': form,
    }
    return render(request, 'profiles/main.html', context)