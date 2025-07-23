function addUser() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    users.push({email: email.value, password: password.value});
    // Weiterleitung zur Login Seite zum Beispiel + Nachricht anzeigen, dass registrierung erfolgreich war
    window.location.href = 'login.html?msg=Du hast dich erfolgrteich registriert!'
}