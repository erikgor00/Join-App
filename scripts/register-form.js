let signupFieldErrors = {};

const SIGNUP_ERROR_ID_MAP = {
    'register-name': 'register-name-error',
    'register-email': 'register-email-error',
    'register-password': 'register-password-error',
    'register-password-confirm': 'register-password-confirm-error',
    'accept-privacy': 'accept-privacy-error',

    // Backwards-compatible aliases (falls irgendwo camelCase verwendet wird)
    registerName: 'register-name-error',
    registerEmail: 'register-email-error',
    registerPassword: 'register-password-error',
    registerPasswordConfirm: 'register-password-confirm-error',
    acceptPrivacy: 'accept-privacy-error'
};

/**
 * Executes handle signup submit logic.
 * @param {Event} event - Browser event.
 * @returns {void} Result.
 */
function handleSignupSubmit(event) {
    event.preventDefault();
    if (!validateSignupForm()) {
        return;
    }
    addUser();
}

/**
 * Validates signup form.
 * @returns {void} Result.
 */
function validateSignupForm() {
    const fields = getSignupFields();
    resetSignupErrors(fields);
    const state = { firstErrorShown: false };
    validateNameField(fields, state);
    validateEmailField(fields, state);
    validatePasswordField(fields, state);
    validateConfirmPasswordField(fields, state);
    validatePolicyField(fields, state);
    return !state.firstErrorShown;
}

/**
 * Returns signup fields.
 * @returns {*} Result.
 */
function getSignupFields() {
    return {
        nameInput: document.getElementById('register-name'),
        emailInput: document.getElementById('register-email'),
        passwordInput: document.getElementById('register-password'),
        confirmPasswordInput: document.getElementById('register-password-confirm'),
        policyCheckbox: document.getElementById('accept-privacy')
    };
}

/**
 * Executes reset signup errors logic.
 * @param {*} fields - Parameter.
 * @returns {void} Result.
 */
function resetSignupErrors(fields) {
    signupFieldErrors = {};
    [fields.nameInput, fields.emailInput, fields.passwordInput, fields.confirmPasswordInput].forEach(input => {
        input.classList.remove('input-error');
    });
    clearSignupErrorTexts();
    clearPolicyError();
}

/**
 * Clears signup error texts.
 * @returns {void} Result.
 */
function clearSignupErrorTexts() {
    setSignupErrorText('register-name-error', '');
    setSignupErrorText('register-email-error', '');
    setSignupErrorText('register-password-error', '');
    setSignupErrorText('register-password-confirm-error', '');
    setSignupErrorText('accept-privacy-error', '');
}

/**
 * Sets signup error text.
 * @param {string} id - Identifier.
 * @param {string} value - Value.
 * @returns {void} Result.
 */
function setSignupErrorText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

/**
 * Clears policy error.
 * @returns {void} Result.
 */
function clearPolicyError() {
    const policyContainer = document.querySelector('.accept-privacy-policy');
    if (policyContainer) {
        policyContainer.classList.remove('input-error');
    }
}

/**
 * Validates name field.
 * @param {*} fields - Parameter.
 * @param {*} state - Parameter.
 * @returns {void} Result.
 */
function validateNameField(fields, state) {
    const nameValue = fields.nameInput.value;
    const nameCheck = validateContactNameInput(nameValue);

    if (!nameCheck.isValid) {
        setSignupFieldError('register-name', nameCheck.error || 'Please enter your name.', fields.nameInput, state);
        return;
    }

    // Normalize (trim/collapse whitespace) to keep consistent formatting.
    fields.nameInput.value = nameCheck.normalizedName;
}

/**
 * Validates email field.
 * @param {*} fields - Parameter.
 * @param {*} state - Parameter.
 * @returns {void} Result.
 */
function validateEmailField(fields, state) {
    const emailValue = fields.emailInput.value;
    const emailCheck = validateEmailLikeSignup(emailValue);

    if (!emailCheck.isValid) {
        const message = getSignupEmailErrorMessage(emailCheck);
        setSignupFieldError('register-email', message, fields.emailInput, state);
        return;
    }

    // Normalize (lowercase) so the stored value is consistent across the app.
    fields.emailInput.value = emailCheck.normalizedEmail;
}

/**
 * Maps strict email validation results to the signup form's error messages.
 * @param {{ isValid: boolean, normalizedEmail: string, error: string, reason?: string }} emailCheck - Validation result.
 * @returns {string} Message.
 */
function getSignupEmailErrorMessage(emailCheck) {
    switch (emailCheck?.reason) {
        case 'required':
            return 'Please enter an email address.';
        case 'too_long':
            return 'Maximum 20 characters allowed.';
        case 'pattern':
            return 'Please enter a valid email address.';
        default:
            // Fallback (keeps behavior stable if reason is missing)
            return emailCheck?.error || 'Please enter a valid email address.';
    }
}

