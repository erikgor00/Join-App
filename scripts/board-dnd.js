/**
 * Executes start drag logic.
 * @param {DragEvent} event - Drag event.
 * @param {string} id - Identifier.
 * @param {HTMLElement} cardElement - Dragged card element.
 * @returns {void} Result.
 */
function startDrag(event, id, cardElement) {
  draggedTaskId = id;
  clearDropHighlight();
  if (cardElement) {
    cardElement.classList.add("is-dragging");
  }
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
  }
}

/**
 * Handles drag end state reset.
 * @param {HTMLElement} cardElement - Dragged card element.
 * @returns {void} Result.
 */
function endDrag(cardElement) {
  if (cardElement) {
    cardElement.classList.remove("is-dragging");
  }
  clearDropHighlight();
}

/**
 * Executes allow drop logic.
 * @param {Event} event - Browser event.
 * @returns {void} Result.
 */
function allowDrop(event) {
  event.preventDefault();
  if (isDesktopDragDevice()) {
    setDropHighlight(event.currentTarget);
  }
}

/**
 * Executes drop task logic.
 * @param {Event} event - Browser event.
 * @param {*} newStatus - Parameter.
 * @returns {void} Result.
 */
function dropTask(event, newStatus) {
  event.preventDefault();
  clearDropHighlight();
  const task = tasks.find(t => t.id === draggedTaskId);
  if (!task) return;
  task.status = newStatus;
  updateTask(task);
  renderBoard();
}

/**
 * Highlights current drop column on desktop while dragging.
 * @param {HTMLElement|null} columnElement - Current column element.
 * @returns {void} Result.
 */
function setDropHighlight(columnElement) {
  const columns = document.querySelectorAll(".board-column");
  columns.forEach((column) => {
    column.classList.toggle("drop-target-highlight", column === columnElement);
  });
}

/**
 * Clears drop highlight from all columns.
 * @returns {void} Result.
 */
function clearDropHighlight() {
  const highlighted = document.querySelectorAll(".board-column.drop-target-highlight");
  highlighted.forEach((column) => column.classList.remove("drop-target-highlight"));
}

/**
 * Detects whether a desktop-like pointer setup is available.
 * @returns {boolean} True for desktop pointer/hover setups.
 */
function isDesktopDragDevice() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/* ── Mobile Move Menu ─────────────────────────────────────── */

const MOVE_STATUS_ORDER = ["To Do", "In Progress", "Await Feedback", "Done"];
const MOVE_STATUS_LABELS = {
  "To Do": "To-do",
  "In Progress": "In Progress",
  "Await Feedback": "Review",
  "Done": "Done"
};

let activeMoveMenuCard = null;

/**
 * Returns adjacent status targets for the mobile move menu.
 * @param {Object} task - Task object.
 * @returns {string} HTML string of option buttons.
 */
