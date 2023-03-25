from django.shortcuts import render
from .models import Profile
from .forms import ProfileForm
from django.http import JsonResponse

# Create your views here.

# is_ajax function copied from SOF
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


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