/**
 * Validates password field.
 * @param {*} fields - Parameter.
 * @param {*} state - Parameter.
 * @returns {void} Result.
 */
function validatePasswordField(fields, state) {
    const passwordValue = fields.passwordInput.value;
    if (!passwordValue) {
        setSignupFieldError('register-password', 'Please enter a password.', fields.passwordInput, state);
    }
}

/**
 * Validates confirm password field.
 * @param {*} fields - Parameter.
 * @param {*} state - Parameter.
 * @returns {void} Result.
 */
function validateConfirmPasswordField(fields, state) {
    const passwordValue = fields.passwordInput.value;
    const confirmValue = fields.confirmPasswordInput.value;
    if (!confirmValue) {
        setSignupFieldError('register-password-confirm', 'Please confirm your password.', fields.confirmPasswordInput, state);
        return;
    }
    if (passwordValue && passwordValue !== confirmValue) {
        setSignupFieldError('register-password-confirm', 'Passwords do not match.', fields.confirmPasswordInput, state);
    }
}

/**
 * Validates policy field.
 * @param {*} fields - Parameter.
 * @param {*} state - Parameter.
 * @returns {void} Result.
 */
function validatePolicyField(fields, state) {
    if (fields.policyCheckbox.checked) return;
    signupFieldErrors['accept-privacy'] = 'Please accept the privacy policy.';
    const policyContainer = document.querySelector('.accept-privacy-policy');
    if (policyContainer) {
        policyContainer.classList.add('input-error');
    }
    if (!state.firstErrorShown) {
        setSignupErrorText('accept-privacy-error', signupFieldErrors['accept-privacy']);
        state.firstErrorShown = true;
    }
}

/**
 * Sets signup field error.
 * @param {*} fieldId - Parameter.
 * @param {string} message - Message text.
 * @param {HTMLElement} input - Input element.
 * @param {*} state - Parameter.
 * @returns {void} Result.
 */
function setSignupFieldError(fieldId, message, input, state) {
    signupFieldErrors[fieldId] = message;
    input.classList.add('input-error');
    if (!state.firstErrorShown) {
        setSignupErrorText(getSignupErrorId(fieldId), message);
        input.focus();
        state.firstErrorShown = true;
    }
}

/**
 * Returns signup error id.
 * @param {*} fieldId - Parameter.
 * @returns {*} Result.
 */
function getSignupErrorId(fieldId) {
    return SIGNUP_ERROR_ID_MAP[fieldId];
}

/**
 * Shows field error message.
 * @param {*} fieldId - Parameter.
 * @returns {void} Result.
 */
function showFieldErrorMessage(fieldId) {
    clearAllSignupErrorMessages();
    const message = signupFieldErrors[fieldId];
    if (!message) return;
    const spanId = getSignupErrorId(fieldId);
    const span = document.getElementById(spanId);
    if (span) {
        span.textContent = message;
    }
}

/**
 * Clears all signup error messages.
 * @returns {void} Result.
 */
function clearAllSignupErrorMessages() {
    const ids = Object.values({
        registerName: 'register-name-error',
        registerEmail: 'register-email-error',
        registerPassword: 'register-password-error',
        registerPasswordConfirm: 'register-password-confirm-error',
        acceptPrivacy: 'accept-privacy-error'
    });
    ids.forEach(spanId => {
        const span = document.getElementById(spanId);
        if (span) {
            span.textContent = '';
        }
    });
}

/**
 * Executes attach signup error focus handlers logic.
 * @returns {void} Result.
 */
function attachSignupErrorFocusHandlers() {
    const pairs = [
        { fieldId: 'register-name', event: 'focus' },
        { fieldId: 'register-email', event: 'focus' },
        { fieldId: 'register-password', event: 'focus' },
        { fieldId: 'register-password-confirm', event: 'focus' },
        { fieldId: 'accept-privacy', event: 'focus' },
    ];

    pairs.forEach(({ fieldId, event }) => {
        const el = document.getElementById(fieldId);
        if (el) {
            el.addEventListener(event, () => showFieldErrorMessage(fieldId));
        }
    });
}

/**
 * Updates signup button state.
 * @returns {void} Result.
 */
function updateSignupButtonState() {
    const signupButton = document.querySelector('.btn-signup');
    const isComplete = isSignupFormComplete(getSignupButtonStateValues());
    if (signupButton) signupButton.disabled = !isComplete;
}

/**
 * Returns signup button state values.
 * @returns {Object} Result.
 */
function getSignupButtonStateValues() {
    return {
        nameRaw: document.getElementById('register-name')?.value ?? '',
        emailRaw: document.getElementById('register-email')?.value ?? '',
        passwordValue: document.getElementById('register-password')?.value,
        confirmValue: document.getElementById('register-password-confirm')?.value,
        policyChecked: document.getElementById('accept-privacy')?.checked
    };
}

/**
 * Returns whether signup form is complete.
 * @param {Object} values - Signup values.
 * @returns {boolean} Result.
 */
