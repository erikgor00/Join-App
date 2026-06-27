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
async function saveToArray(event) {
  event.preventDefault();
  if (!validateForm()) return;
  const task = generateTaskFromForm();
  const result = await saveTask(task);
  if (result) {
    handleSaveSuccess();
    return;
  }
  handleSaveFailure();
}

/**
 * Executes handle save success logic.
 * @returns {void} Result.
 */
/**
 * Handle Save Success.
 * @returns {void} Nothing.
 */
function handleSaveSuccess() {
  setAddTaskActionButtonsDisabled(true);
    showMessage("Task added to board", "success", {
      iconSrc: "./assets/icons/vector-board.svg",
      iconAlt: "Board"
    });
  subtasks.length = 0;
  selectedContacts.length = 0;
  showSubtasks();
  document.getElementById('add-task-form').reset();
  setTimeout(() => { window.location.href = "board.html"; }, 1500);
}

/**
 * Executes handle save failure logic.
 * @returns {void} Result.
 */
/**
 * Handle Save Failure.
 * @returns {void} Nothing.
 */
function handleSaveFailure() {
  showMessage("Task could not be saved", "error");
}

/**
 * Enables or disables add-task action buttons.
 * @param {boolean} disabled - Whether buttons should be disabled.
 * @returns {void} Result.
 */
/**
 * Set Add Task Action Buttons Disabled.
 * @param {boolean} disabled - disabled.
 * @returns {void} Nothing.
 */
function setAddTaskActionButtonsDisabled(disabled) {
  const buttons = document.querySelectorAll('#add-task-form ~ .form-footer .clear, #add-task-form ~ .form-footer .create, .actions .clear[form="add-task-form"], .actions .create[form="add-task-form"]');
  buttons.forEach((button) => {
    button.disabled = !!disabled;
    button.setAttribute('aria-disabled', disabled ? 'true' : 'false');
  });
}

/**
 * Saves task.
 * @param {Object} task - Task object.
 * @returns {Promise<*>} Result.
 */
/**
 * Save Task.
 * @param {Object} task - task.
 * @returns {Promise<void>} Result value.
 */
