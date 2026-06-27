// Entferne Intro-Overlay nach Animation
window.addEventListener('DOMContentLoaded', () => {
    initIntroAlignment();
    scheduleIntroOverlayRemoval();
    initLoginPasswordToggle();
    initLoginBlurValidation();
});

window.addEventListener('load', () => {
    alignIntroLogo();
});

window.addEventListener('resize', () => {
    alignIntroLogo();
});

/**
 * Initializes intro alignment.
 * @returns {void} Result.
 */
/**
 * Init Intro Alignment.
 * @returns {void} Nothing.
 */
function initIntroAlignment() {
    requestAnimationFrame(() => alignIntroLogo());
}

/**
 * Executes align intro logo logic.
 * @returns {void} Result.
 */
/**
 * Align Intro Logo.
 * @returns {void} Nothing.
 */
function alignIntroLogo() {
    const introLogo = document.getElementById('intro-logo');
    const headerLogo = document.querySelector('.header-left img');
    if (!introLogo || !headerLogo) return;
    const introOverlay = document.getElementById('intro-overlay');
    const introRect = introLogo.getBoundingClientRect();
    const headerRect = headerLogo.getBoundingClientRect();
    const dx = getCenterDeltaX(introRect, headerRect);
    const dy = getCenterDeltaY(introRect, headerRect);
    introLogo.style.setProperty('--logo-dx', `${dx}px`);
    introLogo.style.setProperty('--logo-dy', `${dy}px`);

    if (introOverlay) {
        introOverlay.style.setProperty('--logo-target-width', `${headerRect.width}px`);
        introOverlay.style.setProperty('--logo-target-height', `${headerRect.height}px`);
    }
}

/**
 * Returns center delta x.
 * @param {*} introRect - Parameter.
 * @param {*} headerRect - Parameter.
 * @returns {*} Result.
 */
/**
 * Get Center Delta X.
 * @param {any} introRect - intro rect.
 * @param {any} headerRect - header rect.
 * @returns {any} Result value.
 */
function getCenterDeltaX(introRect, headerRect) {
    const introCenterX = introRect.left + introRect.width / 2;
    const headerCenterX = headerRect.left + headerRect.width / 2;
    return headerCenterX - introCenterX;
}

/**
 * Returns center delta y.
 * @param {*} introRect - Parameter.
 * @param {*} headerRect - Parameter.
 * @returns {*} Result.
 */
/**
 * Get Center Delta Y.
 * @param {any} introRect - intro rect.
 * @param {any} headerRect - header rect.
 * @returns {any} Result value.
 */
function getCenterDeltaY(introRect, headerRect) {
    const introCenterY = introRect.top + introRect.height / 2;
    const headerCenterY = headerRect.top + headerRect.height / 2;
    return headerCenterY - introCenterY;
}

/**
 * Executes schedule intro overlay removal logic.
 * @returns {void} Result.
 */
/**
 * Schedule Intro Overlay Removal.
 * @returns {void} Nothing.
 */
function scheduleIntroOverlayRemoval() {
    setTimeout(() => removeIntroOverlay(), 2000);
}

/**
 * Executes remove intro overlay logic.
 * @returns {void} Result.
 */
/**
 * Remove Intro Overlay.
 * @returns {void} Nothing.
 */
function removeIntroOverlay() {
    const introOverlay = document.getElementById('intro-overlay');
    if (introOverlay) {
        introOverlay.remove();
    }
}

/**
 * Initializes login password toggle.
 * @returns {void} Result.
 */
/**
 * Init Login Password Toggle.
 * @returns {void} Nothing.
 */
function initLoginPasswordToggle() {
    const elements = getLoginPasswordElements();
    if (!elements) return;
    initLoginPasswordHandlers(elements);
    syncLoginPasswordIcons(elements);
}

/**
 * Initializes login blur validation handlers.
 * @returns {void} Result.
 */
/**
 * Init Login Blur Validation.
 * @returns {boolean} Result value.
 */
function initLoginBlurValidation() {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    if (!emailInput || !passwordInput) return;

    emailInput.addEventListener('blur', () => validateLoginFieldOnBlur('email'));
    passwordInput.addEventListener('blur', () => validateLoginFieldOnBlur('password'));
}

/**
 * Validates a single login field on blur.
 * @param {string} fieldName - Field name.
 * @returns {boolean} Result.
 */
/**
 * Validate Login Field On Blur.
 * @param {HTMLElement} fieldName - field name.
 * @returns {boolean} Result value.
 */
function validateLoginFieldOnBlur(fieldName) {
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  if (!emailInput || !passwordInput) return false;

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!validateLoginEmailBlurField(fieldName, emailInput, email)) return false;
  if (!validateLoginPasswordBlurField(fieldName, passwordInput, password)) return false;
  clearLoginErrorsWhenFormIsValid(emailInput, passwordInput, email, password);
  return true;
}

/**
 * Validates login email blur field.
 * @param {string} fieldName - Field name.
 * @param {HTMLElement} emailInput - Email input.
 * @param {string} email - Email value.
 * @returns {boolean} Result.
 */
/**
 * Validate Login Email Blur Field.
 * @param {HTMLElement} fieldName - field name.
 * @param {HTMLElement} emailInput - email input.
 * @param {string} email - email.
 * @returns {boolean} Result value.
 */
