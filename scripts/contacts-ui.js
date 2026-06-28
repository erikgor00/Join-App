/**
 * Checks whether non empty string.
 * @param {string} value - Value.
 * @returns {boolean} Result.
 */
/**
 * Is Non Empty String.
 * @param {string} value - value.
 * @returns {boolean} Result value.
 */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

let contactDialogFieldErrors = {};

const ADD_CONTACT_FIELD_IDS = ['ac-name', 'ac-email', 'ac-phone'];
const EDIT_CONTACT_FIELD_IDS = ['edit-name', 'edit-email', 'edit-phone'];

/**
 * Returns the error span id for a given input id.
 * @param {string} fieldId - Input id.
 * @returns {string} Span id.
 */
/**
 * Get Contact Error Span Id.
 * @param {HTMLElement} fieldId - field id.
 * @returns {any} Result value.
 */
function getContactErrorSpanId(fieldId) {
  return `${fieldId}-error`;
}

/**
 * Sets inline error text.
 * @param {string} spanId - Span id.
 * @param {string} value - Text.
 * @returns {void} Result.
 */
/**
 * Set Contact Error Text.
 * @param {string} spanId - span id.
 * @param {string} value - value.
 * @returns {void} Nothing.
 */
function setContactErrorText(spanId, value) {
  const el = document.getElementById(spanId);
  if (el) el.textContent = value;
}

/**
 * Applies inline validation state to a contact dialog field.
 * @param {string} fieldId - Input id.
 * @param {HTMLElement|null} input - Input element.
 * @param {string} message - Error message (empty to clear).
 * @returns {void} Result.
 */
/**
 * Apply Contact Inline Validation.
 * @param {HTMLElement} fieldId - field id.
 * @param {HTMLElement} input - input.
 * @param {string} message - message.
 * @returns {boolean} Result value.
 */
function applyContactInlineValidation(fieldId, input, message) {
  const spanId = getContactErrorSpanId(fieldId);
  const fieldContainer = input?.closest('.ac-field');

  if (message) {
    contactDialogFieldErrors[fieldId] = message;
    input?.classList.add('input-error');
    fieldContainer?.classList.add('input-error');
    setContactErrorText(spanId, message);
    return;
  }

  delete contactDialogFieldErrors[fieldId];
  input?.classList.remove('input-error');
  fieldContainer?.classList.remove('input-error');
  setContactErrorText(spanId, '');
}

/**
 * Clears all inline error messages for the given field ids.
 * @param {string[]} fieldIds - Field ids.
 * @returns {void} Result.
 */
/**
 * Clear All Contact Inline Errors.
 * @param {HTMLElement} fieldIds - field ids.
 * @returns {void} Nothing.
 */
function clearAllContactInlineErrors(fieldIds) {
  (fieldIds || []).forEach((id) => {
    const input = document.getElementById(id);
    applyContactInlineValidation(id, input, '');
  });
}

/**
 * Shows only the focused field's error message (signup behavior).
 * @param {string} fieldId - Field id.
 * @param {string[]} fieldIds - All field ids of the dialog.
 * @returns {void} Result.
 */
/**
 * Show Contact Field Error Message.
 * @param {HTMLElement} fieldId - field id.
 * @param {HTMLElement} fieldIds - field ids.
 * @returns {void} Nothing.
 */
function showContactFieldErrorMessage(fieldId, fieldIds) {
  (fieldIds || []).forEach((id) => setContactErrorText(getContactErrorSpanId(id), ''));
  const message = contactDialogFieldErrors[fieldId];
  if (message) {
    setContactErrorText(getContactErrorSpanId(fieldId), message);
  }
}

/**
 * Validates a contact dialog field.
 * @param {string} fieldId - Field id.
 * @param {string} value - Raw value.
 * @returns {{ isValid: boolean, normalizedValue?: string, error: string }} Result.
 */
/**
 * Validate Contact Dialog Field.
 * @param {HTMLElement} fieldId - field id.
 * @param {string} value - value.
 * @returns {boolean} Result value.
 */
