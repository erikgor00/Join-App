/**
 * Adds contact.
 * @param {Event} event - Browser event.
 * @returns {Promise<*>} Result.
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
function closeAddContactDialogAfterSave() {
  const dialog = document.getElementById("add-contact-dialog");
  if (dialog) dialog.close();
}

/**
 * Resets add contact form.
 * @returns {void} Result.
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
function isContactComplete(contact) {
  return contact.name && contact.email && contact.phone;
}

/**
 * Saves contact.
 * @param {Object} contact - Contact object.
 * @returns {Promise<*>} Result.
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
async function handleContactUpdateSuccess() {
  await renderContactGroup();
  closeEditContactDialog();
  refreshContactDetails();
}
