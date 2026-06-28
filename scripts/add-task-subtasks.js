/**
 * Enables creating a subtask via Enter key.
 * Prevents submitting the main task form.
 * @returns {void} Result.
 */
/**
 * Init Add Subtask Enter.
 * @returns {void} Nothing.
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
/**
 * Is Subtask Enter Handler Registered.
 * @param {HTMLElement} input - input.
 * @returns {boolean} Result value.
 */
function isSubtaskEnterHandlerRegistered(input) {
  return input.dataset && input.dataset.enterHandlerAdded === 'true';
}

/**
 * Marks subtask enter handler as registered.
 * @param {HTMLInputElement} input - Input element.
 * @returns {void} Result.
 */
/**
 * Mark Subtask Enter Handler Registered.
 * @param {HTMLElement} input - input.
 * @returns {void} Nothing.
 */
function markSubtaskEnterHandlerRegistered(input) {
  if (input.dataset) input.dataset.enterHandlerAdded = 'true';
}

/**
 * Clears subtask error on input.
 * @returns {void} Result.
 */
/**
 * Clear Subtask Error On Input.
 * @returns {void} Nothing.
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
/**
 * Handle Subtask Enter Key.
 * @param {Event} event - event.
 * @param {HTMLElement} input - input.
 * @returns {void} Nothing.
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
/**
 * Is Subtask Enter Key.
 * @param {Event} event - event.
 * @returns {boolean} Result value.
 */
function isSubtaskEnterKey(event) {
  return !event.isComposing && event.key === 'Enter' && !event.shiftKey;
}

/**
 * Creates a subtask from input.
 * @param {HTMLInputElement} input - Input element.
 * @returns {void} Result.
 */
/**
 * Create Subtask From Input.
 * @param {HTMLElement} input - input.
 * @returns {any} Result value.
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
/**
 * Push Subtask Value.
 * @param {string} value - value.
 * @returns {void} Nothing.
 */
function pushSubtaskValue(value) {
  subtasks.push({ title: value, done: false });
  showSubtasks();
}

/**
 * Shows subtasks.
 * @returns {void} Result.
 */
/**
 * Show Subtasks.
 * @returns {void} Nothing.
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
/**
 * Render Subtask Items.
 * @param {HTMLElement} subtaskArea - subtask area.
 * @returns {void} Nothing.
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
/**
 * Update Subtask List Visibility.
 * @param {HTMLElement} subtaskArea - subtask area.
 * @returns {void} Nothing.
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
/**
 * Hide Empty Subtask List.
 * @param {HTMLElement} subtaskArea - subtask area.
 * @returns {void} Nothing.
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
/**
 * Show Filled Subtask List.
 * @param {HTMLElement} subtaskArea - subtask area.
 * @returns {void} Nothing.
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
/**
 * Add Subtask.
 * @returns {void} Nothing.
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
/**
 * Clear Subtask Input.
 * @returns {void} Nothing.
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
/**
 * Edit Subtask.
 * @param {number} i - i.
 * @returns {void} Nothing.
 */
function editSubtask(i) {
  setEditingSubtask(i);
}

/**
 * Deletes subtask.
 * @param {number} i - Index.
 * @returns {void} Result.
 */
/**
 * Delete Subtask.
 * @param {number} i - i.
 * @returns {void} Nothing.
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
/**
 * Set Editing Subtask.
 * @param {number} i - i.
 * @returns {void} Nothing.
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
/**
 * Focus Subtask Edit Input.
 * @param {number} i - i.
 * @returns {void} Nothing.
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
/**
 * Cancel Edit Subtask.
 * @returns {boolean} Result value.
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
/**
 * Save Edited Subtask.
 * @param {number} i - i.
 * @returns {void} Nothing.
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
/**
 * Set Subtask Error.
 * @param {string} message - message.
 * @param {HTMLElement} inputEl - input el.
 * @returns {void} Nothing.
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
