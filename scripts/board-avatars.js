/**
 * Renders all avatars.
 * @returns {void} Result.
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
function getTaskAvatarContacts(task) {
  return Array.isArray(task.contacts) ? task.contacts : [];
}

/**
 * Renders visible task avatars.
 * @param {HTMLElement} container - Avatar container.
 * @param {Array<string>} visible - Visible contacts.
 * @returns {void} Result.
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
function renderRemainingTaskAvatar(container, total, maxVisible) {
  if (total <= maxVisible) return;
  container.innerHTML += getAvatarMarkup(`+${total - maxVisible}`, "#2a3647", true);
}

/**
 * Returns random color.
 * @returns {*} Result.
 */
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}
