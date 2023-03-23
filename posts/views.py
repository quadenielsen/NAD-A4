# this file contains the views for the posts application
# these views are intended to manage the web app's user interface

# we want APIs for rendering UI, the Post class for data management, and Json data management
from django.shortcuts import render
from .models import Post
from django.http import JsonResponse

# Create your views here.


# get the posts on the database and make the data available
# this function is called when the server gets a request from a client ??
def post_list_and_create(request):
    # get all the posts from the database
    qs = Post.objects.all()
    # send a response containing the main.html file for the posts app, and the dictionary containing all posts in the database
    return render(request, 'posts/main.html', {'qs':qs})



def load_post_data_view(request, num_posts):
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

# is_ajax function copied from SOF
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'

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

def hello_world_view(request):
    return JsonResponse({'text': 'hello world x2'})