function isSignupFormComplete(values) {
    return Boolean(
        validateContactNameInput(values.nameRaw).isValid &&
        validateEmailLikeSignup(values.emailRaw).isValid &&
        values.passwordValue &&
        values.confirmValue &&
        values.passwordValue === values.confirmValue &&
        values.policyChecked &&
        Object.keys(signupFieldErrors || {}).length === 0
    );
}

/**
 * Executes attach signup form state handlers logic.
 * @returns {void} Result.
 */
function attachSignupFormStateHandlers() {
    const inputs = getSignupInputElements();
    const policyCheckbox = document.getElementById('accept-privacy');
    inputs.forEach(input => bindSignupInputHandlers(input));
    if (policyCheckbox) {
        policyCheckbox.addEventListener('change', () => {
            // Clear a previously shown error once the checkbox is valid again.
            if (policyCheckbox.checked) {
                applySignupPolicyBlurValidation('');
            }
            updateSignupButtonState();
        });
        policyCheckbox.addEventListener('change', () => validateSignupFieldOnBlur('accept-privacy'));
        policyCheckbox.addEventListener('blur', () => validateSignupFieldOnBlur('accept-privacy'));
    }
}

/**
 * Returns signup input elements.
 * @returns {*} Result.
 */
function getSignupInputElements() {
    return [
        document.getElementById('register-name'),
        document.getElementById('register-email'),
        document.getElementById('register-password'),
        document.getElementById('register-password-confirm')
    ].filter(Boolean);
}

/**
 * Executes bind signup input handlers logic.
 * @param {HTMLElement} input - Input element.
 * @returns {void} Result.
 */
function bindSignupInputHandlers(input) {
    input.addEventListener('input', () => {
        clearSignupFieldErrorIfResolved(input.id);
        updateSignupButtonState();
    });
    input.addEventListener('blur', () => {
        validateSignupFieldOnBlur(input.id);
        updateSignupButtonState();
    });
}

/**
 * Clears an already shown field error once the field becomes valid again.
 * Does not create new errors while typing.
 * @param {string} fieldId - Field identifier.
 * @returns {void} Result.
 */
function clearSignupFieldErrorIfResolved(fieldId) {
    const fields = getSignupFields();
    const handlers = getSignupFieldResolutionHandlers(fields);
    if (handlers[fieldId]) handlers[fieldId]();
}

/**
 * Returns signup field resolution handlers.
 * @param {Object} fields - Signup fields.
 * @returns {Object} Result.
 */
function getSignupFieldResolutionHandlers(fields) {
    return {
        'register-name': () => clearSignupNameErrorIfResolved(fields),
        'register-email': () => clearSignupEmailErrorIfResolved(fields),
        'register-password': () => clearSignupPasswordErrorIfResolved(fields),
        'register-password-confirm': () => clearSignupConfirmErrorIfResolved(fields)
    };
}

/**
 * Clears signup name error if resolved.
 * @param {Object} fields - Signup fields.
 * @returns {void} Result.
 */
function clearSignupNameErrorIfResolved(fields) {
    if (validateContactNameInput(fields.nameInput?.value ?? '').isValid) {
        applySignupInputBlurValidation('register-name', fields.nameInput, '');
    }
}

/**
 * Clears signup email error if resolved.
 * @param {Object} fields - Signup fields.
 * @returns {void} Result.
 */
function clearSignupEmailErrorIfResolved(fields) {
    if (validateEmailLikeSignup(fields.emailInput?.value ?? '').isValid) {
        applySignupInputBlurValidation('register-email', fields.emailInput, '');
    }
}

/**
 * Clears signup password error if resolved.
 * @param {Object} fields - Signup fields.
 * @returns {void} Result.
 */
function clearSignupPasswordErrorIfResolved(fields) {
    if (fields.passwordInput?.value) applySignupInputBlurValidation('register-password', fields.passwordInput, '');
}

/**
 * Clears signup confirm password error if resolved.
 * @param {Object} fields - Signup fields.
 * @returns {void} Result.
 */
function clearSignupConfirmErrorIfResolved(fields) {
    const passwordValue = fields.passwordInput?.value ?? '';
    const confirmValue = fields.confirmPasswordInput?.value ?? '';
    if (confirmValue && passwordValue && passwordValue === confirmValue) {
        applySignupInputBlurValidation('register-password-confirm', fields.confirmPasswordInput, '');
    }
}

/**
 * Validates a single signup field on blur.
 * @param {string} fieldId - Field identifier.
 * @returns {void} Result.
 */
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
function validateSignupPasswordOnBlur(fields) {
    const message = fields.passwordInput?.value ? '' : 'Please enter a password.';
    applySignupInputBlurValidation('register-password', fields.passwordInput, message);
}

/**
 * Validates signup confirm password on blur.
 * @param {Object} fields - Signup fields.
 * @returns {void} Result.
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
