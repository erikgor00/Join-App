/**
 * Renders add task.
 * @returns {Promise<*>} Result.
 */
/**
 * Render Add Task.
 * @returns {Promise<void>} Result value.
 */
async function renderAddTask() {
  const content = document.getElementById('add-task-content');
  if (!content) return;
  setAddTaskActionButtonsDisabled(false);
  applyTodayMinDate();
  await loadContacts();
  resetSelectedContacts();
  selectContacts();
  renderSelectedAvatars();
  initAddDropdownClose();
  initAddTaskBlurValidation();
  initAddSubtaskEnter();
  showSubtasks();
  updateCreateButtonState();
}

/**
 * Initializes add task blur validation handlers.
 * @returns {void} Result.
 */
/**
 * Init Add Task Blur Validation.
 * @returns {boolean} Result value.
 */
function initAddTaskBlurValidation() {
  const form = document.getElementById('add-task-form');
  if (!form || form.dataset.blurValidationInit === '1') return;

  registerTitleValidationHandlers();
  registerDateValidationHandlers();
  registerCategoryValidationHandlers();
  form.dataset.blurValidationInit = '1';
}

/**
 * Registers title validation handlers.
 * @returns {void} Result.
 */
/**
 * Register Title Validation Handlers.
 * @returns {boolean} Result value.
 */
function registerTitleValidationHandlers() {
  const titleInput = document.getElementById('title');
  titleInput?.addEventListener('blur', validateTitleField);
  titleInput?.addEventListener('input', clearTitleErrorOnValidInput);
  titleInput?.addEventListener('input', updateCreateButtonState);
}

/**
 * Registers date validation handlers.
 * @returns {void} Result.
 */
/**
 * Register Date Validation Handlers.
 * @returns {boolean} Result value.
 */
function registerDateValidationHandlers() {
  const dateInput = document.getElementById('date');
  dateInput?.addEventListener('blur', validateDateField);
  dateInput?.addEventListener('input', clearDateErrorOnValidInput);
  dateInput?.addEventListener('input', updateCreateButtonState);
  dateInput?.addEventListener('change', clearDateErrorOnValidInput);
  dateInput?.addEventListener('change', updateCreateButtonState);
}

/**
 * Registers category validation handlers.
 * @returns {void} Result.
 */
/**
 * Register Category Validation Handlers.
 * @returns {boolean} Result value.
 */
function registerCategoryValidationHandlers() {
  const categorySelect = document.getElementById('category-select');
  categorySelect?.addEventListener('blur', validateCategoryField);
  categorySelect?.addEventListener('change', updateCreateButtonState);
}

/**
 * Updates create button disabled state.
 * @returns {void} Result.
 */
/**
 * Update Create Button State.
 * @returns {void} Nothing.
 */
function updateCreateButtonState() {
  const btn = document.getElementById('create-task-btn');
  if (!btn) return;
  
  const titleInput = document.getElementById('title');
  const dateInput = document.getElementById('date');
  const categoryInput = document.getElementById('category');
  
  const hasTitle = titleInput && String(titleInput.value || '').trim().length > 0;
  const hasDate = dateInput && String(dateInput.value || '').trim().length > 0;
  const hasCategory = categoryInput && String(categoryInput.value || '').trim().length > 0;
  
  const isFormValid = hasTitle && hasDate && hasCategory;
  btn.disabled = !isFormValid;
}

/**
 * Executes reset selected contacts logic.
 * @returns {void} Result.
 */
/**
 * Reset Selected Contacts.
 * @returns {void} Nothing.
 */
function resetSelectedContacts() {
  selectedContacts = [];
}

/**
 * Validates form.
 * @returns {void} Result.
 */
/**
 * Validate Form.
 * @returns {boolean} Result value.
 */
function validateForm() {
  clearValidationErrors();
  let isValid = true;
  isValid = validateTitleField() && isValid;
  isValid = validateDateField() && isValid;
  isValid = validateCategoryField() && isValid;
  return isValid;
}

