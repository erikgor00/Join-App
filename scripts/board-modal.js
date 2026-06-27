/**
 * Opens modal.
 * @param {string} id - Identifier.
 * @returns {void} Result.
 */
function openModal(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  activeTask = task;
  removeExistingTaskModal();
  const modal = createTaskModal(task);
  document.body.appendChild(modal);
  modal.style.display = "flex";
  const modalContent = modal.querySelector(".modal-content");
  attachTaskModalHandlers(modal, modalContent);
  setTimeout(() => updateModalSubtasks(task), 0);
  setTimeout(() => openTaskModalContent(modalContent), 10);
}

/**
 * Removes existing task modal.
 * @returns {void} Result.
 */
function removeExistingTaskModal() {
  const oldModal = document.getElementById("task-modal");
  if (oldModal) oldModal.remove();
}

/**
 * Creates task modal element.
 * @param {Object} task - Task object.
 * @returns {HTMLElement} Result.
 */
function createTaskModal(task) {
  const modal = document.createElement("div");
  modal.id = "task-modal";
  modal.className = "modal";
  modal.innerHTML = getTaskModalTemplate(task);
  return modal;
}

/**
 * Attaches task modal handlers.
 * @param {HTMLElement} modal - Modal element.
 * @param {HTMLElement} modalContent - Modal content element.
 * @returns {void} Result.
 */
function attachTaskModalHandlers(modal, modalContent) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  attachModalContentClickGuard(modalContent);
}

/**
 * Prevents modal content clicks from bubbling.
 * @param {HTMLElement} modalContent - Modal content element.
 * @returns {void} Result.
 */
function attachModalContentClickGuard(modalContent) {
  if (modalContent) modalContent.addEventListener("click", (event) => event.stopPropagation());
}

/**
 * Opens task modal content visually.
 * @param {HTMLElement} modalContent - Modal content element.
 * @returns {void} Result.
 */
function openTaskModalContent(modalContent) {
  if (!modalContent) return;
  modalContent.style.opacity = "1";
  modalContent.style.transform = "translateX(0)";
}

/**
 * Toggles subtask done.
 * @param {number} taskId - Task identifier.
 * @param {number} subIndex - Subtask index.
 * @param {HTMLInputElement} checkbox - Checkbox element.
 * @returns {Promise<*>} Result.
 */
async function toggleSubtaskDone(taskId, subIndex, checkbox) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  task.subtasks[subIndex].done = checkbox.checked;
  await updateTask(task);
  renderBoard();
  updateModalSubtasks(task);
}

/**
 * Updates modal subtasks.
 * @param {Object} task - Task object.
 * @returns {void} Result.
 */
function updateModalSubtasks(task) {
  const modal = document.getElementById("task-modal");
  if (!modal) return;
  const subtaskContainer = modal.querySelector(".modal-subtasks");
  if (!subtaskContainer) return;
  subtaskContainer.innerHTML = generateModalSubtasks(task);
}

/**
 * Closes modal.
 * @returns {void} Result.
 */
function closeModal() {
  const modal = document.getElementById("task-modal");
  if (!modal) {
    activeTask = null;
    return;
  }
  if (!markTaskModalAsClosing(modal)) return;
  const modalContent = modal.querySelector(".modal-content");
  const cleanup = () => cleanupTaskModal(modal);
  if (!modalContent) {
    cleanup();
    return;
  }
  closeTaskModalWithTransition(modalContent, cleanup);
}

/**
 * Marks task modal as closing.
 * @param {HTMLElement} modal - Modal element.
 * @returns {boolean} Result.
 */
function markTaskModalAsClosing(modal) {
  if (modal.dataset.closing === "true") return false;
  modal.dataset.closing = "true";
  return true;
}

/**
 * Cleans up task modal state.
 * @param {HTMLElement} modal - Modal element.
 * @returns {void} Result.
 */
function cleanupTaskModal(modal) {
  if (modal && modal.parentNode) modal.remove();
  activeTask = null;
}

/**
 * Closes task modal with transition.
 * @param {HTMLElement} modalContent - Modal content element.
 * @param {Function} cleanup - Cleanup callback.
 * @returns {void} Result.
 */
function closeTaskModalWithTransition(modalContent, cleanup) {
  const onTransitionEnd = (event) => {
    handleTaskModalTransitionEnd(event, modalContent, onTransitionEnd, cleanup);
  };
  modalContent.addEventListener("transitionend", onTransitionEnd);
  requestAnimationFrame(() => animateTaskModalClosed(modalContent));
  scheduleTaskModalFallbackCleanup(modalContent, onTransitionEnd, cleanup);
}

/**
 * Handles task modal transition end.
 * @param {Event} event - Browser event.
 * @param {HTMLElement} modalContent - Modal content element.
 * @param {Function} onTransitionEnd - Transition handler.
 * @param {Function} cleanup - Cleanup callback.
 * @returns {void} Result.
 */
function handleTaskModalTransitionEnd(event, modalContent, onTransitionEnd, cleanup) {
  if (event && event.target !== modalContent) return;
  modalContent.removeEventListener("transitionend", onTransitionEnd);
  cleanup();
}

/**
 * Animates task modal closed.
 * @param {HTMLElement} modalContent - Modal content element.
 * @returns {void} Result.
 */
function animateTaskModalClosed(modalContent) {
  modalContent.style.opacity = "0";
  modalContent.style.transform = "translateX(100%)";
}

/**
 * Schedules task modal fallback cleanup.
 * @param {HTMLElement} modalContent - Modal content element.
 * @param {Function} onTransitionEnd - Transition handler.
 * @param {Function} cleanup - Cleanup callback.
 * @returns {void} Result.
 */
function scheduleTaskModalFallbackCleanup(modalContent, onTransitionEnd, cleanup) {
  setTimeout(() => {
    modalContent.removeEventListener("transitionend", onTransitionEnd);
    cleanup();
  }, 400);
}
