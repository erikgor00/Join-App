/**
 * Adds contact.
 * @param {Event} event - Browser event.
 * @returns {Promise<*>} Result.
 */
/**
 * Add Contact.
 * @param {Event} event - event.
 * @returns {Promise<void>} Result value.
 */
async function addContact(event) {
  event.preventDefault();
  const contact = generateObjFromContact();

  if (!validateAndNormalizeAddContact(contact)) return;

  if (!isContactComplete(contact)) {
    alert("Bitte alle Felder ausfüllen!");
    return;
  }
  const saved = await saveContact(contact);
  if (!saved) return;
  await handleAddContactSaved();
}

/**
 * Validates and normalizes add contact data.
 * @param {Object} contact - Contact object.
 * @returns {boolean} Result.
 */
/**
 * Validate And Normalize Add Contact.
 * @param {Object} contact - contact.
 * @returns {boolean} Result value.
 */
function validateAndNormalizeAddContact(contact) {
  return validateAndAssignContactName(contact, ['ac-name', 'ac-email', 'ac-phone'], 'ac-name')
    && validateAndAssignContactEmail(contact, ['ac-name', 'ac-email', 'ac-phone'], 'ac-email')
    && validateAndAssignContactPhone(contact, ['ac-name', 'ac-email', 'ac-phone'], 'ac-phone');
}

/**
 * Validates and assigns contact name.
 * @param {Object} contact - Contact object.
 * @param {string[]} fieldIds - Field ids.
 * @param {string} errorFieldId - Error field id.
 * @returns {boolean} Result.
 */
/**
 * Validate And Assign Contact Name.
 * @param {Object} contact - contact.
 * @param {HTMLElement} fieldIds - field ids.
 * @param {HTMLElement} errorFieldId - error field id.
 * @returns {boolean} Result value.
 */
function validateAndAssignContactName(contact, fieldIds, errorFieldId) {
  const check = validateContactNameInput(contact.name);
  if (!check.isValid) return showContactSubmitValidationError(errorFieldId, check.error, fieldIds);
  contact.name = check.normalizedName;
  return true;
}

/**
 * Validates and assigns contact email.
 * @param {Object} contact - Contact object.
 * @param {string[]} fieldIds - Field ids.
 * @param {string} errorFieldId - Error field id.
 * @returns {boolean} Result.
 */
/**
 * Validate And Assign Contact Email.
 * @param {Object} contact - contact.
 * @param {HTMLElement} fieldIds - field ids.
 * @param {HTMLElement} errorFieldId - error field id.
 * @returns {boolean} Result value.
 */
function validateAndAssignContactEmail(contact, fieldIds, errorFieldId) {
  const check = validateEmailLikeSignup(contact.email);
  if (!check.isValid) return showContactSubmitValidationError(errorFieldId, check.error, fieldIds);
  contact.email = check.normalizedEmail;
  return true;
}

/**
 * Validates and assigns contact phone.
 * @param {Object} contact - Contact object.
 * @param {string[]} fieldIds - Field ids.
 * @param {string} errorFieldId - Error field id.
 * @returns {boolean} Result.
 */
/**
 * Validate And Assign Contact Phone.
 * @param {Object} contact - contact.
 * @param {HTMLElement} fieldIds - field ids.
 * @param {HTMLElement} errorFieldId - error field id.
 * @returns {boolean} Result value.
 */
function validateAndAssignContactPhone(contact, fieldIds, errorFieldId) {
  const check = validateContactPhoneNumber(contact.phone);
  if (!check.isValid) return showContactSubmitValidationError(errorFieldId, check.error, fieldIds);
  contact.phone = check.normalizedPhone;
  return true;
}

/**
 * Shows contact submit validation error.
 * @param {string} fieldId - Field id.
 * @param {string} error - Error text.
 * @param {string[]} fieldIds - Field ids.
 * @returns {boolean} Result.
 */
/**
 * Show Contact Submit Validation Error.
 * @param {HTMLElement} fieldId - field id.
 * @param {string} error - error.
 * @param {HTMLElement} fieldIds - field ids.
 * @returns {boolean} Result value.
 */
function showContactSubmitValidationError(fieldId, error, fieldIds) {
  if (typeof showContactSubmitError === 'function') {
    showContactSubmitError(fieldId, error, fieldIds);
  }
  return false;
}

/**
 * Handles successful add contact save.
 * @returns {Promise<void>} Result.
 */
/**
 * Handle Add Contact Saved.
 * @returns {Promise<void>} Result value.
 */
async function handleAddContactSaved() {
  await renderContactGroup();
  closeAddContactDialogAfterSave();
  resetAddContactForm();
  setTimeout(() => showContactsToast('Contact successfully created'), 0);
}

/**
 * Closes add contact dialog after save.
 * @returns {void} Result.
 */
/**
 * Close Add Contact Dialog After Save.
 * @returns {void} Nothing.
 */
function closeAddContactDialogAfterSave() {
  const dialog = document.getElementById("add-contact-dialog");
  if (dialog) dialog.close();
}

