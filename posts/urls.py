# this file contains the url patterns which determine what view is called when the server receives a request

from django.urls import path
# we need to import our views to this file so that we can tell the server what view to call when the server receives a request
from .views import (
    post_list_and_create,
    load_post_data_view,
    like_unlike_post,

    hello_world_view,
)

app_name = 'posts'

# this urlpatterns list defines the view that is called when the url is received

# the first argument is a blank '' because we want the list 
# of posts to be the main page of the site
#
# if we had something within the '', it would be required to
# have that text as part of the URL in order to access that page
urlpatterns = [
    # when url is at the main page, load the list of posts
    # this view is not actually called at the main page because we have a JS function which sends a request with a different url
    path('', post_list_and_create, name='main-board'),
    # this view is called then the like button sends a request with the like-unlike url
    path('like-unlike/', like_unlike_post, name='like-unlike'),
    # this view is called by the getData() function in main.js, which is called when the page is loaded, and when the load button is pressed
    path('data/<int:num_posts>/', load_post_data_view, name='posts-data'),

    path('hello-world/', hello_world_view, name='hello-world'),
]