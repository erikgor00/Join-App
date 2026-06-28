function validateEditRequiredInput(input, errorId, highlightElement = input) {
  const value = input ? String(input.value ?? '').trim() : '';
  if (!input || !value) {
    setEditErrorText(errorId, 'This field is required');
    input?.classList.add('input-error');
    if (highlightElement && highlightElement !== input) {
      highlightElement.classList.add('input-error');
    }
    return false;
  }
  input.classList.remove('input-error');
  if (highlightElement && highlightElement !== input) {
    highlightElement.classList.remove('input-error');
  }
  return true;
}

/**
 * Applies today's date as minimum selectable due date for edit form.
 * @returns {void} Result.
 */
/**
 * Apply Today Min Date For Edit.
 * @returns {void} Nothing.
 */
function applyTodayMinDateForEdit() {
  const dateInput = document.getElementById('edit-date');
  if (!dateInput) return;
  dateInput.min = getTodayDateStringForEdit();
}

/**
 * Returns today's local date in yyyy-mm-dd for edit form.
 * @returns {string} Result.
 */
/**
 * Get Today Date String For Edit.
 * @returns {any} Result value.
 */
function getTodayDateStringForEdit() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Validates edit due date field.
 * @returns {boolean} Result.
 */
/**
 * Validate Edit Date Field.
 * @returns {boolean} Result value.
 */
function validateEditDateField() {
  const input = document.getElementById('edit-date');
  if (!validateEditRequiredInput(input, 'edit-date-error')) {
    return false;
  }

  const today = getTodayDateStringForEdit();
  const selectedDate = String(input.value || '').trim();
  if (selectedDate < today) {
    setEditErrorText('edit-date-error', 'Please select a future date');
    input.classList.add('input-error');
    return false;
  }

  setEditErrorText('edit-date-error', '');
  input.classList.remove('input-error');
  return true;
}

/**
 * Clears edit date error while typing as soon as input is valid and not in the past.
 * @returns {void} Result.
 */
/**
 * Clear Edit Date Error On Valid Input.
 * @returns {boolean} Result value.
 */
function clearEditDateErrorOnValidInput() {
  const input = document.getElementById('edit-date');
  if (!input) return;
  const selectedDate = String(input.value || '').trim();
  if (!selectedDate) return;
  if (selectedDate < getTodayDateStringForEdit()) return;
  setEditErrorText('edit-date-error', '');
  input.classList.remove('input-error');
}

/**
 * Scrolls edit form to the given element (inside overflow container).
 * @param {HTMLElement|null} target - Target element.
 * @returns {void} Result.
 */
/**
 * Scroll Edit Form To.
 * @param {HTMLElement} target - target.
 * @returns {void} Nothing.
 */
function scrollEditFormTo(target) {
  if (!target) return;
  const scrollContainer = document.querySelector('#edit-task-form .edit-form-scroll');
  if (!scrollContainer) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const containerRect = scrollContainer.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const offsetTop = targetRect.top - containerRect.top + scrollContainer.scrollTop - 16;
  scrollContainer.scrollTo({ top: offsetTop, behavior: 'smooth' });
}

/**
 * Validates edit form.
 * @returns {boolean} Result.
 */
/**
 * Validate Edit Form.
 * @returns {boolean} Result value.
 */
function validateEditForm() {
  clearEditValidationErrors();
  const fields = getEditValidationFields();
  const invalid = getEditValidationFailures(fields);
  if (invalid.length > 0) return handleInvalidEditForm(invalid[0]);

  return true;
}

/**
 * Returns edit validation fields.
 * @returns {Object} Result.
 */
/**
 * Get Edit Validation Fields.
 * @returns {boolean} Result value.
 */
function getEditValidationFields() {
  return {
    titleInput: document.getElementById('edit-title'),
    dateInput: document.getElementById('edit-date'),
    categoryInput: document.getElementById('edit-category'),
    categorySelect: document.getElementById('edit-category-select')
  };
}

/**
 * Returns edit validation failures.
 * @param {Object} fields - Validation fields.
 * @returns {Array<Object>} Result.
 */
/**
 * Get Edit Validation Failures.
 * @param {HTMLElement} fields - fields.
 * @returns {boolean} Result value.
 */
function getEditValidationFailures(fields) {
  const invalid = [];
  if (!validateEditRequiredInput(fields.titleInput, 'edit-title-error')) {
    invalid.push({ errorId: 'edit-title-error', focusEl: fields.titleInput });
  }
  addEditDateFailure(invalid, fields.dateInput);
  addEditCategoryFailure(invalid, fields.categoryInput, fields.categorySelect);
  return invalid;
}

/**
 * Adds edit date failure if invalid.
 * @param {Array<Object>} invalid - Invalid fields.
 * @param {HTMLElement} dateInput - Date input.
 * @returns {void} Result.
 */
