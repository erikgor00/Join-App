/**
 * Opens edit task modal.
 * @param {string} id - Identifier.
 * @returns {Promise<*>} Result.
 */
/**
 * Open Edit Task Modal.
 * @param {string} id - id.
 * @returns {Promise<void>} Result value.
 */
async function openEditTaskModal(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  initializeEditTaskState(task);
  const modalContent = getTaskModalContent();
  if (!modalContent) return;
  modalContent.innerHTML = generateEditTaskTemplate(task);
  await loadContacts();
  initializeEditTaskForm();
}

/**
 * Initializes edit task state.
 * @param {Object} task - Task object.
 * @returns {void} Result.
 */
/**
 * Initialize Edit Task State.
 * @param {Object} task - task.
 * @returns {void} Nothing.
 */
function initializeEditTaskState(task) {
  activeTask = task;
  editSubtasks = Array.isArray(task.subtasks) ? task.subtasks.map(st => ({ ...st })) : [];
  selectedContacts = Array.isArray(task.contacts) ? [...task.contacts] : [];
  window.editingEditSubtaskIndex = null;
}

/**
 * Returns task modal content.
 * @returns {HTMLElement|null} Result.
 */
/**
 * Get Task Modal Content.
 * @returns {any} Result value.
 */
function getTaskModalContent() {
  const modal = document.getElementById("task-modal");
  return modal ? modal.querySelector(".modal-content") : null;
}

/**
 * Initializes edit task form.
 * @returns {void} Result.
 */
/**
 * Initialize Edit Task Form.
 * @returns {void} Nothing.
 */
function initializeEditTaskForm() {
  applyTodayMinDateForEdit();
  initEditFormBlurValidation();
  renderEditAssignedContacts();
  renderEditSubtasks();
  initEditDropdownClose();
  initEditSubtaskEnter();
}

/**
 * Initializes blur validation handlers for the edit form.
 * @returns {void} Result.
 */
/**
 * Init Edit Form Blur Validation.
 * @returns {boolean} Result value.
 */
function initEditFormBlurValidation() {
  const form = document.getElementById('edit-task-form');
  if (!form || form.dataset.blurValidationInit === '1') return;
  registerEditTitleValidationHandler();
  registerEditDateValidationHandlers();
  registerEditCategoryValidationHandler();
  form.dataset.blurValidationInit = '1';
}

/**
 * Registers edit title validation handler.
 * @returns {void} Result.
 */
/**
 * Register Edit Title Validation Handler.
 * @returns {boolean} Result value.
 */
function registerEditTitleValidationHandler() {
  const titleInput = document.getElementById('edit-title');
  titleInput?.addEventListener('blur', () => {
    validateEditRequiredInput(titleInput, 'edit-title-error');
  });
}

/**
 * Registers edit date validation handlers.
 * @returns {void} Result.
 */
/**
 * Register Edit Date Validation Handlers.
 * @returns {boolean} Result value.
 */
function registerEditDateValidationHandlers() {
  const dateInput = document.getElementById('edit-date');
  dateInput?.addEventListener('blur', () => {
    validateEditDateField();
  });
  dateInput?.addEventListener('input', clearEditDateErrorOnValidInput);
  dateInput?.addEventListener('change', clearEditDateErrorOnValidInput);
}

/**
 * Registers edit category validation handler.
 * @returns {void} Result.
 */
/**
 * Register Edit Category Validation Handler.
 * @returns {boolean} Result value.
 */
function registerEditCategoryValidationHandler() {
  const categorySelect = document.getElementById('edit-category-select');
  categorySelect?.addEventListener('blur', () => {
    const categoryInput = document.getElementById('edit-category');
    validateEditRequiredInput(categoryInput, 'edit-category-error', categorySelect);
  });
}

/**
 * Enables creating an edit-subtask via Enter key.
 * Prevents submitting the edit form.
 * @returns {void} Result.
 */
/**
 * Init Edit Subtask Enter.
 * @returns {void} Nothing.
 */
function initEditSubtaskEnter() {
  const input = document.getElementById('edit-subtask-input');
  if (!input) return;
  if (isEditSubtaskEnterHandlerRegistered(input)) return;
  markEditSubtaskEnterHandlerRegistered(input);
  input.addEventListener('input', clearEditSubtaskErrorOnInput);
  input.addEventListener('keydown', handleEditSubtaskEnterKey);
}

/**
 * Returns whether edit-subtask enter handler is registered.
 * @param {HTMLInputElement} input - Input element.
 * @returns {boolean} Result.
 */
/**
 * Is Edit Subtask Enter Handler Registered.
 * @param {HTMLElement} input - input.
 * @returns {boolean} Result value.
 */
function isEditSubtaskEnterHandlerRegistered(input) {
  return input.dataset && input.dataset.enterHandlerAdded === 'true';
}

/**
 * Marks edit-subtask enter handler as registered.
 * @param {HTMLInputElement} input - Input element.
 * @returns {void} Result.
 */
/**
 * Mark Edit Subtask Enter Handler Registered.
 * @param {HTMLElement} input - input.
 * @returns {void} Nothing.
 */
function markEditSubtaskEnterHandlerRegistered(input) {
  if (input.dataset) input.dataset.enterHandlerAdded = 'true';
}

