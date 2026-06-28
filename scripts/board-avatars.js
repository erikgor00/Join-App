/**
 * Renders all avatars.
 * @returns {void} Result.
 */
/**
 * Render All Avatars.
 * @returns {void} Nothing.
 */
function renderAllAvatars() {
  const filteredTasks = getFilteredTasks();
  for (let i = 0; i < filteredTasks.length; i++) {
    renderAvatar(filteredTasks[i]);
  }
}

/**
 * Renders avatar.
 * @param {Object} task - Task object.
 * @returns {void} Result.
 */
/**
 * Render Avatar.
 * @param {Object} task - task.
 * @returns {void} Nothing.
 */
function renderAvatar(task) {
  let container = document.getElementById(`avatars-${task.id}`);
  if (!container) return;
  container.innerHTML = "";
  const contacts = getTaskAvatarContacts(task);
  const maxVisible = 3;
  const visible = contacts.slice(0, maxVisible);
  renderVisibleTaskAvatars(container, visible);
  renderRemainingTaskAvatar(container, contacts.length, maxVisible);
}

/**
 * Returns task avatar contacts.
 * @param {Object} task - Task object.
 * @returns {Array<string>} Result.
 */
/**
 * Get Task Avatar Contacts.
 * @param {Object} task - task.
 * @returns {any} Result value.
 */
function getTaskAvatarContacts(task) {
  return Array.isArray(task.contacts) ? task.contacts : [];
}

/**
 * Renders visible task avatars.
 * @param {HTMLElement} container - Avatar container.
 * @param {Array<string>} visible - Visible contacts.
 * @returns {void} Result.
 */
/**
 * Render Visible Task Avatars.
 * @param {HTMLElement} container - container.
 * @param {boolean} visible - visible.
 * @returns {void} Nothing.
 */
function renderVisibleTaskAvatars(container, visible) {
  for (let i = 0; i < visible.length; i++) {
    appendTaskAvatar(container, visible[i]);
  }
}

/**
 * Appends task avatar.
 * @param {HTMLElement} container - Avatar container.
 * @param {string} name - Contact name.
 * @returns {void} Result.
 */
/**
 * Append Task Avatar.
 * @param {HTMLElement} container - container.
 * @param {string} name - name.
 * @returns {void} Nothing.
 */
function appendTaskAvatar(container, name) {
  if (!name) return;
  const initials = getContactInitialsFromName(name);
  container.innerHTML += getAvatarMarkup(initials, getRandomColor());
}

/**
 * Renders remaining task avatar count.
 * @param {HTMLElement} container - Avatar container.
 * @param {number} total - Total contacts.
 * @param {number} maxVisible - Max visible count.
 * @returns {void} Result.
 */
/**
 * Render Remaining Task Avatar.
 * @param {HTMLElement} container - container.
 * @param {any} total - total.
 * @param {boolean} maxVisible - max visible.
 * @returns {void} Nothing.
 */
function renderRemainingTaskAvatar(container, total, maxVisible) {
  if (total <= maxVisible) return;
  container.innerHTML += getAvatarMarkup(`+${total - maxVisible}`, "#2a3647", true);
}

/**
 * Returns random color.
 * @returns {*} Result.
 */
/**
 * Get Random Color.
 * @returns {any} Result value.
 */
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}
