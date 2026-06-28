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
/**
 * Get Contact Validation Fields.
 * @param {HTMLElement} dialog - dialog.
 * @param {HTMLElement} fieldIds - field ids.
 * @returns {boolean} Result value.
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
/**
 * Bind Contact Validation Fields.
 * @param {HTMLElement} fields - fields.
 * @param {HTMLElement} fieldIds - field ids.
 * @param {any} handler - handler.
 * @returns {boolean} Result value.
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
/**
 * Bind Contact Validation Field.
 * @param {HTMLElement} field - field.
 * @param {HTMLElement} fieldIds - field ids.
 * @param {any} handler - handler.
 * @returns {boolean} Result value.
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
/**
 * Handle Contact Validation Field Input.
 * @param {HTMLElement} field - field.
 * @param {any} handler - handler.
 * @returns {boolean} Result value.
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
/**
 * Handle Contact Validation Field Blur.
 * @param {HTMLElement} field - field.
 * @param {any} handler - handler.
 * @returns {boolean} Result value.
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
/**
 * Bind Contact Validation Reset.
 * @param {HTMLElement} dialog - dialog.
 * @param {any} handler - handler.
 * @param {HTMLElement} formSelector - form selector.
 * @param {HTMLElement} fieldIds - field ids.
 * @returns {boolean} Result value.
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
/**
 * Open Add Contact Dialog.
 * @returns {void} Nothing.
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
/**
 * Ensure Add Contact Dialog.
 * @returns {void} Nothing.
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
/**
 * Bind Add Contact Dialog Events.
 * @param {HTMLElement} dialog - dialog.
 * @returns {void} Nothing.
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
/**
 * Close Add Contact Dialog With Animation.
 * @returns {void} Nothing.
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
/**
 * Show Contacts Toast.
 * @param {string} message - message.
 * @param {any} durationMs - duration ms.
 * @returns {void} Nothing.
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
/**
 * Toggle Contact More Menu.
 * @param {Event} event - event.
 * @returns {void} Nothing.
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
/**
 * Close Contact More Menu.
 * @returns {void} Nothing.
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
/**
 * Init Contact More Menu Auto Close.
 * @returns {void} Nothing.
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
/**
 * Update Edit Contact Submit State.
 * @param {HTMLElement} dialog - dialog.
 * @returns {void} Nothing.
 */