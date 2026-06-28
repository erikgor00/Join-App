function getAddTaskFooterMarkup(config) {
  return /*html*/ `
    <div class="form-footer">
      <p class="note note-outside"><span class="req">*</span>This field is required</p>
      <div class="actions">
        <button type="reset" class="clear" onclick="${config.clearOnClick}" form="add-task-form">${config.clearLabel}</button>
        <button type="submit" id="create-task-btn" class="create" form="add-task-form">Create Task <img src="assets/icons/vector-5.svg" alt=""></button>
      </div>
    </div>
  `;
}

/**
 * Generates add category options.
 * @returns {string} Result.
 */
/**
 * Generate Add Category Options.
 * @returns {any} Result value.
 */
function generateAddCategoryOptions() {
  const categories = ["Technical Task", "User Story"];
  return categories.map((cat) => /*html*/ `
    <div class="dropdown-item" onclick="setAddCategory('${cat}')">
      <span class="dropdown-name">${cat}</span>
    </div>
  `).join("");
}

/**
 * Generates subtasks.
 * @param {number} i - Index.
 * @returns {string} Result.
 */
/**
 * Generate Subtasks.
 * @param {number} i - i.
 * @returns {any} Result value.
 */
function generateSubtasks(i) {
  return isEditingSubtask(i) ? getSubtaskEditItem(i) : getSubtaskItem(i);
}

/**
 * Checks whether editing subtask.
 * @param {number} i - Index.
 * @returns {string} Result.
 */
/**
 * Is Editing Subtask.
 * @param {number} i - i.
 * @returns {boolean} Result value.
 */
function isEditingSubtask(i) {
  return window.editingSubtaskIndex === i;
}

/**
 * Returns subtask edit item.
 * @param {number} i - Index.
 * @returns {string} Result.
 */
/**
 * Get Subtask Edit Item.
 * @param {number} i - i.
 * @returns {any} Result value.
 */
function getSubtaskEditItem(i) {
  return /*html*/ `
    <li class="subtask subtask-edit">
      ${getSubtaskEditInputMarkup(i)}
      ${getSubtaskEditActionsMarkup(i)}
    </li>
  `;
}

/**
 * Returns subtask edit input markup.
 * @param {number} i - Index.
 * @returns {string} Result.
 */
/**
 * Get Subtask Edit Input Markup.
 * @param {number} i - i.
 * @returns {any} Result value.
 */
function getSubtaskEditInputMarkup(i) {
  return /*html*/ `
      <input type="text" id="subtask-edit-${i}" class="subtask-edit-input" value="${subtasks[i].title}" pattern=".*\\S.*" placeholder="Edit subtask">
  `;
}

/**
 * Returns subtask edit actions markup.
 * @param {number} i - Index.
 * @returns {string} Result.
 */
/**
 * Get Subtask Edit Actions Markup.
 * @param {number} i - i.
 * @returns {any} Result value.
 */
function getSubtaskEditActionsMarkup(i) {
  return /*html*/ `
      <div class="subtask-input-actions">
        <button type="button" class="subtask-icon-btn" onclick="deleteSubtask(${i})" aria-label="Delete subtask"><img src="./assets/icons/delete.svg" alt=""></button>
        <div class="subtask-input-separator"></div>
        <button type="button" class="subtask-icon-btn" onclick="saveEditedSubtask(${i})" aria-label="Save subtask"><img src="./assets/icons/checkmark.svg" alt=""></button>
      </div>
  `;
}

/**
 * Returns subtask item.
 * @param {number} i - Index.
 * @returns {string} Result.
 */
/**
 * Get Subtask Item.
 * @param {number} i - i.
 * @returns {any} Result value.
 */
function getSubtaskItem(i) {
  return /*html*/ `
    <li class="subtask">
      <span>${subtasks[i].title}</span>
      <div class="subtask-actions">
        <img src="./assets/icons/edit.svg" alt="Edit" onclick="editSubtask(${i})">
        <div class="action-separator"></div>
        <img src="./assets/icons/delete.svg" alt="Delete" onclick="deleteSubtask(${i})">
      </div>
    </li>
  `;
}

/**
 * Generates assigned contacts.
 * @param {*} contacts - Parameter.
 * @returns {string} Result.
 */
/**
 * Generate Assigned Contacts.
 * @param {Array} contacts - contacts.
 * @returns {any} Result value.
 */
function generateAssignedContacts(contacts) {
  return contacts.map((contact, i) => generateAssignedContact(contact, i)).join("");
}

/**
 * Generates assigned contact.
 * @param {Object} contact - Contact.
 * @param {number} i - Index.
 * @returns {string} Result.
 */