async function saveTask(task) {
  try {
    const response = await fetch(`${BASE_URL}/tasks.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Speichern des Tasks:", error);
  }
}

/**
 * Executes select contacts logic.
 * @returns {void} Result.
 */
/**
 * Select Contacts.
 * @returns {any} Result value.
 */
function selectContacts() {
  let select = document.getElementById('dropdown-contacts');
  select.innerHTML = generateAssignedContacts(contacts);
}

/**
 * Toggles dropdown.
 * @param {Event} event - Browser event.
 * @returns {void} Result.
 */
/**
 * Toggle Dropdown.
 * @param {Event} event - event.
 * @returns {void} Nothing.
 */
function toggleDropdown(event) {
  stopDropdownEventPropagation(event);
  const dropdown = getTriggeredDropdown(event);
  closeOtherDropdowns(dropdown);
  if (dropdown) {
    dropdown.classList.toggle("show");
    return;
  }
  toggleFallbackContactsDropdown();
}

/**
 * Stops dropdown event propagation.
 * @param {Event} event - Browser event.
 * @returns {void} Result.
 */
/**
 * Stop Dropdown Event Propagation.
 * @param {Event} event - event.
 * @returns {void} Nothing.
 */
function stopDropdownEventPropagation(event) {
  if (event) event.stopPropagation();
}

/**
 * Returns dropdown triggered by event.
 * @param {Event} event - Browser event.
 * @returns {HTMLElement|undefined} Result.
 */
/**
 * Get Triggered Dropdown.
 * @param {Event} event - event.
 * @returns {any} Result value.
 */
function getTriggeredDropdown(event) {
  const trigger = event?.currentTarget || event?.target;
  const select = trigger?.closest?.(".custom-select");
  return select?.querySelector?.(".dropdown-content");
}

/**
 * Closes dropdowns except the active one.
 * @param {HTMLElement} dropdown - Active dropdown.
 * @returns {void} Result.
 */
/**
 * Close Other Dropdowns.
 * @param {any} dropdown - dropdown.
 * @returns {void} Nothing.
 */
function closeOtherDropdowns(dropdown) {
  const allDropdowns = document.querySelectorAll(".dropdown-content.show");
  allDropdowns.forEach((d) => closeDropdownIfDifferent(d, dropdown));
}

/**
 * Closes dropdown if it is not the active one.
 * @param {HTMLElement} dropdown - Dropdown element.
 * @param {HTMLElement} activeDropdown - Active dropdown.
 * @returns {void} Result.
 */
/**
 * Close Dropdown If Different.
 * @param {any} dropdown - dropdown.
 * @param {boolean} activeDropdown - active dropdown.
 * @returns {void} Nothing.
 */
function closeDropdownIfDifferent(dropdown, activeDropdown) {
  if (dropdown !== activeDropdown) dropdown.classList.remove("show");
}

/**
 * Toggles fallback contacts dropdown.
 * @returns {void} Result.
 */
/**
 * Toggle Fallback Contacts Dropdown.
 * @returns {void} Nothing.
 */
function toggleFallbackContactsDropdown() {
  const fallback = document.getElementById("dropdown-contacts");
  if (fallback) fallback.classList.toggle("show");
}

/**
 * Toggles add category dropdown.
 * @param {Event} event - Browser event.
 * @returns {void} Result.
 */
/**
 * Toggle Add Category Dropdown.
 * @param {Event} event - event.
 * @returns {void} Nothing.
 */
function toggleAddCategoryDropdown(event) {
  event.stopPropagation();
  // Close other dropdowns first
  const contactsDropdown = document.getElementById("dropdown-contacts");
  if (contactsDropdown) contactsDropdown.classList.remove("show");
  
  const dropdown = document.getElementById("category-dropdown");
  if (!dropdown) return;
  dropdown.classList.toggle("show");
}

/**
 * Sets add category.
 * @param {string} value - Value.
 * @returns {void} Result.
 */
/**
 * Set Add Category.
 * @param {string} value - value.
 * @returns {void} Nothing.
 */
function setAddCategory(value) {
  const input = document.getElementById("category");
  const select = document.getElementById("category-select");
  if (!input || !select) return;
  input.value = value;
  input.classList.remove('input-error');
  select.classList.remove('input-error');
  setErrorText('category-error', '');
  updateAddCategoryLabel(select, value);
  closeAddCategoryDropdown();
  updateCreateButtonState();
}

/**
 * Updates add category label.
 * @param {*} select - Parameter.
 * @param {string} value - Value.
 * @returns {void} Result.
 */
/**
 * Update Add Category Label.
 * @param {HTMLElement} select - select.
 * @param {string} value - value.
 * @returns {void} Nothing.
 */
function updateAddCategoryLabel(select, value) {
  const label = select.querySelector("span");
  if (label) {
    label.childNodes[0].textContent = value + " ";
  }
}

/**
 * Closes add category dropdown.
 * @returns {void} Result.
 */
/**
 * Close Add Category Dropdown.
 * @returns {void} Nothing.
 */
function closeAddCategoryDropdown() {
  const dropdown = document.getElementById("category-dropdown");
  if (dropdown) dropdown.classList.remove("show");
}

/**
 * Initializes add dropdown close.
 * @returns {void} Result.
 */
/**
 * Init Add Dropdown Close.
 * @returns {void} Nothing.
 */
function initAddDropdownClose() {
  if (window.addDropdownHandlerAdded) return;
  window.addDropdownHandlerAdded = true;
  document.addEventListener("click", handleAddDropdownDocumentClick, true);
}

/**
 * Handles document clicks for add dropdowns.
 * @param {Event} event - Browser event.
 * @returns {void} Result.
 */
/**
 * Handle Add Dropdown Document Click.
 * @param {Event} event - event.
 * @returns {void} Nothing.
 */
function handleAddDropdownDocumentClick(event) {
  if (isClickInsideAddDropdown(event.target)) return;
  closeAddDropdowns();
}

/**
 * Returns whether target is inside add dropdowns.
 * @param {HTMLElement} target - Click target.
 * @returns {boolean} Result.
 */
/**
 * Is Click Inside Add Dropdown.
 * @param {HTMLElement} target - target.
 * @returns {boolean} Result value.
 */
function isClickInsideAddDropdown(target) {
  return getAddDropdownContainers().some((container) => {
    return container && container.contains(target);
  });
}

/**
 * Returns add dropdown containers.
 * @returns {Array<HTMLElement>} Result.
 */
/**
 * Get Add Dropdown Containers.
 * @returns {any} Result value.
 */
function getAddDropdownContainers() {
  return [
    document.getElementById("select-contacts"),
    document.getElementById("dropdown-contacts"),
    document.getElementById("category-select"),
    document.getElementById("category-dropdown")
  ];
}

/**
 * Closes add dropdowns.
 * @returns {void} Result.
 */
/**
 * Close Add Dropdowns.
 * @returns {void} Nothing.
 */
function closeAddDropdowns() {
  const contactsDropdown = document.getElementById("dropdown-contacts");
  if (contactsDropdown) contactsDropdown.classList.remove("show");
  const categoryDropdown = document.getElementById("category-dropdown");
  if (categoryDropdown) categoryDropdown.classList.remove("show");
}

/**
 * Toggles contact selection.
 * @param {string} name - Name.
 * @param {HTMLInputElement} checkbox - Checkbox element.
 * @returns {void} Result.
 */
/**
 * Toggle Contact Selection.
 * @param {string} name - name.
 * @param {HTMLElement} checkbox - checkbox.
 * @returns {void} Nothing.
 */
function toggleContactSelection(name, checkbox) {
  if (checkbox.checked) {
    selectedContacts.push(name);
  } else {
    selectedContacts = selectedContacts.filter(c => c !== name);
  }
  renderSelectedAvatars();
}

/**
 * Renders selected avatars.
 * @returns {void} Result.
 */
/**
 * Render Selected Avatars.
 * @returns {void} Nothing.
 */
function renderSelectedAvatars() {
  const container = document.getElementById("selected-avatars");
  const assignedBlock = document.querySelector('.assigned-to-label');
  if (assignedBlock) {
    assignedBlock.classList.toggle('has-avatars', selectedContacts.length > 0);
  }
  container.innerHTML = "";
  const maxVisible = 4;
  const total = selectedContacts.length;
  const visible = selectedContacts.slice(0, maxVisible);
  visible.forEach(name => appendSelectedAvatar(container, name));
  if (total > maxVisible) {
    container.innerHTML += getSelectedAvatarMoreMarkup(total - maxVisible);
  }
}

/**
 * Executes append selected avatar logic.
 * @param {HTMLElement} container - Container element.
 * @param {string} name - Name.
 * @returns {void} Result.
 */
/**
 * Append Selected Avatar.
 * @param {HTMLElement} container - container.
 * @param {string} name - name.
 * @returns {void} Nothing.
 */
function appendSelectedAvatar(container, name) {
  const initials = getContactInitialsFromName(name);
  const colorClass = getContactColorClass(name);
  container.innerHTML += getSelectedAvatarMarkup(initials, colorClass);
}

/**
 * Returns contact color class based on name.
 * @param {string} name - Contact name.
 * @returns {string} Result.
 */
/**
 * Get Contact Color Class.
 * @param {string} name - name.
 * @returns {any} Result value.
 */
function getContactColorClass(name) {
  const key = String(name || '').trim().toLowerCase();
  const index = getContactColorIndex(key);
  return CONTACT_COLOR_CLASSES[index];
}

const CONTACT_COLOR_CLASSES = [
    'bg-blue',
    'bg-green',
    'bg-purple',
    'bg-orange',
    'bg-pink',
    'bg-red',
    'bg-teal',
    'bg-brown'
];

/**
 * Returns contact color index.
 * @param {string} key - Contact name key.
 * @returns {number} Result.
 */
/**
 * Get Contact Color Index.
 * @param {string} key - key.
 * @returns {any} Result value.
 */
function getContactColorIndex(key) {
  if (!key) return 0;
  return Math.abs(getContactNameHash(key)) % CONTACT_COLOR_CLASSES.length;
}

/**
 * Returns contact name hash.
 * @param {string} key - Contact name key.
 * @returns {number} Result.
 */
/**
 * Get Contact Name Hash.
 * @param {string} key - key.
 * @returns {any} Result value.
 */
function getContactNameHash(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % 2147483647;
  }
  return hash;
}

/**
 * Clears form.
 * @returns {void} Result.
 */
/**
 * Clear Form.
 * @returns {void} Nothing.
 */
function clearForm() {
  const form = document.getElementById('add-task-form');
  if (form) form.reset();
  clearValidationErrors();
  clearSubtaskErrorIfAvailable();
  clearAddTaskInputErrors();
  resetAddTaskCategorySelection();
  uncheckAssignedContactInputs();
  resetAddTaskContactSelection();
  resetAddTaskSubtasks();
  showSubtasks();
  updateCreateButtonState();
}

/**
 * Clears subtask error if helper exists.
 * @returns {void} Result.
 */
/**
 * Clear Subtask Error If Available.
 * @returns {void} Nothing.
 */
function clearSubtaskErrorIfAvailable() {
  if (typeof setSubtaskError === 'function') setSubtaskError('');
}

/**
 * Clears add-task input error states.
 * @returns {void} Result.
 */
/**
 * Clear Add Task Input Errors.
 * @returns {void} Nothing.
 */
function clearAddTaskInputErrors() {
  getAddTaskErrorElements().forEach((el) => el?.classList.remove('input-error'));
}

/**
 * Returns add-task error elements.
 * @returns {Array<HTMLElement>} Result.
 */
/**
 * Get Add Task Error Elements.
 * @returns {any} Result value.
 */
function getAddTaskErrorElements() {
  return [
    document.getElementById('title'),
    document.getElementById('date'),
    document.getElementById('category'),
    document.getElementById('category-select')
  ];
}

/**
 * Resets add-task category selection.
 * @returns {void} Result.
 */
/**
 * Reset Add Task Category Selection.
 * @returns {void} Nothing.
 */
function resetAddTaskCategorySelection() {
  const categoryInput = document.getElementById('category');
  const categorySelect = document.getElementById('category-select');
  if (categoryInput) categoryInput.value = '';
  resetAddTaskCategoryLabel(categorySelect);
}

/**
 * Resets add-task category label.
 * @param {HTMLElement} categorySelect - Category select element.
 * @returns {void} Result.
 */
/**
 * Reset Add Task Category Label.
 * @param {HTMLElement} categorySelect - category select.
 * @returns {void} Nothing.
 */
function resetAddTaskCategoryLabel(categorySelect) {
  const label = categorySelect?.querySelector('span');
  if (label) label.childNodes[0].textContent = 'Select task category ';
}

/**
 * Unchecks assigned contact inputs.
 * @returns {void} Result.
 */
/**
 * Uncheck Assigned Contact Inputs.
 * @returns {void} Nothing.
 */
function uncheckAssignedContactInputs() {
  const dropdown = document.getElementById('dropdown-contacts');
  if (!dropdown) return;
  dropdown.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
}

/**
 * Resets selected add-task contacts.
 * @returns {void} Result.
 */
/**
 * Reset Add Task Contact Selection.
 * @returns {void} Nothing.
 */
function resetAddTaskContactSelection() {
  selectedContacts = [];
  renderSelectedAvatars();
}

/**
 * Resets add-task subtasks.
 * @returns {void} Result.
 */
/**
 * Reset Add Task Subtasks.
 * @returns {void} Nothing.
 */
function resetAddTaskSubtasks() {
  if (Array.isArray(subtasks)) subtasks.length = 0;
}