/**
 * Clears edit subtask error on input.
 * @returns {void} Result.
 */
/**
 * Clear Edit Subtask Error On Input.
 * @returns {void} Nothing.
 */
function clearEditSubtaskErrorOnInput() {
  setEditSubtaskError('');
}

/**
 * Handles edit-subtask enter key.
 * @param {KeyboardEvent} event - Keyboard event.
 * @returns {void} Result.
 */
/**
 * Handle Edit Subtask Enter Key.
 * @param {Event} event - event.
 * @returns {void} Nothing.
 */
function handleEditSubtaskEnterKey(event) {
  if (event.isComposing || event.key !== 'Enter' || event.shiftKey) return;
  event.preventDefault();
  event.stopPropagation();
  addEditSubtask();
}

/**
 * Renders edit assigned contacts.
 * @returns {void} Result.
 */
/**
 * Render Edit Assigned Contacts.
 * @returns {void} Nothing.
 */
function renderEditAssignedContacts() {
  const modal = document.getElementById("task-modal");
  const dropdown = modal ? modal.querySelector("#dropdown-contacts") : null;
  if (!dropdown) return;
  dropdown.innerHTML = generateAssignedContacts(contacts);
  renderSelectedAvatars();
}

/**
 * Toggles edit category dropdown.
 * @param {Event} event - Browser event.
 * @returns {void} Result.
 */
/**
 * Toggle Edit Category Dropdown.
 * @param {Event} event - event.
 * @returns {void} Nothing.
 */
function toggleEditCategoryDropdown(event) {
  event.stopPropagation();
  const modal = document.getElementById("task-modal");
  if (!modal) return;
  // Close other dropdowns first
  const contactsDropdown = modal.querySelector("#dropdown-contacts");
  if (contactsDropdown) contactsDropdown.classList.remove("show");
  
  const dropdown = modal.querySelector("#edit-category-dropdown");
  if (!dropdown) return;
  dropdown.classList.toggle("show");
}

/**
 * Sets edit category.
 * @param {string} value - Value.
 * @returns {void} Result.
 */
/**
 * Set Edit Category.
 * @param {string} value - value.
 * @returns {void} Nothing.
 */
function setEditCategory(value) {
  const modal = document.getElementById("task-modal");
  if (!modal) return;
  const input = modal.querySelector("#edit-category");
  const select = modal.querySelector("#edit-category-select");
  if (!input || !select) return;
  updateEditCategoryInput(input, select, value);
  closeEditCategoryDropdown(modal);
}

/**
 * Updates edit category input and label.
 * @param {HTMLElement} input - Category input.
 * @param {HTMLElement} select - Category select.
 * @param {string} value - Category value.
 * @returns {void} Result.
 */
/**
 * Update Edit Category Input.
 * @param {HTMLElement} input - input.
 * @param {HTMLElement} select - select.
 * @param {string} value - value.
 * @returns {void} Nothing.
 */
function updateEditCategoryInput(input, select, value) {
  input.value = value;
  input.classList.remove('input-error');
  select.classList.remove('input-error');
  setEditErrorText('edit-category-error', '');
  updateEditCategoryLabel(select, value);
}

/**
 * Updates edit category label.
 * @param {HTMLElement} select - Category select.
 * @param {string} value - Category value.
 * @returns {void} Result.
 */
/**
 * Update Edit Category Label.
 * @param {HTMLElement} select - select.
 * @param {string} value - value.
 * @returns {void} Nothing.
 */
function updateEditCategoryLabel(select, value) {
  const label = select.querySelector("span");
  if (label) label.childNodes[0].textContent = value + " ";
}

/**
 * Closes edit category dropdown.
 * @param {HTMLElement} modal - Modal element.
 * @returns {void} Result.
 */
/**
 * Close Edit Category Dropdown.
 * @param {HTMLElement} modal - modal.
 * @returns {void} Nothing.
 */
function closeEditCategoryDropdown(modal) {
  const dropdown = modal.querySelector("#edit-category-dropdown");
  if (dropdown) dropdown.classList.remove("show");
}

/**
 * Sets edit error text.
 * @param {string} id - Identifier.
 * @param {string} value - Value.
 * @returns {void} Result.
 */
/**
 * Set Edit Error Text.
 * @param {string} id - id.
 * @param {string} value - value.
 * @returns {void} Nothing.
 */
function setEditErrorText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/**
 * Clears edit validation errors.
 * @returns {void} Result.
 */
/**
 * Clear Edit Validation Errors.
 * @returns {boolean} Result value.
 */
function clearEditValidationErrors() {
  setEditErrorText('edit-title-error', '');
  setEditErrorText('edit-date-error', '');
  setEditErrorText('edit-category-error', '');
}

/**
 * Validates required input in edit form.
 * @param {HTMLElement} input - Input element.
 * @param {string} errorId - Error element id.
 * @param {HTMLElement} highlightElement - Element to highlight (defaults to input).
 * @returns {boolean} Result.
 */
/**
 * Validate Edit Required Input.
 * @param {HTMLElement} input - input.
 * @param {string} errorId - error id.
 * @param {HTMLElement} highlightElement - highlight element.
 * @returns {boolean} Result value.
 */