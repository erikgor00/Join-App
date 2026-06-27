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