/**
 * Resets add contact form.
 * @returns {void} Result.
 */
/**
 * Reset Add Contact Form.
 * @returns {void} Nothing.
 */
function resetAddContactForm() {
  const form = document.getElementById('add-contact-form');
  if (form) form.reset();
}

/**
 * Checks whether contact complete.
 * @param {Object} contact - Contact object.
 * @returns {boolean} Result.
 */
/**
 * Is Contact Complete.
 * @param {Object} contact - contact.
 * @returns {boolean} Result value.
 */
function isContactComplete(contact) {
  return contact.name && contact.email && contact.phone;
}

/**
 * Saves contact.
 * @param {Object} contact - Contact object.
 * @returns {Promise<*>} Result.
 */
/**
 * Save Contact.
 * @param {Object} contact - contact.
 * @returns {Promise<void>} Result value.
 */
async function saveContact(contact) {
  try {
    const response = await fetch(`${BASE_URL}/contacts.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Speichern des Kontakts:", error);
  }
}

/**
 * Generates obj from contact.
 * @returns {*} Result.
 */
/**
 * Generate Obj From Contact.
 * @returns {any} Result value.
 */
function generateObjFromContact() {
  const name = document.getElementById('ac-name').value;
  const email = document.getElementById('ac-email').value;
  const phone = document.getElementById('ac-phone').value;
  return { name, email, phone };
}

/**
 * Fetches contact details.
 * @param {string} contactId - Contact identifier.
 * @returns {Promise<*>} Result.
 */
/**
 * Fetch Contact Details.
 * @param {string} contactId - contact id.
 * @returns {Promise<void>} Result value.
 */
async function fetchContactDetails(contactId) {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`);
    if (!response.ok) {
      throw new Error("Fehler beim Abrufen der Kontaktdaten.");
    }
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Abrufen der Kontaktdaten:", error);
    return null;
  }
}

// delete contact
/**
 * Deletes contact.
 * @param {string} contactId - Contact identifier.
 * @returns {Promise<*>} Result.
 */
/**
 * Delete Contact.
 * @param {string} contactId - contact id.
 * @returns {Promise<void>} Result value.
 */
async function deleteContact(contactId) {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
      method: "DELETE"
    });
    if (response.ok) {
      await renderContactGroup();
    } else {
      console.error("Fehler beim Löschen des Kontakts.");
    }
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
  refreshContactDetails();
}

/**
 * Updates contact.
 * @param {Event} event - Browser event.
 * @param {string} contactId - Contact identifier.
 * @returns {Promise<*>} Result.
 */
/**
 * Update Contact.
 * @param {Event} event - event.
 * @param {string} contactId - contact id.
 * @returns {Promise<void>} Result value.
 */
async function updateContact(event, contactId) {
  event.preventDefault();
  const updatedContact = generateObjFromEditContact();
  if (!validateAndNormalizeEditContact(updatedContact)) return;
  try {
    const response = await sendContactUpdate(contactId, updatedContact);
    if (!response.ok) {
      console.error("Fehler beim Aktualisieren des Kontakts.");
      return;
    }
    await handleContactUpdateSuccess();
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Kontakts:", error);
  }
}

/**
 * Generates object from edit contact form.
 * @returns {Object} Result.
 */
/**
 * Generate Obj From Edit Contact.
 * @returns {any} Result value.
 */
function generateObjFromEditContact() {
  return {
    name: document.getElementById('edit-name').value,
    email: document.getElementById('edit-email').value,
    phone: document.getElementById('edit-phone').value
  };
}

/**
 * Validates and normalizes edit contact data.
 * @param {Object} contact - Contact object.
 * @returns {boolean} Result.
 */
/**
 * Validate And Normalize Edit Contact.
 * @param {Object} contact - contact.
 * @returns {boolean} Result value.
 */
function validateAndNormalizeEditContact(contact) {
  return validateAndAssignContactName(contact, ['edit-name', 'edit-email', 'edit-phone'], 'edit-name')
    && validateAndAssignContactEmail(contact, ['edit-name', 'edit-email', 'edit-phone'], 'edit-email')
    && validateAndAssignContactPhone(contact, ['edit-name', 'edit-email', 'edit-phone'], 'edit-phone');
}

/**
 * Sends contact update.
 * @param {string} contactId - Contact identifier.
 * @param {Object} updatedContact - Updated contact.
 * @returns {Promise<Response>} Result.
 */
/**
 * Send Contact Update.
 * @param {string} contactId - contact id.
 * @param {string} updatedContact - updated contact.
 * @returns {void} Nothing.
 */
function sendContactUpdate(contactId, updatedContact) {
  return fetch(`${BASE_URL}/contacts/${contactId}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedContact),
  });
}

/**
 * Handles successful contact update.
 * @returns {Promise<void>} Result.
 */
/**
 * Handle Contact Update Success.
 * @returns {Promise<void>} Result value.
 */
async function handleContactUpdateSuccess() {
  await renderContactGroup();
  closeEditContactDialog();
  refreshContactDetails();
}