/**
 * Generate Assigned Contact.
 * @param {Object} contact - contact.
 * @param {number} i - i.
 * @returns {any} Result value.
 */
function generateAssignedContact(contact, i) {
  const view = getAssignedContactViewData(contact, i);
  return /*html*/ `
      <label class="dropdown-item">
        <div class="contact-info">
          <div class="dropdown-avatar ${view.colorClass}">${view.initials}</div>
          <span class="dropdown-name">${contact.name}</span>
        </div>
        ${getAssignedContactCheckboxMarkup(contact.name, view.checkboxId, view.isChecked)}
      </label>
  `;
}

/**
 * Returns assigned contact view data.
 * @param {Object} contact - Contact.
 * @param {number} i - Index.
 * @returns {Object} Result.
 */
/**
 * Get Assigned Contact View Data.
 * @param {Object} contact - contact.
 * @param {number} i - i.
 * @returns {any} Result value.
 */
function getAssignedContactViewData(contact, i) {
  return {
    isChecked: selectedContacts.includes(contact.name),
    checkboxId: `contact-${i}`,
    initials: getContactInitialsFromName(contact.name),
    colorClass: getAssignedContactColorClass(contact.name)
  };
}

/**
 * Returns assigned contact color class.
 * @param {string} name - Contact name.
 * @returns {string} Result.
 */
/**
 * Get Assigned Contact Color Class.
 * @param {string} name - name.
 * @returns {any} Result value.
 */
function getAssignedContactColorClass(name) {
  return typeof getContactColorClass === 'function' ? getContactColorClass(name) : '';
}

/**
 * Returns assigned contact checkbox markup.
 * @param {string} name - Contact name.
 * @param {string} checkboxId - Checkbox identifier.
 * @param {boolean} isChecked - Checked state.
 * @returns {string} Result.
 */
/**
 * Get Assigned Contact Checkbox Markup.
 * @param {string} name - name.
 * @param {HTMLElement} checkboxId - checkbox id.
 * @param {boolean} isChecked - is checked.
 * @returns {any} Result value.
 */
function getAssignedContactCheckboxMarkup(name, checkboxId, isChecked) {
  return /*html*/ `
        <input type="checkbox" id="${checkboxId}" value="${name}" class="contact-checkbox" onchange="toggleContactSelection('${name}', this)" ${isChecked ? "checked" : ""} >
  `;
}

/**
 * Generates task from form.
 * @returns {string} Result.
 */
/**
 * Generate Task From Form.
 * @returns {any} Result value.
 */
function generateTaskFromForm() {
  const fields = getTaskFormFieldValues();
  return {
    id: Date.now(),
    title: fields.title,
    description: fields.description,
    dueDate: fields.dueDate,
    priority: fields.priority,
    contacts: [...selectedContacts],
    category: fields.category,
    subtasks: [...subtasks],
    status: "To Do",
  };
}

/**
 * Returns task form field values.
 * @returns {Object} Result.
 */
/**
 * Get Task Form Field Values.
 * @returns {any} Result value.
 */
function getTaskFormFieldValues() {
  return {
    title: getTrimmedInputValue('title'),
    description: getTrimmedInputValue('description'),
    dueDate: getTrimmedInputValue('date'),
    priority: document.querySelector('input[name="priority"]:checked').value,
    category: getTrimmedInputValue('category')
  };
}

/**
 * Returns a trimmed input value.
 * @param {string} id - Input identifier.
 * @returns {string} Result.
 */
/**
 * Get Trimmed Input Value.
 * @param {string} id - id.
 * @returns {any} Result value.
 */
function getTrimmedInputValue(id) {
  return document.getElementById(id).value.trim();
}

/**
 * Returns selected avatar markup.
 * @param {*} initials - Parameter.
 * @returns {string} Result.
 */
/**
 * Get Selected Avatar Markup.
 * @param {string} initials - initials.
 * @param {string} colorClass - color class.
 * @returns {any} Result value.
 */
function getSelectedAvatarMarkup(initials, colorClass = '') {
  const cls = colorClass ? `avatar ${colorClass}` : 'avatar';
  return `<div class="${cls}">${initials}</div>`;
}

/**
 * Returns selected avatar +x markup.
 * @param {number} count - Remaining count.
 * @returns {string} Result.
 */
/**
 * Get Selected Avatar More Markup.
 * @param {number} count - count.
 * @returns {any} Result value.
 */
function getSelectedAvatarMoreMarkup(count) {
  return `<div class="avatar avatar-more">+${count}</div>`;
}