/**
 * Clears validation errors.
 * @returns {void} Result.
 */
/**
 * Clear Validation Errors.
 * @returns {boolean} Result value.
 */
function clearValidationErrors() {
  setErrorText('title-error', '');
  setErrorText('date-error', '');
  setErrorText('category-error', '');
}

/**
 * Sets error text.
 * @param {string} id - Identifier.
 * @param {string} value - Value.
 * @returns {void} Result.
 */
/**
 * Set Error Text.
 * @param {string} id - id.
 * @param {string} value - value.
 * @returns {void} Nothing.
 */
function setErrorText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/**
 * Validates title field.
 * @returns {void} Result.
 */
/**
 * Validate Title Field.
 * @returns {boolean} Result value.
 */
function validateTitleField() {
  const input = document.getElementById('title');
  return validateRequiredInput(input, 'title-error');
}

/**
 * Clears title error while typing as soon as input is valid.
 * @returns {void} Result.
 */
/**
 * Clear Title Error On Valid Input.
 * @returns {boolean} Result value.
 */
function clearTitleErrorOnValidInput() {
  const input = document.getElementById('title');
  if (!input) return;
  if (!String(input.value || '').trim()) return;
  setErrorText('title-error', '');
  input.classList.remove('input-error');
}

/**
 * Validates date field.
 * @returns {void} Result.
 */
/**
 * Validate Date Field.
 * @returns {boolean} Result value.
 */
function validateDateField() {
  const input = document.getElementById('date');
  if (!validateRequiredInput(input, 'date-error')) {
    return false;
  }

  const today = getTodayDateString();
  const selectedDate = String(input.value || '').trim();
  if (selectedDate < today) {
    setErrorText('date-error', 'Please select a future date');
    input.classList.add('input-error');
    return false;
  }

  setErrorText('date-error', '');
  input.classList.remove('input-error');
  return true;
}

/**
 * Clears date error while typing as soon as input is valid and not in the past.
 * @returns {void} Result.
 */
/**
 * Clear Date Error On Valid Input.
 * @returns {boolean} Result value.
 */
function clearDateErrorOnValidInput() {
  const input = document.getElementById('date');
  if (!input) return;
  const selectedDate = String(input.value || '').trim();
  if (!selectedDate) return;
  if (selectedDate < getTodayDateString()) return;
  setErrorText('date-error', '');
  input.classList.remove('input-error');
}

/**
 * Applies today's date as minimum selectable due date.
 * @returns {void} Result.
 */
/**
 * Apply Today Min Date.
 * @returns {void} Nothing.
 */
function applyTodayMinDate() {
  const dateInput = document.getElementById('date');
  if (!dateInput) return;
  dateInput.min = getTodayDateString();
}

/**
 * Returns today's local date in yyyy-mm-dd.
 * @returns {string} Result.
 */
/**
 * Get Today Date String.
 * @returns {any} Result value.
 */
function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Validates category field.
 * @returns {void} Result.
 */
/**
 * Validate Category Field.
 * @returns {boolean} Result value.
 */
function validateCategoryField() {
  const input = document.getElementById('category');
  const highlightEl = document.getElementById('category-select');
  return validateRequiredInput(input, 'category-error', highlightEl);
}

/**
 * Validates required input.
 * @param {HTMLElement} input - Input element.
 * @param {*} errorId - Parameter.
 * @returns {void} Result.
 */
/**
 * Validate Required Input.
 * @param {HTMLElement} input - input.
 * @param {string} errorId - error id.
 * @param {HTMLElement} highlightElement - highlight element.
 * @returns {boolean} Result value.
 */
function validateRequiredInput(input, errorId, highlightElement = input) {
  if (!input || !input.value.trim()) {
    setErrorText(errorId, 'This field is required');
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
 * Saves to array.
 * @param {Event} event - Browser event.
 * @returns {Promise<*>} Result.
 */
/**
 * Save To Array.
 * @param {Event} event - event.
 * @returns {Promise<void>} Result value.
 */
