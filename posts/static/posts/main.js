//this file contains the main JS functions for the posts application

//when the posts page is loaded, the code is automatically run
console.log('hello world')

//we can interact with the DOM of the posts page
const helloWorldBox = document.getElementById('hello-world')
const postsBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')

$.ajax({
    type: 'GET',
    url: '/hello-world/',
    success: function(response){
        console.log('success', response.text)
        helloWorldBox.textContent = response.text
    },
    error: function(error){
        console.log('error', error)
    }
})

$.ajax({
    type: 'GET',
    url: '/data/',
    success: function(response){
        console.log(response)
        const data = response.data
        setTimeout(()=>{
            spinnerBox.classList.add('not-visible')
            console.log(data)
            data.forEach(el => {
                postsBox.innerHTML += `
                    ${el.title} - <b>${el.body}</b><br>
                `
            });
        }, 100)
    },
    error: function(error){
        console.log('error', error)
    }
})