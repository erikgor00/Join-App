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
/**
 * Init Edit Contact Dialog Validation.
 * @param {HTMLElement} dialog - dialog.
 * @returns {boolean} Result value.
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
/**
 * Open Edit Contact Dialog.
 * @param {string} id - id.
 * @param {string} name - name.
 * @param {string} email - email.
 * @param {string} phone - phone.
 * @param {string} initials - initials.
 * @returns {void} Nothing.
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
/**
 * Bind Edit Contact Dialog Events.
 * @param {HTMLElement} dialog - dialog.
 * @returns {void} Nothing.
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
/**
 * Handle Edit Dialog Backdrop Click.
 * @param {Event} event - event.
 * @param {HTMLElement} dialog - dialog.
 * @returns {void} Nothing.
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
/**
 * Show Edit Contact Dialog.
 * @param {HTMLElement} dialog - dialog.
 * @returns {void} Nothing.
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
/**
 * Close Edit Contact Dialog.
 * @returns {void} Nothing.
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