function validateLoginEmailBlurField(fieldName, emailInput, email) {
  if (fieldName !== 'email') return true;
  emailInput.classList.remove('input-error');
  if (!email) return showLoginBlurValidationError('Please fill in all fields.', emailInput);
  if (!isValidEmail(email)) return showLoginBlurValidationError('Please enter a valid email address.', emailInput);
  return true;
}

/**
 * Validates login password blur field.
 * @param {string} fieldName - Field name.
 * @param {HTMLElement} passwordInput - Password input.
 * @param {string} password - Password value.
 * @returns {boolean} Result.
 */
/**
 * Validate Login Password Blur Field.
 * @param {HTMLElement} fieldName - field name.
 * @param {HTMLElement} passwordInput - password input.
 * @param {any} password - password.
 * @returns {boolean} Result value.
 */
function validateLoginPasswordBlurField(fieldName, passwordInput, password) {
  if (fieldName !== 'password') return true;
  passwordInput.classList.remove('input-error');
  if (!password) return showLoginBlurValidationError('Please fill in all fields.', passwordInput);
  return true;
}

/**
 * Shows login blur validation error.
 * @param {string} message - Error message.
 * @param {HTMLElement} input - Input element.
 * @returns {boolean} Result.
 */
/**
 * Show Login Blur Validation Error.
 * @param {string} message - message.
 * @param {HTMLElement} input - input.
 * @returns {boolean} Result value.
 */
function showLoginBlurValidationError(message, input) {
  showLoginBlurError(message, input);
  return false;
}

/**
 * Clears login errors when form is valid.
 * @param {HTMLElement} emailInput - Email input.
 * @param {HTMLElement} passwordInput - Password input.
 * @param {string} email - Email value.
 * @param {string} password - Password value.
 * @returns {void} Result.
 */
/**
 * Clear Login Errors When Form Is Valid.
 * @param {HTMLElement} emailInput - email input.
 * @param {HTMLElement} passwordInput - password input.
 * @param {string} email - email.
 * @param {any} password - password.
 * @returns {boolean} Result value.
 */
function clearLoginErrorsWhenFormIsValid(emailInput, passwordInput, email, password) {
  if (!email || !password || !isValidEmail(email)) return;
  removeLoginError();
  emailInput.classList.remove('input-error');
  passwordInput.classList.remove('input-error');
}

/**
 * Shows login field error for blur validation.
 * @param {string} message - Message text.
 * @param {HTMLElement} input - Input element.
 * @returns {void} Result.
 */
/**
 * Show Login Blur Error.
 * @param {string} message - message.
 * @param {HTMLElement} input - input.
 * @returns {void} Nothing.
 */
function showLoginBlurError(message, input) {
    removeLoginError();
    appendLoginError(message);
    input?.classList.add('input-error');
}

/**
 * Returns login password elements.
 * @returns {*} Result.
 */
/**
 * Get Login Password Elements.
 * @returns {any} Result value.
 */
function getLoginPasswordElements() {
    const passwordInput = document.getElementById('login-password');
    const lockIcon = document.getElementById('lock-icon');
    const visibilityOffIcon = document.getElementById('visibility-off-icon');
    const visibilityIcon = document.getElementById('visibility-icon');
    if (!passwordInput || !lockIcon || !visibilityOffIcon || !visibilityIcon) return null;
    return { passwordInput, lockIcon, visibilityOffIcon, visibilityIcon };
}

/**
 * Initializes login password handlers.
 * @param {*} elements - Parameter.
 * @returns {void} Result.
 */
/**
 * Init Login Password Handlers.
 * @param {HTMLElement} elements - elements.
 * @returns {void} Nothing.
 */
function initLoginPasswordHandlers(elements) {
    elements.passwordInput.addEventListener('input', () => syncLoginPasswordIcons(elements));
    elements.visibilityOffIcon.addEventListener('click', () => showLoginPassword(elements));
    elements.visibilityIcon.addEventListener('click', () => hideLoginPassword(elements));
}

/**
 * Shows login password.
 * @param {*} elements - Parameter.
 * @returns {void} Result.
 */
/**
 * Show Login Password.
 * @param {HTMLElement} elements - elements.
 * @returns {void} Nothing.
 */
function showLoginPassword(elements) {
    if (elements.passwordInput.value.length === 0) return;
    setLoginPasswordVisibility(elements, true);
}

/**
 * Hides login password.
 * @param {*} elements - Parameter.
 * @returns {void} Result.
 */
/**
 * Hide Login Password.
 * @param {HTMLElement} elements - elements.
 * @returns {void} Nothing.
 */
function hideLoginPassword(elements) {
    if (elements.passwordInput.value.length === 0) return;
    setLoginPasswordVisibility(elements, false);
}

/**
 * Sets login password visibility.
 * @param {*} elements - Parameter.
 * @param {*} isVisible - Parameter.
 * @returns {void} Result.
 */
/**
 * Set Login Password Visibility.
 * @param {HTMLElement} elements - elements.
 * @param {boolean} isVisible - is visible.
 * @returns {void} Nothing.
 */
function setLoginPasswordVisibility(elements, isVisible) {
    elements.passwordInput.type = isVisible ? 'text' : 'password';
    elements.visibilityIcon.classList.toggle('is-hidden', !isVisible);
    elements.visibilityOffIcon.classList.toggle('is-hidden', isVisible);
}

/**
 * Executes sync login password icons logic.
 * @param {*} elements - Parameter.
 * @returns {void} Result.
 */
/**
 * Sync Login Password Icons.
 * @param {HTMLElement} elements - elements.
 * @returns {void} Nothing.
 */
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