function validateContactDialogField(fieldId, value) {
  if (fieldId === 'ac-name' || fieldId === 'edit-name') {
    const check = validateContactNameInput(value);
    return { isValid: check.isValid, normalizedValue: check.normalizedName, error: check.error };
  }
  if (fieldId === 'ac-email' || fieldId === 'edit-email') {
    const check = validateEmailLikeSignup(value);
    return { isValid: check.isValid, normalizedValue: check.normalizedEmail, error: check.error };
  }
  if (fieldId === 'ac-phone' || fieldId === 'edit-phone') {
    const check = validateContactPhoneNumber(value);
    return { isValid: check.isValid, normalizedValue: check.normalizedPhone, error: check.error };
  }
  return { isValid: true, normalizedValue: value, error: '' };
}

/**
 * Validates a field on blur and updates the inline message.
 * @param {string} fieldId - Field id.
 * @returns {void} Result.
 */
/**
 * Validate Contact Dialog Field On Blur.
 * @param {HTMLElement} fieldId - field id.
 * @returns {boolean} Result value.
 */
function validateContactDialogFieldOnBlur(fieldId) {
  const input = document.getElementById(fieldId);
  if (!input) return;
  const check = validateContactDialogField(fieldId, input.value ?? '');
  applyContactInlineValidation(fieldId, input, check.isValid ? '' : (check.error || 'Invalid input.'));
  if (check.isValid && typeof check.normalizedValue === 'string') {
    input.value = check.normalizedValue;
  }
}

/**
 * Clears an existing error once the field becomes valid again.
 * @param {string} fieldId - Field id.
 * @returns {void} Result.
 */
/**
 * Clear Contact Dialog Field Error If Resolved.
 * @param {HTMLElement} fieldId - field id.
 * @returns {void} Nothing.
 */
function clearContactDialogFieldErrorIfResolved(fieldId) {
  if (!contactDialogFieldErrors[fieldId]) return;
  const input = document.getElementById(fieldId);
  if (!input) return;
  const check = validateContactDialogField(fieldId, input.value ?? '');
  if (check.isValid) {
    applyContactInlineValidation(fieldId, input, '');
  }
}

/**
 * Shows the first submit error like signup: highlight + message + focus.
 * @param {string} fieldId - Field id.
 * @param {string} message - Message.
 * @param {string[]} allFieldIds - Dialog field ids.
 * @returns {void} Result.
 */
/**
 * Show Contact Submit Error.
 * @param {HTMLElement} fieldId - field id.
 * @param {string} message - message.
 * @param {HTMLElement} allFieldIds - all field ids.
 * @returns {void} Nothing.
 */
function showContactSubmitError(fieldId, message, allFieldIds) {
  clearAllContactInlineErrors(allFieldIds);
  const input = document.getElementById(fieldId);
  applyContactInlineValidation(fieldId, input, message || 'Invalid input.');
  input?.focus();
}

/**
 * Updates add contact submit state.
 * @param {HTMLElement} dialog - Dialog element.
 * @returns {void} Result.
 */
/**
 * Update Add Contact Submit State.
 * @param {HTMLElement} dialog - dialog.
 * @returns {void} Nothing.
 */
function updateAddContactSubmitState(dialog) {
  updateContactSubmitState(dialog, {
    nameId: 'ac-name',
    emailId: 'ac-email',
    phoneId: 'ac-phone',
    submitSelector: '[data-ac-submit]'
  });
}

/**
 * Initializes add contact dialog validation.
 * @param {HTMLElement} dialog - Dialog element.
 * @returns {void} Result.
 */
/**
 * Init Add Contact Dialog Validation.
 * @param {HTMLElement} dialog - dialog.
 * @returns {boolean} Result value.
 */
function initAddContactDialogValidation(dialog) {
  initContactDialogValidation(dialog, {
    fieldIds: ADD_CONTACT_FIELD_IDS,
    initKey: 'acValidationInit',
    formSelector: '#add-contact-form',
    updateSubmitState: updateAddContactSubmitState
  });
}

/**
 * Updates contact submit state.
 * @param {HTMLElement} dialog - Dialog element.
 * @param {Object} config - Submit state config.
 * @returns {void} Result.
 */
/**
 * Update Contact Submit State.
 * @param {HTMLElement} dialog - dialog.
 * @param {Object} config - config.
 * @returns {void} Nothing.
 */
