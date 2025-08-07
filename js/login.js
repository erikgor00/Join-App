/**
 * This function is used to get logged in in the Application
 * 
 */
function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find( u => u.email == email.value && u.password == password.value);
    console.log(user);
    if(user){
        console.log('User gefunden!')
    }
}

const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');

if(msg){
    msgBox.innerHTML = msg;
} else{
    //display: none;
}