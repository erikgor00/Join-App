//const BASE_URL = "https://deine-api-url-hier"; // Passe deine API-URL an

async function login() {
    try {
        console.log("Login gestartet");

        const response = await fetch(`${BASE_URL}/users.json`);
        if (!response.ok) throw new Error(`HTTP-Error! Status: ${response.status}`);
        const userAsJson = await response.json();
        console.log("Daten geladen:", userAsJson);

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        console.log("E-Mail:", email, "Passwort:", password);

        const signedUpUser = Object.values(userAsJson || {}).find(
            u => u.email === email && u.password === password
        );
        console.log("Gefundener User:", signedUpUser);

        processLogin(signedUpUser);
    } catch (error) {
        console.error("Fehler im Login:", error);
        alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
    }
}

function processLogin(signedUpUser) {
    if (signedUpUser) {
        console.log("Login erfolgreich, weiterleiten...");
        window.location.href = "summary.html";
    } else {
        alert("E-Mail oder Passwort ist falsch!");
    }
}
