/*
    FILE:           posts/main.js
    PROJECT:        posts_proj
    PROGRAMMER:     Quade Nielsen
    LAST EDIT:      April 7, 2023
    DESCRIPTION:    This file contains the JS for the main page of the posts module for the posts_proj web application.
*/


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

const dropzone = document.getElementById('my-dropzone')
const addBtn = document.getElementById('add-btn')
const closeBtns = [...document.getElementsByClassName('add-modal-close')]




/*
    NAME:           getCookie

    DESCRIPTION:    Generates a csrf token. Obtained from this code from https://docs.djangoproject.com/en/4.1/howto/csrf/

    PARAMETERS:     name:   the name of the cookie to be generated

    RETURNS:        the generated cookie
*/
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

//check to see if a post has been deleted
const deleted = localStorage.getItem('title')
if (deleted){
    handleAlerts('danger', `deleted "${deleted}"`)
    localStorage.clear()
}


/*
    NAME:           likeUnlikePosts

    DESCRIPTION:    Updates the like data of a post when a user clicks the like button.

    PARAMETERS:     none

    RETURNS:        none
*/
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

/*
    NAME:           getData

    DESCRIPTION:    Gets a list of posts from the server and displays it on the page.

    PARAMETERS:     none

    RETURNS:        none
*/
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
                                            <button class="btn btn-primary" id="like-unlike-${el.id}">${el.liked ? `Unlike (${el.count})`: `Like (${el.count})`}</button>
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

//listen for when the user presses the 'Load more posts' button
loadBtn.addEventListener('click', () =>{
    spinnerBox.classList.remove('not-visible')
    visible += 3
    getData()
})

//listen for when the user submits a new post
let newPostID = null
postForm.addEventListener('submit', e => {
    e.preventDefault()


    //send the post data to the server and update the page
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
            newPostID = response.id
            postsBox.insertAdjacentHTML('afterbegin', `
                    <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">${response.title}</h5>
                        <p class="card-text">${response.body}</p>
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-2">
                                <a href="${url}${response.id}" class="btn btn-primary">Details</a>
                            </div>
                            <div class="col-2">
                                <form class="like-unlike-forms" data-form-id="${response.id}">
                                    <button class="btn btn-primary" id="like-unlike-${response.id}">Like (0)</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            likeUnlikePosts()
            //$('#addPostModal').modal('hide')
            handleAlerts('success', 'New post added!')
            //postForm.reset()
        },
        error: function(error){
            console.log(error)
            $('#addPostModal').modal('hide')
            handleAlerts('danger', 'oops... something went wrong')
        },

        })
    })


//listen for when the user presses the 'add post' button on the new post window
//show the image dropzone
addBtn.addEventListener('click', () => {
    dropzone.classList.remove('not-visible')
})



closeBtns.forEach(btn => btn.addEventListener('click', () => {
    postForm.reset()
    if (!dropzone.classList.contains('not-visible')) {
        dropzone.classList.add('not-visible')
    }
    const myDropzone = Dropzone.forElement('#my-dropzone')
    myDropzone.removeAllFiles(true)
}))



Dropzone.autoDiscover = false
const myDropzone = new Dropzone('#my-dropzone', {
    url: 'upload/',
    init: function() {
        this.on('sending', function(file, xhr, formData){
            formData.append('csrfmiddlewaretoken', csrftoken)
            formData.append('new_post_id', newPostID)
        })
    },
    maxFiles: 5,
    maxFilesize: 4,
    acceptedFiles: '.png, .jpg, .jpeg'
})

getData()