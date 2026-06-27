/**
 * Enables creating a subtask via Enter key.
 * Prevents submitting the main task form.
 * @returns {void} Result.
 */
function initAddSubtaskEnter() {
  const input = document.getElementById('subtask');
  if (!input) return;
  if (isSubtaskEnterHandlerRegistered(input)) return;
  markSubtaskEnterHandlerRegistered(input);
  input.addEventListener('input', clearSubtaskErrorOnInput);
  input.addEventListener('keydown', (event) => handleSubtaskEnterKey(event, input));
}

/**
 * Returns whether subtask enter handler is registered.
 * @param {HTMLInputElement} input - Input element.
 * @returns {boolean} Result.
 */
function isSubtaskEnterHandlerRegistered(input) {
  return input.dataset && input.dataset.enterHandlerAdded === 'true';
}

/**
 * Marks subtask enter handler as registered.
 * @param {HTMLInputElement} input - Input element.
 * @returns {void} Result.
 */
function markSubtaskEnterHandlerRegistered(input) {
  if (input.dataset) input.dataset.enterHandlerAdded = 'true';
}

/**
 * Clears subtask error on input.
 * @returns {void} Result.
 */
function clearSubtaskErrorOnInput() {
  setSubtaskError('');
}

/**
 * Handles subtask enter key.
 * @param {KeyboardEvent} event - Keyboard event.
 * @param {HTMLInputElement} input - Input element.
 * @returns {void} Result.
 */
function handleSubtaskEnterKey(event, input) {
  if (!isSubtaskEnterKey(event)) return;
  event.preventDefault();
  event.stopPropagation();
  createSubtaskFromInput(input);
}

/**
 * Returns whether event should create a subtask.
 * @param {KeyboardEvent} event - Keyboard event.
 * @returns {boolean} Result.
 */
function isSubtaskEnterKey(event) {
  return !event.isComposing && event.key === 'Enter' && !event.shiftKey;
}

/**
 * Creates a subtask from input.
 * @param {HTMLInputElement} input - Input element.
 * @returns {void} Result.
 */
function createSubtaskFromInput(input) {
  const value = String(input.value || '').trim();
  if (!value) {
    setSubtaskError('Subtasks must not be empty.');
    return;
  }
  pushSubtaskValue(value);
  input.value = '';
  setSubtaskError('');
}

/**
 * Pushes subtask value and refreshes list.
 * @param {string} value - Subtask title.
 * @returns {void} Result.
 */
function pushSubtaskValue(value) {
  subtasks.push({ title: value, done: false });
  showSubtasks();
}

/**
 * Shows subtasks.
 * @returns {void} Result.
 */
function showSubtasks() {
  let subtaskArea = document.getElementById('subtask-area');
  subtaskArea.innerHTML = '';
  renderSubtaskItems(subtaskArea);
  updateSubtaskListVisibility(subtaskArea);
}

/**
 * Renders subtask items.
 * @param {HTMLElement} subtaskArea - Subtask list element.
 * @returns {void} Result.
 */
function renderSubtaskItems(subtaskArea) {
  for (let i = 0; i < subtasks.length; i++) {
    subtaskArea.innerHTML += generateSubtasks(i);
  }
}

/**
 * Updates subtask list visibility.
 * @param {HTMLElement} subtaskArea - Subtask list element.
 * @returns {void} Result.
 */
function updateSubtaskListVisibility(subtaskArea) {
  if (subtasks.length === 0) {
    hideEmptySubtaskList(subtaskArea);
    return;
  }
  showFilledSubtaskList(subtaskArea);
}

/**
 * Hides empty subtask list.
 * @param {HTMLElement} subtaskArea - Subtask list element.
 * @returns {void} Result.
 */
function hideEmptySubtaskList(subtaskArea) {
  subtaskArea.style.display = 'none';
  subtaskArea.style.height = '0';
  subtaskArea.style.minHeight = '0';
  subtaskArea.style.visibility = 'hidden';
}

/**
 * Shows filled subtask list.
 * @param {HTMLElement} subtaskArea - Subtask list element.
 * @returns {void} Result.
 */
function showFilledSubtaskList(subtaskArea) {
  subtaskArea.style.display = '';
  subtaskArea.style.height = '';
  subtaskArea.style.minHeight = '';
  subtaskArea.style.visibility = '';
}

/**
 * Adds subtask.
 * @returns {void} Result.
 */
function addSubtask() {
  const input = document.getElementById('subtask');
  if (!input) return;
  const subtask = String(input.value || '').trim();
  if (subtask) {
    subtasks.push({ title: subtask, done: false });
    showSubtasks();
    input.value = '';
    setSubtaskError('');
  } else {
    setSubtaskError('Subtasks must not be empty.');
  }
}

/**
 * Clears subtask input.
 * @returns {void} Result.
 */
function clearSubtaskInput() {
  const input = document.getElementById('subtask');
  if (input) {
    input.value = '';
    input.focus();
  }
  setSubtaskError('');
}

/**
 * Executes edit subtask logic.
 * @param {number} i - Index.
 * @returns {void} Result.
 */
function editSubtask(i) {
  setEditingSubtask(i);
}

/**
 * Deletes subtask.
 * @param {number} i - Index.
 * @returns {void} Result.
 */
function deleteSubtask(i) {
  subtasks.splice(i, 1);
  if (window.editingSubtaskIndex === i) {
    window.editingSubtaskIndex = null;
  }
  showSubtasks();
}

/**
 * Sets editing subtask.
 * @param {number} i - Index.
 * @returns {void} Result.
 */
function setEditingSubtask(i) {
  window.editingSubtaskIndex = i;
  showSubtasks();
  focusSubtaskEditInput(i);
}

/**
 * Executes focus subtask edit input logic.
 * @param {number} i - Index.
 * @returns {void} Result.
 */
function focusSubtaskEditInput(i) {
  const input = document.getElementById(`subtask-edit-${i}`);
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}

/**
 * Executes cancel edit subtask logic.
 * @returns {void} Result.
 */
function cancelEditSubtask() {
  window.editingSubtaskIndex = null;
  showSubtasks();
  setSubtaskError('');
}

/**
 * Saves edited subtask.
 * @param {number} i - Index.
 * @returns {void} Result.
 */
function saveEditedSubtask(i) {
  const input = document.getElementById(`subtask-edit-${i}`);
  if (!input) return;
  const value = input.value.trim();
  if (!value) {
    setSubtaskError('Subtasks must not be empty.', input);
    return;
  }
  subtasks[i].title = value;
  window.editingSubtaskIndex = null;
  showSubtasks();
  setSubtaskError('');
}

/**
 * Sets subtask error message.
 * @param {string} message - Message text.
 * @param {HTMLElement} [inputEl] - Optional input to highlight.
 * @returns {void} Result.
 */
function setSubtaskError(message, inputEl) {
  const errorEl = document.getElementById('subtask-error');
  if (errorEl) {
    errorEl.textContent = message || '';
  }
  const input = inputEl || document.getElementById('subtask');
  if (input) {
    if (message) {
      input.classList.add('input-error');
    } else {
      input.classList.remove('input-error');
    }
  }
}