function updateContactSubmitState(dialog, config) {
  if (!dialog) return;
  const inputs = getContactSubmitInputs(dialog, config);
  if (!inputs.submitBtn) return;
  const checks = validateContactSubmitInputs(inputs);
  applyContactSubmitCustomValidity(inputs, checks);
  updateContactSubmitButton(inputs.submitBtn, areContactSubmitChecksValid(checks));
}

/**
 * Returns contact submit inputs.
 * @param {HTMLElement} dialog - Dialog element.
 * @param {Object} config - Submit state config.
 * @returns {Object} Result.
 */
/**
 * Get Contact Submit Inputs.
 * @param {HTMLElement} dialog - dialog.
 * @param {Object} config - config.
 * @returns {any} Result value.
 */
function getContactSubmitInputs(dialog, config) {
  return {
    nameInput: dialog.querySelector(`#${config.nameId}`),
    emailInput: dialog.querySelector(`#${config.emailId}`),
    phoneInput: dialog.querySelector(`#${config.phoneId}`),
    submitBtn: dialog.querySelector(config.submitSelector)
  };
}

/**
 * Validates contact submit inputs.
 * @param {Object} inputs - Contact input elements.
 * @returns {Object} Result.
 */
/**
 * Validate Contact Submit Inputs.
 * @param {HTMLElement} inputs - inputs.
 * @returns {boolean} Result value.
 */
function validateContactSubmitInputs(inputs) {
  return {
    nameCheck: validateContactNameInput(inputs.nameInput?.value ?? ""),
    emailCheck: validateEmailLikeSignup(inputs.emailInput?.value ?? ""),
    phoneCheck: validateContactPhoneNumber(inputs.phoneInput?.value ?? "")
  };
}

/**
 * Applies custom validity to contact submit inputs.
 * @param {Object} inputs - Contact input elements.
 * @param {Object} checks - Validation checks.
 * @returns {void} Result.
 */
/**
 * Apply Contact Submit Custom Validity.
 * @param {HTMLElement} inputs - inputs.
 * @param {any} checks - checks.
 * @returns {boolean} Result value.
 */
function applyContactSubmitCustomValidity(inputs, checks) {
  applyContactInputCustomValidity(inputs.nameInput, checks.nameCheck);
  applyContactInputCustomValidity(inputs.emailInput, checks.emailCheck);
  applyContactInputCustomValidity(inputs.phoneInput, checks.phoneCheck);
}

/**
 * Applies custom validity to one contact input.
 * @param {HTMLElement} input - Contact input.
 * @param {Object} check - Validation check.
 * @returns {void} Result.
 */
/**
 * Apply Contact Input Custom Validity.
 * @param {HTMLElement} input - input.
 * @param {any} check - check.
 * @returns {boolean} Result value.
 */
function applyContactInputCustomValidity(input, check) {
  if (input && typeof input.setCustomValidity === "function") {
    input.setCustomValidity(check.isValid ? "" : check.error);
  }
}

/**
 * Returns whether all contact submit checks are valid.
 * @param {Object} checks - Validation checks.
 * @returns {boolean} Result.
 */
/**
 * Are Contact Submit Checks Valid.
 * @param {any} checks - checks.
 * @returns {boolean} Result value.
 */
function areContactSubmitChecksValid(checks) {
  return checks.nameCheck.isValid && checks.emailCheck.isValid && checks.phoneCheck.isValid;
}

/**
 * Updates contact submit button.
 * @param {HTMLElement} submitBtn - Submit button.
 * @param {boolean} isValid - Valid state.
 * @returns {void} Result.
 */
/**
 * Update Contact Submit Button.
 * @param {any} submitBtn - submit btn.
 * @param {string} isValid - is valid.
 * @returns {void} Nothing.
 */
function updateContactSubmitButton(submitBtn, isValid) {
  submitBtn.disabled = !isValid;
  submitBtn.setAttribute('aria-disabled', String(!isValid));
}

/**
 * Initializes contact dialog validation.
 * @param {HTMLElement} dialog - Dialog element.
 * @param {Object} config - Validation config.
 * @returns {void} Result.
 */
/**
 * Init Contact Dialog Validation.
 * @param {HTMLElement} dialog - dialog.
 * @param {Object} config - config.
 * @returns {boolean} Result value.
 */