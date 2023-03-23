from django.shortcuts import render
from .models import Post
from django.http import JsonResponse

# Create your views here.

# get the posts on the database and make the data available
def post_list_and_create(request):
    qs = Post.objects.all()
    return render(request, 'posts/main.html', {'qs':qs})

# we tried to send the query set as a response, but it didn't 
# work
# we tried serializing the query set and sending that, but it 
# assigned the author key with a primary key value instead of
# the username
# we ended up using a for loop to create our own dictionary
def load_post_data_view(request):
    qs = Post.objects.all()
    data = []
    for obj in qs:
        item = {
            'id': obj.id,
            'title': obj.title,
            'body': obj.body,
            'author': obj.author.user.username
        }
        data.append(item)
    return JsonResponse({'data':data})

def hello_world_view(request):
    return JsonResponse({'text': 'hello world x2'})