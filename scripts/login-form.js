function syncLoginPasswordIcons(elements) {
    const hasValue = elements.passwordInput.value.length > 0;
    elements.lockIcon.classList.toggle('is-hidden', hasValue);
    if (!hasValue) {
        elements.visibilityOffIcon.classList.add('is-hidden');
        elements.visibilityIcon.classList.add('is-hidden');
        elements.passwordInput.type = 'password';
        return;
    }
    const isVisible = elements.passwordInput.type === 'text';
    setLoginPasswordVisibility(elements, isVisible);
}

/**
 * Executes login logic.
 * @returns {Promise<*>} Result.
 */
/**
 * Login.
 * @returns {Promise<void>} Result value.
 */
async function login() {
    try {
        clearLoginErrors();
        const credentials = getLoginCredentials();
        if (!validateLoginCredentials(credentials)) return;
        const signedUpUser = await findSignedUpUser(credentials.email, credentials.password);
        handleLoginResult(credentials, signedUpUser);
    } catch (error) {
        showLoginError("An error occurred. Please try again later.");
    }
}

/**
 * Validates login credentials.
 * @param {*} param - Parameter.
 * @param {*} password } - Parameter.
 * @returns {void} Result.
 */
/**
 * Validate Login Credentials.
 * @param {string} { email - { email.
 * @param {any} password } - password }.
 * @returns {boolean} Result value.
 */
function validateLoginCredentials({ email, password }) {
    if (!email || !password) {
        showLoginError("Please fill in all fields.");
        return false;
    }
    if (!isValidEmail(email)) {
        showLoginError("Please enter a valid email address.");
        return false;
    }
    return true;
}

/**
 * Executes handle login result logic.
 * @param {*} credentials - Parameter.
 * @param {*} signedUpUser - Parameter.
 * @returns {void} Result.
 */
/**
 * Handle Login Result.
 * @param {Object} credentials - credentials.
 * @param {Object} signedUpUser - signed up user.
 * @returns {void} Nothing.
 */
function handleLoginResult(credentials, signedUpUser) {
    if (signedUpUser) {
        storeUserSession(credentials.email, signedUpUser);
        window.location.href = "summary.html";
        return;
    }
    showLoginError("Check your email and password. Please try again.");
}

/**
 * Clears login errors.
 * @returns {void} Result.
 */
/**
 * Clear Login Errors.
 * @returns {void} Nothing.
 */
function clearLoginErrors() {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    emailInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');
}

/**
 * Returns login credentials.
 * @returns {*} Result.
 */
/**
 * Get Login Credentials.
 * @returns {any} Result value.
 */
function getLoginCredentials() {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    return {
        email: emailInput.value.trim(),
        password: passwordInput.value.trim()
    };
}

/**
 * Executes find signed up user logic.
 * @param {string} email - Email address.
 * @param {*} password - Parameter.
 * @returns {Promise<*>} Result.
 */
/**
 * Find Signed Up User.
 * @param {string} email - email.
 * @param {any} password - password.
 * @returns {Promise<void>} Result value.
 */
async function findSignedUpUser(email, password) {
    const response = await fetch(`${BASE_URL}/users.json`);
    if (!response.ok) throw new Error(`HTTP-Error! Status: ${response.status}`);
    const userAsJson = await response.json();
    return Object.values(userAsJson || {}).find(u => u.email === email && u.password === password);
}

/**
 * Executes store user session logic.
 * @param {string} email - Email address.
 * @param {*} signedUpUser - Parameter.
 * @returns {void} Result.
 */
/**
 * Store User Session.
 * @param {string} email - email.
 * @param {Object} signedUpUser - signed up user.
 * @returns {void} Nothing.
 */
function storeUserSession(email, signedUpUser) {
    localStorage.setItem("user", JSON.stringify({
        mode: "user",
        email: email,
        displayName: signedUpUser.name || ""
    }));
}

/**
 * Shows login error.
 * @param {string} message - Message text.
 * @returns {void} Result.
 */
/**
 * Show Login Error.
 * @param {string} message - message.
 * @returns {void} Nothing.
 */
function showLoginError(message) {
    removeLoginError();
    appendLoginError(message);
    markLoginInputsError();
}

/**
 * Executes remove login error logic.
 * @returns {void} Result.
 */
/**
 * Remove Login Error.
 * @returns {void} Nothing.
 */
function removeLoginError() {
    const oldError = document.querySelector('.login-error');
    if (oldError) oldError.remove();
}

/**
 * Executes append login error logic.
 * @param {string} message - Message text.
 * @returns {void} Result.
 */
/**
 * Append Login Error.
 * @param {string} message - message.
 * @returns {void} Nothing.
 */
function appendLoginError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error';
    errorDiv.textContent = message;
    const errorContainer = document.getElementById('error-container');
    errorContainer.appendChild(errorDiv);
}

/**
 * Executes mark login inputs error logic.
 * @returns {void} Result.
 */
/**
 * Mark Login Inputs Error.
 * @returns {void} Nothing.
 */
function markLoginInputsError() {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    emailInput.classList.add('input-error');
    passwordInput.classList.add('input-error');
}

/**
 * Checks whether valid email.
 * @param {string} email - Email address.
 * @returns {boolean} Result.
 */
/**
 * Is Valid Email.
 * @param {string} email - email.
 * @returns {boolean} Result value.
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Executes navigate to signup logic.
 * @returns {void} Result.
 */
/**
 * Navigate To Signup.
 * @returns {void} Nothing.
 */
function navigateToSignup() {
     window.location.href = "signup.html";
}

/**
 * Executes guest login logic.
 * @returns {void} Result.
 */
/**
 * Guest Login.
 * @returns {void} Nothing.
 */
function guestLogin() {
  // Guest-Session speichern (wichtig für Summary)
  localStorage.setItem("user", JSON.stringify({ mode: "guest" }));

  window.location.href = "summary.html";
}
