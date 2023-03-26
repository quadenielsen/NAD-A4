console.log('hello my profile')

const avatarBox = document.getElementById('avatar-box')
const alertBox = document.getElementById('alert-box')
const profileForm = document.getElementById('profile-form')
const csrf = document.getElementsByName('csrfmiddlewaretoken')

const bioInput = document.getElementById('id_bio')
const avatarInput = document.getElementById('id_avatar')


//csrf token code from https://docs.djangoproject.com/en/4.1/howto/csrf/
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');




profileForm.addEventListener('submit', e => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('csrfmiddlewaretoken', csrf[0].value)
    formData.append('bio', bioInput.value)
    formData.append('avatar', avatarInput.files[0])

    $.ajax({
        type: 'POST',
        url: '',
        enctype: 'multipart/form-data',
        data: formData,
        success: function(response){
            console.log(response)
            avatarBox.innerHTML = `
                <img src="${response.avatar}" class="rounded" height="200px" width="auto" alt="${response.user}">
            `
            bioInput.value = response.bio
            handleAlerts('success', 'your profile has been updated!')

        },
        error: function(error)
        {
            console.log(error)
        },
        processData: false,
        contentType: false,
        cache: false,
    })
})