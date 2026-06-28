function validateSignupFieldOnBlur(fieldId) {
    const fields = getSignupFields();
    const handlers = getSignupBlurValidationHandlers(fields);
    if (handlers[fieldId]) handlers[fieldId]();
}

/**
 * Returns signup blur validation handlers.
 * @param {Object} fields - Signup fields.
 * @returns {Object} Result.
 */
/**
 * Get Signup Blur Validation Handlers.
 * @param {HTMLElement} fields - fields.
 * @returns {boolean} Result value.
 */
function getSignupBlurValidationHandlers(fields) {
    return {
        'register-name': () => validateSignupNameOnBlur(fields),
        'register-email': () => validateSignupEmailOnBlur(fields),
        'register-password': () => validateSignupPasswordOnBlur(fields),
        'register-password-confirm': () => validateSignupConfirmOnBlur(fields),
        'accept-privacy': () => validateSignupPolicyOnBlur(fields)
    };
}

/**
 * Validates signup name on blur.
 * @param {Object} fields - Signup fields.
 * @returns {void} Result.
 */
/**
 * Validate Signup Name On Blur.
 * @param {HTMLElement} fields - fields.
 * @returns {boolean} Result value.
 */
function validateSignupNameOnBlur(fields) {
    const nameCheck = validateContactNameInput(fields.nameInput?.value ?? '');
    const message = nameCheck.isValid ? '' : (nameCheck.error || 'Please enter your name.');
    applySignupInputBlurValidation('register-name', fields.nameInput, message);
    if (nameCheck.isValid && fields.nameInput) fields.nameInput.value = nameCheck.normalizedName;
}

/**
 * Validates signup email on blur.
 * @param {Object} fields - Signup fields.
 * @returns {void} Result.
 */
/**
 * Validate Signup Email On Blur.
 * @param {HTMLElement} fields - fields.
 * @returns {boolean} Result value.
 */
function validateSignupEmailOnBlur(fields) {
    const emailCheck = validateEmailLikeSignup(fields.emailInput?.value ?? '');
    const message = emailCheck.isValid ? '' : getSignupEmailErrorMessage(emailCheck);
    applySignupInputBlurValidation('register-email', fields.emailInput, message);
    if (emailCheck.isValid && fields.emailInput) fields.emailInput.value = emailCheck.normalizedEmail;
}

/**
 * Validates signup password on blur.
 * @param {Object} fields - Signup fields.
 * @returns {void} Result.
 */
/**
 * Validate Signup Password On Blur.
 * @param {HTMLElement} fields - fields.
 * @returns {boolean} Result value.
 */
function validateSignupPasswordOnBlur(fields) {
    const message = fields.passwordInput?.value ? '' : 'Please enter a password.';
    applySignupInputBlurValidation('register-password', fields.passwordInput, message);
}

/**
 * Validates signup confirm password on blur.
 * @param {Object} fields - Signup fields.
 * @returns {void} Result.
 */
/**
 * Validate Signup Confirm On Blur.
 * @param {HTMLElement} fields - fields.
 * @returns {boolean} Result value.
 */
function validateSignupConfirmOnBlur(fields) {
    const message = getSignupConfirmPasswordBlurMessage(fields);
    applySignupInputBlurValidation('register-password-confirm', fields.confirmPasswordInput, message);
}

/**
 * Returns signup confirm password blur message.
 * @param {Object} fields - Signup fields.
 * @returns {string} Result.
 */
/**
 * Get Signup Confirm Password Blur Message.
 * @param {HTMLElement} fields - fields.
 * @returns {any} Result value.
 */
function getSignupConfirmPasswordBlurMessage(fields) {
    const confirmValue = fields.confirmPasswordInput?.value ?? '';
    const passwordValue = fields.passwordInput?.value ?? '';
    if (!confirmValue) return 'Please confirm your password.';
    if (passwordValue && passwordValue !== confirmValue) return 'Passwords do not match.';
    return '';
}

/**
 * Validates signup policy on blur.
 * @param {Object} fields - Signup fields.
 * @returns {void} Result.
 */
/**
 * Validate Signup Policy On Blur.
 * @param {HTMLElement} fields - fields.
 * @returns {boolean} Result value.
 */
function validateSignupPolicyOnBlur(fields) {
    const message = fields.policyCheckbox?.checked ? '' : 'Please accept the privacy policy.';
    applySignupPolicyBlurValidation(message);
}

/**
 * Applies blur validation state to signup input fields.
 * @param {string} fieldId - Field identifier.
 * @param {HTMLElement} input - Input element.
 * @param {string} message - Validation message.
 * @returns {void} Result.
 */
/**
 * Apply Signup Input Blur Validation.
 * @param {HTMLElement} fieldId - field id.
 * @param {HTMLElement} input - input.
 * @param {string} message - message.
 * @returns {boolean} Result value.
 */
function applySignupInputBlurValidation(fieldId, input, message) {
    const errorId = getSignupErrorId(fieldId);
    if (message) {
        signupFieldErrors[fieldId] = message;
        input?.classList.add('input-error');
        setSignupErrorText(errorId, message);
        return;
    }
    delete signupFieldErrors[fieldId];
    input?.classList.remove('input-error');
    setSignupErrorText(errorId, '');
}

/**
 * Applies blur validation state to the signup privacy field.
 * @param {string} message - Validation message.
 * @returns {void} Result.
 */
/**
 * Apply Signup Policy Blur Validation.
 * @param {string} message - message.
 * @returns {boolean} Result value.
 */
function applySignupPolicyBlurValidation(message) {
    const policyContainer = document.querySelector('.accept-privacy-policy');
    if (message) {
        signupFieldErrors['accept-privacy'] = message;
        policyContainer?.classList.add('input-error');
        setSignupErrorText('accept-privacy-error', message);
        return;
    }
    delete signupFieldErrors['accept-privacy'];
    policyContainer?.classList.remove('input-error');
    setSignupErrorText('accept-privacy-error', '');
}

document.addEventListener('DOMContentLoaded', () => {
    attachSignupErrorFocusHandlers();
    attachSignupFormStateHandlers();
    initSignupPasswordVisibilityToggles();
    updateSignupButtonState();
});
