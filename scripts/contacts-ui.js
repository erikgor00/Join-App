/**
 * Checks whether non empty string.
 * @param {string} value - Value.
 * @returns {boolean} Result.
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
function getContactErrorSpanId(fieldId) {
  return `${fieldId}-error`;
}

/**
 * Sets inline error text.
 * @param {string} spanId - Span id.
 * @param {string} value - Text.
 * @returns {void} Result.
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
function areContactSubmitChecksValid(checks) {
  return checks.nameCheck.isValid && checks.emailCheck.isValid && checks.phoneCheck.isValid;
}

/**
 * Updates contact submit button.
 * @param {HTMLElement} submitBtn - Submit button.
 * @param {boolean} isValid - Valid state.
 * @returns {void} Result.
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
function initContactDialogValidation(dialog, config) {
  if (!dialog || dialog.dataset[config.initKey] === '1') return;
  const fields = getContactValidationFields(dialog, config.fieldIds);
  const handler = () => config.updateSubmitState(dialog);
  bindContactValidationFields(fields, config.fieldIds, handler);
  bindContactValidationReset(dialog, handler, config.formSelector, config.fieldIds);
  dialog.dataset[config.initKey] = '1';
  handler();
}

/**
 * Returns contact validation fields.
 * @param {HTMLElement} dialog - Dialog element.
 * @param {string[]} fieldIds - Field ids.
 * @returns {Array<HTMLElement>} Result.
 */
function getContactValidationFields(dialog, fieldIds) {
  return fieldIds.map((id) => dialog.querySelector(`#${id}`)).filter(Boolean);
}

/**
 * Binds contact validation fields.
 * @param {Array<HTMLElement>} fields - Validation fields.
 * @param {string[]} fieldIds - Field ids.
 * @param {Function} handler - Submit state handler.
 * @returns {void} Result.
 */
function bindContactValidationFields(fields, fieldIds, handler) {
  fields.forEach((field) => bindContactValidationField(field, fieldIds, handler));
}

/**
 * Binds one contact validation field.
 * @param {HTMLElement} field - Validation field.
 * @param {string[]} fieldIds - Field ids.
 * @param {Function} handler - Submit state handler.
 * @returns {void} Result.
 */
function bindContactValidationField(field, fieldIds, handler) {
  field.addEventListener('focus', () => showContactFieldErrorMessage(field.id, fieldIds));
  field.addEventListener('input', () => handleContactValidationFieldInput(field, handler));
  field.addEventListener('change', () => handleContactValidationFieldInput(field, handler));
  field.addEventListener('blur', () => handleContactValidationFieldBlur(field, handler));
}

/**
 * Handles contact validation field input.
 * @param {HTMLElement} field - Validation field.
 * @param {Function} handler - Submit state handler.
 * @returns {void} Result.
 */
function handleContactValidationFieldInput(field, handler) {
  clearContactDialogFieldErrorIfResolved(field.id);
  handler();
}

/**
 * Handles contact validation field blur.
 * @param {HTMLElement} field - Validation field.
 * @param {Function} handler - Submit state handler.
 * @returns {void} Result.
 */
function handleContactValidationFieldBlur(field, handler) {
  validateContactDialogFieldOnBlur(field.id);
  handler();
}

/**
 * Executes bind contact validation fields logic.
 * @param {*} fields - Parameter.
 * @param {*} handler - Parameter.
 * @returns {void} Result.
 */
/**
 * Executes bind contact validation reset logic.
 * @param {HTMLElement} dialog - Dialog element.
 * @param {*} handler - Parameter.
 * @param {*} formSelector - Parameter.
 * @param {string[]} fieldIds - Dialog field ids.
 * @returns {void} Result.
 */
function bindContactValidationReset(dialog, handler, formSelector, fieldIds) {
  const form = dialog.querySelector(formSelector);
  if (!form) return;
  form.addEventListener('reset', () => {
    contactDialogFieldErrors = {};
    clearAllContactInlineErrors(fieldIds);
    setTimeout(handler, 0);
  });
}

/**
 * Opens add contact dialog.
 * @returns {void} Result.
 */
function openAddContactDialog() {
  let dialog = ensureAddContactDialog();
  dialog.classList.remove('closing');
  dialog.showModal();
  contactDialogFieldErrors = {};
  clearAllContactInlineErrors(ADD_CONTACT_FIELD_IDS);
  initAddContactDialogValidation(dialog);
  updateAddContactSubmitState(dialog);
  if (typeof openAddContact === "function") {
    openAddContact();
  }
}

/**
 * Executes ensure add contact dialog logic.
 * @returns {void} Result.
 */
function ensureAddContactDialog() {
  let dialog = document.getElementById("add-contact-dialog");
  if (!dialog) {
    document.body.insertAdjacentHTML("beforeend", getDialogAddContact());
    dialog = document.getElementById("add-contact-dialog");
    bindAddContactDialogEvents(dialog);
  }
  return dialog;
}

/**
 * Executes bind add contact dialog events logic.
 * @param {HTMLElement} dialog - Dialog element.
 * @returns {void} Result.
 */
function bindAddContactDialogEvents(dialog) {
  const closeBtn = dialog.querySelector(".ac-close");
  closeBtn.addEventListener("click", () => closeAddContactDialogWithAnimation());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      closeAddContactDialogWithAnimation();
    }
  });
  const dialogContent = dialog.querySelector(".ac-dialog-content");
  if (dialogContent) {
    dialogContent.addEventListener("click", (e) => e.stopPropagation());
  }
}

