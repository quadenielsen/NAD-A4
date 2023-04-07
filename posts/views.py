#FILE:           posts/views.py
#PROJECT:        posts_proj
#PROGRAMMER:     Quade Nielsen
#LAST EDIT:      April 7, 2023
#DESCRIPTION:    This file contains the views for the posts module of the posts_proj web application.  

# we want APIs for rendering UI, the Post class for data management, and Json data management
from django.shortcuts import render, redirect
from .models import Post, Photo
from django.http import JsonResponse, HttpResponse
from .forms import PostForm
from profiles.models import Profile
from .utils import action_permission
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



#   NAME:           post_list_and_create
#   
#   DESCRIPTION:    This view is called when a user requests to nagvigate to the main posts page.
#                   It fetches a list of posts from the server and sends them with the posts page.
#
#   PARAMETERS:     request:    the request being received by the server
#
#   RETURNS:        an HttpResponse containg the page and the relevant data
@login_required
def post_list_and_create(request):

    form = PostForm(request.POST or None)

    if is_ajax(request=request):
        if form.is_valid():
            author = Profile.objects.get(user=request.user)
            instance = form.save(commit=False)
            instance.author = author
            instance.save()
            return JsonResponse({
                'title': instance.title,
                'body': instance.body,
                'author': instance.author.user.username,
                'id': instance.id,
            })

    context = {
        'form': form,
    }
    # send a response containing the main.html file for the posts app, and the dictionary containing all posts in the database
    return render(request, 'posts/main.html', context)


#   NAME:           post_list_and_create
#   
#   DESCRIPTION:    This view is called when a user requests to nagvigate to the main posts page.
#                   It fetches a list of posts from the server and sends them with the posts page.
#
#   PARAMETERS:     request:    the request being received by the server
#
#   RETURNS:        an HttpResponse containg the page and the relevant data
@login_required
def post_detail(request, pk):
    obj = Post.objects.get(pk=pk)
    form = PostForm()

    context = {
        'obj': obj,
        'form': form,
    }
    return render(request, 'posts/detail.html', context)

@login_required
def load_post_data_view(request, num_posts):
    if is_ajax(request=request):
        visible = 3
        upper = num_posts
        lower = upper - visible
        size = Post.objects.all().count()

        qs = Post.objects.all()
        data = []
        for obj in qs:
            item = {
                'id': obj.id,
                'title': obj.title,
                'body': obj.body,
                'liked': True if request.user in obj.liked.all() else False,
                'count': obj.like_count,
                'author': obj.author.user.username
            }
            data.append(item)
        return JsonResponse({'data':data[lower:upper], 'size': size})
    return redirect('posts:main-board')


@login_required
def post_detail_data_view(request, pk):
    if is_ajax(request=request):
        obj = Post.objects.get(pk=pk)
        data = {
            'id': obj.id,
            'title': obj.title,
            'body': obj.body,
            'author': obj.author.user.username,
            'logged_in': request.user.username,

        }
        return JsonResponse({'data': data})
    return redirect('posts:main-board')


@login_required
def like_unlike_post(request):
    if is_ajax(request=request):
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)
        if request.user in obj.liked.all():
            liked = False
            obj.liked.remove(request.user)
        else:
            liked = True
            obj.liked.add(request.user)
        return JsonResponse({'liked': liked, 'count': obj.like_count})
    return redirect('posts:main-board')

@login_required
@action_permission
def update_post(request, pk):
    obj = Post.objects.get(pk=pk)
    if is_ajax(request=request):
        new_title = request.POST.get('title')
        new_body = request.POST.get('body')
        obj.title = new_title
        obj.body = new_body
        obj.save()
        return JsonResponse({
            'title': new_title,
            'body': new_body,
        })
    return redirect('posts:main-board')

@login_required
@action_permission
def delete_post(request, pk):
    obj = Post.objects.get(pk=pk)
    if is_ajax(request=request):
        obj.delete()
        return JsonResponse({})
    return redirect('posts:main-board')

@login_required
def image_upload_view(request):
    if request.method == 'POST':
        img = request.FILES.get('file')
        new_post_id = request.POST.get('new_post_id')
        post = Post.objects.get(id=new_post_id)
        Photo.objects.create(image=img, post=post)
    return HttpResponse()
