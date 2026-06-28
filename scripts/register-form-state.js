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
/**
 * Attach Signup Error Focus Handlers.
 * @returns {void} Nothing.
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
/**
 * Update Signup Button State.
 * @returns {void} Nothing.
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
/**
 * Get Signup Button State Values.
 * @returns {any} Result value.
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
/**
 * Is Signup Form Complete.
 * @param {string} values - values.
 * @returns {boolean} Result value.
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
/**
 * Attach Signup Form State Handlers.
 * @returns {void} Nothing.
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
/**
 * Get Signup Input Elements.
 * @returns {any} Result value.
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
/**
 * Bind Signup Input Handlers.
 * @param {HTMLElement} input - input.
 * @returns {void} Nothing.
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
/**
 * Clear Signup Field Error If Resolved.
 * @param {HTMLElement} fieldId - field id.
 * @returns {void} Nothing.
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
/**
 * Get Signup Field Resolution Handlers.
 * @param {HTMLElement} fields - fields.
 * @returns {any} Result value.
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
/**
 * Clear Signup Name Error If Resolved.
 * @param {HTMLElement} fields - fields.
 * @returns {void} Nothing.
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
/**
 * Clear Signup Email Error If Resolved.
 * @param {HTMLElement} fields - fields.
 * @returns {void} Nothing.
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
/**
 * Clear Signup Password Error If Resolved.
 * @param {HTMLElement} fields - fields.
 * @returns {void} Nothing.
 */
function clearSignupPasswordErrorIfResolved(fields) {
    if (fields.passwordInput?.value) applySignupInputBlurValidation('register-password', fields.passwordInput, '');
}

/**
 * Clears signup confirm password error if resolved.
 * @param {Object} fields - Signup fields.
 * @returns {void} Result.
 */
/**
 * Clear Signup Confirm Error If Resolved.
 * @param {HTMLElement} fields - fields.
 * @returns {void} Nothing.
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
/**
 * Validate Signup Field On Blur.
 * @param {HTMLElement} fieldId - field id.
 * @returns {boolean} Result value.
 */