// NEU: Schließt Add Contact Dialog mit Animation
/**
 * Closes add contact dialog with animation.
 * @returns {void} Result.
 */
function closeAddContactDialogWithAnimation() {
  const dialog = document.getElementById("add-contact-dialog");
  if (dialog) {
    dialog.classList.add('closing');
    setTimeout(() => {
      dialog.close();
    }, 300);
  }
}

/**
 * Shows contacts toast.
 * @param {string} message - Message text.
 * @param {*} durationMs - Parameter.
 * @returns {void} Result.
 */
function showContactsToast(message, durationMs = 2200) {
  const old = document.getElementById('contacts-toast');
  if (old) old.remove();
  document.body.insertAdjacentHTML('beforeend', getContactsToastTemplate(message));
  const toast = document.getElementById('contacts-toast');
  if (!toast) return;
  requestAnimationFrame(() => toast.classList.add('contacts-toast-visible'));
  window.setTimeout(() => {
    toast.classList.remove('contacts-toast-visible');
    window.setTimeout(() => toast.remove(), 220);
  }, durationMs);
}

/**
 * Toggles contact more menu.
 * @param {Event} event - Browser event.
 * @returns {void} Result.
 */
function toggleContactMoreMenu(event) {
  if (event) {
    event.stopPropagation();
  }
  const menu = document.getElementById('contact-more-menu');
  if (!menu) return;
  menu.classList.toggle('is-open');
  initContactMoreMenuAutoClose();
}

/**
 * Closes contact more menu.
 * @returns {void} Result.
 */
function closeContactMoreMenu() {
  const menu = document.getElementById('contact-more-menu');
  if (menu) {
    menu.classList.remove('is-open');
  }
}

/**
 * Initializes contact more menu auto close.
 * @returns {void} Result.
 */
function initContactMoreMenuAutoClose() {
  if (document.body.dataset.contactMoreInit === '1') return;
  document.addEventListener('click', (event) => {
    const menu = document.getElementById('contact-more-menu');
    const button = document.querySelector('.contact-more-btn');
    if (!menu || !button) return;
    if (menu.classList.contains('is-open') && !menu.contains(event.target) && !button.contains(event.target)) {
      menu.classList.remove('is-open');
    }
  });
  document.body.dataset.contactMoreInit = '1';
}

/**
 * Updates edit contact submit state.
 * @param {HTMLElement} dialog - Dialog element.
 * @returns {void} Result.
 */
function updateEditContactSubmitState(dialog) {
  updateContactSubmitState(dialog, {
    nameId: 'edit-name',
    emailId: 'edit-email',
    phoneId: 'edit-phone',
    submitSelector: '[data-edit-submit]'
  });
}

/**
 * Initializes edit contact dialog validation.
 * @param {HTMLElement} dialog - Dialog element.
 * @returns {void} Result.
 */
function initEditContactDialogValidation(dialog) {
  initContactDialogValidation(dialog, {
    fieldIds: EDIT_CONTACT_FIELD_IDS,
    initKey: 'editValidationInit',
    formSelector: '#edit-contact-form',
    updateSubmitState: updateEditContactSubmitState
  });
}

/**
 * Opens edit contact dialog.
 * @param {string} id - Identifier.
 * @param {string} name - Name.
 * @param {string} email - Email address.
 * @param {string} phone - Phone number.
 * @param {*} initials - Parameter.
 * @returns {void} Result.
 */
function openEditContactDialog(id, name, email, phone, initials) {
  const container = document.getElementById('edit-contact-dialog-container');
  if (!container) return;
  container.innerHTML = getEditContactDialog(id, name, email, phone, initials);
  const dialog = document.getElementById('edit-contact-dialog');
  if (!dialog) return;
  contactDialogFieldErrors = {};
  bindEditContactDialogEvents(dialog);
  showEditContactDialog(dialog);
  initEditContactDialogValidation(dialog);
  updateEditContactSubmitState(dialog);
}

/**
 * Executes bind edit contact dialog events logic.
 * @param {HTMLElement} dialog - Dialog element.
 * @returns {void} Result.
 */
function bindEditContactDialogEvents(dialog) {
  dialog.addEventListener('click', (e) => handleEditDialogBackdropClick(e, dialog));
  const dialogContent = dialog.querySelector('.ac-dialog-content');
  if (dialogContent) {
    dialogContent.addEventListener('click', (e) => e.stopPropagation());
  }
}

/**
 * Executes handle edit dialog backdrop click logic.
 * @param {Event} event - Browser event.
 * @param {HTMLElement} dialog - Dialog element.
 * @returns {void} Result.
 */
function handleEditDialogBackdropClick(event, dialog) {
  if (event.target === dialog) {
    closeEditContactDialog();
  }
}

/**
 * Shows edit contact dialog.
 * @param {HTMLElement} dialog - Dialog element.
 * @returns {void} Result.
 */
function showEditContactDialog(dialog) {
  dialog.classList.remove('closing');
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
}

/**
 * Closes edit contact dialog.
 * @returns {void} Result.
 */
function closeEditContactDialog() {
  const dialog = document.getElementById('edit-contact-dialog');
  if (dialog) {
    dialog.classList.add('closing');
    setTimeout(() => {
      dialog.close();
      dialog.remove();
    }, 300);
  }
}
