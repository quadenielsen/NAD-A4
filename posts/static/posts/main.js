//this file contains the main JS functions for the posts application

//when the posts page is loaded, the code is automatically run
console.log('hello world')

//we can interact with the DOM of the posts page

//DOM element variables
const postsBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')
const loadBtn = document.getElementById('load-btn')
const endBox = document.getElementById('end-box')

const postForm = document.getElementById('post-form')
const title = document.getElementById('id_title')
const body = document.getElementById('id_body')
const csrf = document.getElementsByName('csrfmiddlewaretoken')


const url = window.location.href

const alertBox = document.getElementById('alert-box')
console.log('csrf', csrf[0].value)




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


const deleted = localStorage.getItem('title')
if (deleted){
    handleAlerts('danger', `deleted "${deleted}"`)
    localStorage.clear()
}



//function called when a like button is pressed
const likeUnlikePosts = () => {
    //get an array of like-unlike forms to store each form for each like-unlike button
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')]
    //loop through the list of like-unlike forms
    //listen for when a form is submitted
    likeUnlikeForms.forEach(form => form.addEventListener('submit', e => {
        //if a form is submitted, get the id for the form and the button that was clicked
        e.preventDefault()
        const clickedId = e.target.getAttribute('data-form-id') //id of the form that was submitted
        const clickedBtn = document.getElementById(`like-unlike-${clickedId}`) //id of the button that was clicked
        
        //send an ajax request to tell the server what happened
        $.ajax({
            type: 'POST',
            //this url tells the server what view to call
            url: "/like-unlike/",
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickedId,
            },
            //on success, change the content of the button
            success: function(response){
                console.log(response)
                clickedBtn.textContent = response.liked ? `Unlike (${response.count})`: `Like (${response.count})`
            },
            error: function(error){
                console.log(error)
            }
        })

    }))
}

//variable to set the default number of posts shown per load
let visible = 3

//this function loads a list of posts
const getData = () => {
    //send an ajax request telling the server that the client wants to get a list of posts
    $.ajax({
        type: 'GET',
        //this url tells the server what view to call; we want to send an int value to tell the server how many posts we wants to load
        url: `/data/${visible}/`,
        //on success, inject some html to load the posts
        success: function(response){
            console.log(response)
            const data = response.data
            setTimeout(()=>{
                spinnerBox.classList.add('not-visible')
                console.log(data)
                data.forEach(el => {
                    postsBox.innerHTML += `
                        <div class="card mb-2">
                            <div class="card-body">
                                <h5 class="card-title">${el.title}</h5>
                                <p class="card-text">${el.body}</p>
                            </div>
                            <div class="card-footer">
                                <div class="row">
                                    <div class="col-2">
                                        <a href="${url}${el.id}" class="btn btn-primary">Details</a>
                                    </div>
                                    <div class="col-2">
                                        <form class="like-unlike-forms" data-form-id="${el.id}">
                                            <button href="#" class="btn btn-primary" id="like-unlike-${el.id}">${el.liked ? `Unlike (${el.count})`: `Like (${el.count})`}</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                });
                //handle the forms for the like-unlike buttons
                likeUnlikePosts()
            }, 100)
            console.log(response.size)
            if (response.size === 0) {
                endBox.textContent = 'No posts added yet...'
            }
            else if (response.size <= visible) {
                loadBtn.classList.add('not-visible')
                endBox.textContent = 'No more posts to load...'
            }
        },
        error: function(error){
            console.log('error', error)
        }
    })
}

loadBtn.addEventListener('click', () =>{
    spinnerBox.classList.remove('not-visible')
    visible += 3
    getData()
})


postForm.addEventListener('submit', e => {
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: '',
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': title.value,
            'body': body.value,
        },
        success: function(response){
            console.log(response)
            postsBox.insertAdjacentHTML('afterbegin', `
                    <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">${response.title}</h5>
                        <p class="card-text">${response.body}</p>
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-2">
                                <a href="#" class="btn btn-primary">Details</a>
                            </div>
                            <div class="col-2">
                                <form class="like-unlike-forms" data-form-id="${response.id}">
                                    <button href="#" class="btn btn-primary" id="like-unlike-${response.id}">Like (0)</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            likeUnlikePosts()
            $('#addPostModal').modal('hide')
            handleAlerts('sucess', 'New post added!')
            postForm.reset()
        },
        error: function(error){
            console.log(error)
            $('#addPostModal').modal('hide')
            handleAlerts('danger', 'oops... something went wrong')
        },

        })
    })


getData()