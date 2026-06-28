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