function buildMoveMenuOptionsHTML(task) {
  const idx = MOVE_STATUS_ORDER.indexOf(task.status);
  let html = "";
  if (idx > 0) {
    const prev = MOVE_STATUS_ORDER[idx - 1];
    html += `<button type="button" class="task-move-mobile-option" onclick="moveTaskMobile(event,${task.id},'${prev}')">` +
            `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M5.49 2.83333L1.40667 6.91667C1.24 7.08333 1.04556 7.16319 0.823333 7.15625C0.601111 7.14931 0.406667 7.0625 0.24 6.89583C0.0872222 6.72917 0.00736111 6.53472 0.000416667 6.3125C-0.00652778 6.09028 0.0733333 5.89583 0.24 5.72917L5.74 0.229167C5.82333 0.145833 5.91361 0.0868056 6.01083 0.0520833C6.10806 0.0173611 6.21222 0 6.32333 0C6.43444 0 6.53861 0.0173611 6.63583 0.0520833C6.73306 0.0868056 6.82333 0.145833 6.90667 0.229167L12.4067 5.72917C12.5594 5.88194 12.6358 6.07292 12.6358 6.30208C12.6358 6.53125 12.5594 6.72917 12.4067 6.89583C12.24 7.0625 12.0421 7.14583 11.8129 7.14583C11.5838 7.14583 11.3858 7.0625 11.2192 6.89583L7.15667 2.83333V12.1458C7.15667 12.3819 7.07681 12.5799 6.91708 12.7396C6.75736 12.8993 6.55944 12.9792 6.32333 12.9792C6.08722 12.9792 5.88931 12.8993 5.72958 12.7396C5.56986 12.5799 5.49 12.3819 5.49 12.1458V2.83333Z" fill="white"/></svg>` +
            `<span>${MOVE_STATUS_LABELS[prev]}</span></button>`;
  }
  if (idx >= 0 && idx < MOVE_STATUS_ORDER.length - 1) {
    const next = MOVE_STATUS_ORDER[idx + 1];
    html += `<button type="button" class="task-move-mobile-option" onclick="moveTaskMobile(event,${task.id},'${next}')">` +
            `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M5.47917 10.1458V0.833333C5.47917 0.597222 5.55903 0.399306 5.71875 0.239583C5.87847 0.0798611 6.07639 0 6.3125 0C6.54861 0 6.74653 0.0798611 6.90625 0.239583C7.06597 0.399306 7.14583 0.597222 7.14583 0.833333V10.1458L11.2292 6.0625C11.3958 5.89583 11.5903 5.81597 11.8125 5.82292C12.0347 5.82986 12.2292 5.91667 12.3958 6.08333C12.5486 6.25 12.6285 6.44444 12.6354 6.66667C12.6424 6.88889 12.5625 7.08333 12.3958 7.25L6.89583 12.75C6.8125 12.8333 6.72222 12.8924 6.625 12.9271C6.52778 12.9618 6.42361 12.9792 6.3125 12.9792C6.20139 12.9792 6.09722 12.9618 6 12.9271C5.90278 12.8924 5.8125 12.8333 5.72917 12.75L0.229167 7.25C0.0763889 7.09722 0 6.90625 0 6.67708C0 6.44792 0.0763889 6.25 0.229167 6.08333C0.395833 5.91667 0.59375 5.83333 0.822917 5.83333C1.05208 5.83333 1.25 5.91667 1.41667 6.08333L5.47917 10.1458Z" fill="white"/></svg>` +
            `<span>${MOVE_STATUS_LABELS[next]}</span></button>`;
  }
  return html;
}

/**
 * Closes the currently open mobile move menu.
 * @returns {void} Result.
 */
function closeMoveMenu() {
  if (activeMoveMenuCard) {
    activeMoveMenuCard.classList.remove("task-move-menu-open");
    activeMoveMenuCard = null;
  }
}

/**
 * Toggles the mobile move menu on the clicked task card.
 * @param {Event} event - Browser event.
 * @returns {void} Result.
 */
function toggleTaskMoveMenu(event) {
  event.stopPropagation();
  const card = event.currentTarget.closest(".task-card");
  if (!card) return;
  if (activeMoveMenuCard === card) {
    closeMoveMenu();
    return;
  }
  closeMoveMenu();
  activeMoveMenuCard = card;
  card.classList.add("task-move-menu-open");
}

/**
 * Moves a task to a new status from the mobile menu.
 * @param {Event} event - Browser event.
 * @param {number|string} taskId - Task id.
 * @param {string} newStatus - Target status.
 * @returns {Promise<void>} Result.
 */
async function moveTaskMobile(event, taskId, newStatus) {
  event.stopPropagation();
  closeMoveMenu();
  const task = tasks.find(t => String(t.id) === String(taskId));
  if (!task || task.status === newStatus) return;
  task.status = newStatus;
  await updateTask(task);
  renderBoard();
}

document.addEventListener("click", function (e) {
  if (!e.target.closest(".task-card.task-move-menu-open")) {
    closeMoveMenu();
  }
});
