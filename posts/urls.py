from django.urls import path
from .views import (
    post_list_and_create,
    load_post_data_view,
    hello_world_view,
)

app_name = 'posts'

# the first argument is a blank '' because we want the list 
# of posts to be the main page of the site
#
# if we had something within the '', it would be required to
# have that text as part of the URL in order to access that page
urlpatterns = [
    path('', post_list_and_create, name='main-board'),
    path('data/', load_post_data_view, name='posts-data'),
    path('hello-world/', hello_world_view, name='hello-world'),
]