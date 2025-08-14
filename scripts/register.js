function addUser() {
    let email = document.getElementById('registerEmail');
    let password = document.getElementById('registerPassword');
    let confirmPassword = document.getElementById('registerPasswordConfirm');
    if (password.value === confirmPassword.value) {
         users.push({email: email.value, password: password.value});
        // Weiterleitung zur Login Seite zum Beispiel + Nachricht anzeigen, dass registrierung erfolgreich war
        window.location.href = 'login.html?msg=Du hast dich erfolgrteich registriert!'
    } else {
        alert("Die eingegebnen Passwörter stimmen nicht überein!")
    }
}