/**
 * Add Edit Date Failure.
 * @param {string} invalid - invalid.
 * @param {HTMLElement} dateInput - date input.
 * @returns {void} Nothing.
 */
function addEditDateFailure(invalid, dateInput) {
  if (!validateEditDateField()) invalid.push({ errorId: 'edit-date-error', focusEl: dateInput });
}

/**
 * Adds edit category failure if invalid.
 * @param {Array<Object>} invalid - Invalid fields.
 * @param {HTMLElement} categoryInput - Category input.
 * @param {HTMLElement} categorySelect - Category select.
 * @returns {void} Result.
 */
/**
 * Add Edit Category Failure.
 * @param {string} invalid - invalid.
 * @param {HTMLElement} categoryInput - category input.
 * @param {HTMLElement} categorySelect - category select.
 * @returns {void} Nothing.
 */
function addEditCategoryFailure(invalid, categoryInput, categorySelect) {
  if (!validateEditRequiredInput(categoryInput, 'edit-category-error', categorySelect)) {
    invalid.push({ errorId: 'edit-category-error', focusEl: categorySelect });
  }
}

/**
 * Handles invalid edit form.
 * @param {Object} first - First invalid field.
 * @returns {boolean} Result.
 */
/**
 * Handle Invalid Edit Form.
 * @param {any} first - first.
 * @returns {boolean} Result value.
 */
function handleInvalidEditForm(first) {
  const errorEl = document.getElementById(first.errorId);
  scrollEditFormTo(errorEl || first.focusEl);
  focusEditInvalidField(first.focusEl);
  return false;
}

/**
 * Focuses invalid edit field.
 * @param {HTMLElement} focusEl - Element to focus.
 * @returns {void} Result.
 */
/**
 * Focus Edit Invalid Field.
 * @param {any} focusEl - focus el.
 * @returns {boolean} Result value.
 */
function focusEditInvalidField(focusEl) {
  try {
    focusEl?.focus?.();
  } catch (e) {
    // ignore focus errors
  }
}

/**
 * Initializes edit dropdown close.
 * @returns {void} Result.
 */
/**
 * Init Edit Dropdown Close.
 * @returns {void} Nothing.
 */
function initEditDropdownClose() {
  if (window.editDropdownHandlerAdded) return;
  window.editDropdownHandlerAdded = true;
  document.addEventListener("click", handleEditDropdownDocumentClick, true);
}

/**
 * Handles document clicks for edit dropdowns.
 * @param {Event} event - Browser event.
 * @returns {void} Result.
 */
/**
 * Handle Edit Dropdown Document Click.
 * @param {Event} event - event.
 * @returns {void} Nothing.
 */
function handleEditDropdownDocumentClick(event) {
  const modal = document.getElementById("task-modal");
  if (!modal) return;
  const elements = getEditDropdownElements(modal);
  if (isClickInsideEditDropdown(event.target, elements)) return;
  closeEditDropdownElements(elements);
}

/**
 * Returns edit dropdown elements.
 * @param {HTMLElement} modal - Modal element.
 * @returns {Object} Result.
 */
/**
 * Get Edit Dropdown Elements.
 * @param {HTMLElement} modal - modal.
 * @returns {any} Result value.
 */
function getEditDropdownElements(modal) {
  return {
    selectContacts: modal.querySelector("#select-contacts"),
    contactsDropdown: modal.querySelector("#dropdown-contacts"),
    categorySelect: modal.querySelector("#edit-category-select"),
    categoryDropdown: modal.querySelector("#edit-category-dropdown")
  };
}

/**
 * Returns whether target is inside edit dropdowns.
 * @param {HTMLElement} target - Click target.
 * @param {Object} elements - Dropdown elements.
 * @returns {boolean} Result.
 */
/**
 * Is Click Inside Edit Dropdown.
 * @param {HTMLElement} target - target.
 * @param {HTMLElement} elements - elements.
 * @returns {boolean} Result value.
 */
function isClickInsideEditDropdown(target, elements) {
  return [
    elements.selectContacts,
    elements.contactsDropdown,
    elements.categorySelect,
    elements.categoryDropdown
  ].some((element) => element && element.contains(target));
}

/**
 * Closes edit dropdown elements.
 * @param {Object} elements - Dropdown elements.
 * @returns {void} Result.
 */
/**
 * Close Edit Dropdown Elements.
 * @param {HTMLElement} elements - elements.
 * @returns {void} Nothing.
 */
function closeEditDropdownElements(elements) {
  if (elements.contactsDropdown) elements.contactsDropdown.classList.remove("show");
  if (elements.categoryDropdown) elements.categoryDropdown.classList.remove("show");
}

/**
 * Renders edit subtasks.
 * @returns {void} Result.
 */
/**
 * Render Edit Subtasks.
 * @returns {void} Nothing.
 */