/**
 * Opens edit task modal.
 * @param {string} id - Identifier.
 * @returns {Promise<*>} Result.
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
function getTaskModalContent() {
  const modal = document.getElementById("task-modal");
  return modal ? modal.querySelector(".modal-content") : null;
}

/**
 * Initializes edit task form.
 * @returns {void} Result.
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
function isEditSubtaskEnterHandlerRegistered(input) {
  return input.dataset && input.dataset.enterHandlerAdded === 'true';
}

/**
 * Marks edit-subtask enter handler as registered.
 * @param {HTMLInputElement} input - Input element.
 * @returns {void} Result.
 */
function markEditSubtaskEnterHandlerRegistered(input) {
  if (input.dataset) input.dataset.enterHandlerAdded = 'true';
}

/**
 * Clears edit subtask error on input.
 * @returns {void} Result.
 */
function clearEditSubtaskErrorOnInput() {
  setEditSubtaskError('');
}

/**
 * Handles edit-subtask enter key.
 * @param {KeyboardEvent} event - Keyboard event.
 * @returns {void} Result.
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
function updateEditCategoryLabel(select, value) {
  const label = select.querySelector("span");
  if (label) label.childNodes[0].textContent = value + " ";
}

/**
 * Closes edit category dropdown.
 * @param {HTMLElement} modal - Modal element.
 * @returns {void} Result.
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
function setEditErrorText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/**
 * Clears edit validation errors.
 * @returns {void} Result.
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
function applyTodayMinDateForEdit() {
  const dateInput = document.getElementById('edit-date');
  if (!dateInput) return;
  dateInput.min = getTodayDateStringForEdit();
}

/**
 * Returns today's local date in yyyy-mm-dd for edit form.
 * @returns {string} Result.
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
function closeEditDropdownElements(elements) {
  if (elements.contactsDropdown) elements.contactsDropdown.classList.remove("show");
  if (elements.categoryDropdown) elements.categoryDropdown.classList.remove("show");
}

/**
 * Renders edit subtasks.
 * @returns {void} Result.
 */
function renderEditSubtasks() {
  const area = document.getElementById("edit-subtask-area");
  if (!area) return;
  area.innerHTML = "";
  editSubtasks.forEach((st, i) => appendEditSubtask(area, st, i));
}

/**
 * Executes append edit subtask logic.
 * @param {*} area - Parameter.
 * @param {Object} subtask - Subtask object.
 * @param {number} index - Index.
 * @returns {void} Result.
 */
function appendEditSubtask(area, subtask, index) {
  const isEditing = window.editingEditSubtaskIndex === index;
  const markup = isEditing
    ? getEditSubtaskEditMarkup(subtask, index)
    : getEditSubtaskItemMarkup(subtask, index);
  area.innerHTML += markup;
}

/**
 * Adds edit subtask.
 * @returns {void} Result.
 */
function addEditSubtask() {
  const input = document.getElementById("edit-subtask-input");
  if (!input) return;
  const value = input.value.trim();
  if (!value) {
    setEditSubtaskError('Subtasks must not be empty.');
    return;
  }
  editSubtasks.push({ title: value, done: false });
  input.value = "";
  setEditSubtaskError('');
  renderEditSubtasks();
}

/**
 * Deletes edit subtask.
 * @param {number} i - Index.
 * @returns {void} Result.
 */
function deleteEditSubtask(i) {
  editSubtasks.splice(i, 1);
  if (window.editingEditSubtaskIndex === i) {
    window.editingEditSubtaskIndex = null;
  } else if (typeof window.editingEditSubtaskIndex === "number" && i < window.editingEditSubtaskIndex) {
    window.editingEditSubtaskIndex -= 1;
  }
  renderEditSubtasks();
}

/**
 * Clears edit subtask input.
 * @returns {void} Result.
 */
function clearEditSubtaskInput() {
  const input = document.getElementById("edit-subtask-input");
  if (!input) return;
  input.value = "";
  input.focus();
  setEditSubtaskError('');
}

/**
 * Executes edit edit subtask logic.
 * @param {number} i - Index.
 * @returns {void} Result.
 */
function editEditSubtask(i) {
  window.editingEditSubtaskIndex = i;
  renderEditSubtasks();
  const input = document.getElementById(`edit-subtask-edit-${i}`);
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}

/**
 * Saves edited edit subtask.
 * @param {number} i - Index.
 * @returns {void} Result.
 */
function saveEditedEditSubtask(i) {
  const input = document.getElementById(`edit-subtask-edit-${i}`);
  if (!input) return;
  const value = input.value.trim();
  if (!value) {
    setEditSubtaskError('Subtasks must not be empty.', input);
    return;
  }
  editSubtasks[i].title = value;
  window.editingEditSubtaskIndex = null;
  renderEditSubtasks();
  setEditSubtaskError('');
}

/**
 * Sets edit subtask error message.
 * @param {string} message - Message text.
 * @param {HTMLElement} [inputEl] - Optional input to highlight.
 * @returns {void} Result.
 */
function setEditSubtaskError(message, inputEl) {
  const errorEl = document.getElementById('edit-subtask-error');
  if (errorEl) {
    errorEl.textContent = message || '';
  }
  const input = inputEl || document.getElementById('edit-subtask-input');
  if (input) {
    if (message) {
      input.classList.add('input-error');
    } else {
      input.classList.remove('input-error');
    }
  }
}

/**
 * Saves edited task.
 * @param {Event} event - Browser event.
 * @param {string} id - Identifier.
 * @returns {Promise<*>} Result.
 */
async function saveEditedTask(event, id) {
  event.preventDefault();
  if (!validateEditForm()) return;
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  updateTaskFromEditForm(task);
  await updateTask(task);
  renderBoard();
  openModal(id);
}

/**
 * Updates task from edit form.
 * @param {Object} task - Task object.
 * @returns {void} Result.
 */
function updateTaskFromEditForm(task) {
  const titleEl = document.getElementById("edit-title");
  const descEl = document.getElementById("edit-description");
  task.title = titleEl ? titleEl.value.trim() : "";
  task.description = descEl ? descEl.value.trim() : "";
  task.dueDate = document.getElementById("edit-date").value;
  task.category = document.getElementById("edit-category").value;
  task.priority = document.querySelector('input[name="edit-priority"]:checked').value;
  task.contacts = [...selectedContacts];
  task.subtasks = editSubtasks.map(st => ({ ...st }));
}
