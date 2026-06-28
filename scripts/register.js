/**
 * Adds user.
 * @returns {Promise<*>} Result.
 */
/**
 * Add User.
 * @returns {Promise<void>} Result value.
 */
async function addUser() {
    const values = getSignupValues();
    if (!isPasswordMatch(values)) { showPasswordMismatch(values.confirmPassword); return; }
    const newUser = buildNewUser(values); users.push(newUser);
    try {
        await saveNewUser(newUser);
        await saveNewContact(newUser);
        window.location.href = 'index.html?msg=Du hast dich erfolgreich registriert!';
    } catch (err) {
        console.error("Fehler beim Posten:", err);
        showRegistrationFailed();
    }
}

/**
 * Returns signup values.
 * @returns {*} Result.
 */
/**
 * Get Signup Values.
 * @returns {any} Result value.
 */
function getSignupValues() {
    return {
        name: document.getElementById('register-name'),
        email: document.getElementById('register-email'),
        password: document.getElementById('register-password'),
        confirmPassword: document.getElementById('register-password-confirm')
    };
}

/**
 * Checks whether password match.
 * @param {*} values - Parameter.
 * @returns {boolean} Result.
 */
/**
 * Is Password Match.
 * @param {string} values - values.
 * @returns {boolean} Result value.
 */
function isPasswordMatch(values) {
    return values.password.value === values.confirmPassword.value;
}

/**
 * Shows password mismatch.
 * @param {*} confirmPassword - Parameter.
 * @returns {void} Result.
 */
/**
 * Show Password Mismatch.
 * @param {any} confirmPassword - confirm password.
 * @returns {void} Nothing.
 */
function showPasswordMismatch(confirmPassword) {
    if (typeof showMessage === 'function') {
        showMessage('Passwords do not match.', 'error');
    } else {
        alert('Passwords do not match.');
    }
    confirmPassword.focus();
}

/**
 * Builds new user.
 * @param {*} values - Parameter.
 * @returns {*} Result.
 */
/**
 * Build New User.
 * @param {string} values - values.
 * @returns {any} Result value.
 */
function buildNewUser(values) {
    return {
        name: values.name.value.trim(),
        email: values.email.value.trim(),
        password: values.password.value
    };
}

/**
 * Saves new user.
 * @param {*} newUser - Parameter.
 * @returns {Promise<*>} Result.
 */
/**
 * Save New User.
 * @param {Object} newUser - new user.
 * @returns {Promise<void>} Result value.
 */
async function saveNewUser(newUser) {
    await postData("users", newUser);
}

/**
 * Saves new contact.
 * @param {*} newUser - Parameter.
 * @returns {Promise<*>} Result.
 */
/**
 * Save New Contact.
 * @param {Object} newUser - new user.
 * @returns {Promise<void>} Result value.
 */
async function saveNewContact(newUser) {
    const newContact = {
        name: newUser.name,
        email: newUser.email,
        phone: ''
    };
    await postData("contacts", newContact);
}

/**
 * Shows registration failed.
 * @returns {void} Result.
 */
/**
 * Show Registration Failed.
 * @returns {void} Nothing.
 */
function showRegistrationFailed() {
    if (typeof showMessage === 'function') {
        showMessage('Registration failed. Please try again.', 'error');
    } else {
        alert('Registration failed. Please try again.');
    }
}

/**
 * Executes post data logic.
 * @param {string} path - API path.
 * @param {Object} user - User payload.
 * @returns {Promise<*>} Result.
 */
/**
 * Post Data.
 * @param {string} path - path.
 * @param {Object} user - user.
 * @returns {Promise<void>} Result value.
 */
async function postData(path = "", user = {}) {
    let response = await fetch(`${BASE_URL}/${path}.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if (!response.ok) {
        throw new Error(`HTTP-Error! Status: ${response.status}`);
    }

    return await response.json();
}

/**
 * Executes navigate to login logic.
 * @returns {void} Result.
 */
/**
 * Navigate To Login.
 * @returns {void} Nothing.
 */
function navigateToLogin() {
     window.location.href = "index.html";
}
