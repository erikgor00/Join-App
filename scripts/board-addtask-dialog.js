/**
 * Shows add task dialog.
 * @returns {Promise<*>} Result.
 */
/**
 * Show Add Task Dialog.
 * @returns {Promise<void>} Result value.
 */
async function showAddTaskDialog() {
  const elements = getAddTaskDialogElements();
  if (!elements) return;
  const { modalContent, dialogOverlay } = elements;
  openAddTaskDialogOverlay(dialogOverlay, modalContent);
  registerAddTaskDialogBackdropHandler(dialogOverlay);
  modalContent.innerHTML = generateAddTask({ variant: "dialog" });
  startAddTaskDialogAnimation(modalContent);
  await loadContacts();
  initializeAddTaskDialogForm();
}

/**
 * Returns add-task dialog elements.
 * @returns {{modalContent: HTMLElement, dialogOverlay: HTMLElement}|null} Result.
 */
/**
 * Get Add Task Dialog Elements.
 * @returns {any} Result value.
 */
function getAddTaskDialogElements() {
  const modalContent = document.getElementById("add-task-dialog-message");
  const dialogOverlay = document.getElementById("add-task-dialog");
  if (!dialogOverlay || !modalContent) return null;
  return { modalContent, dialogOverlay };
}

/**
 * Opens add-task dialog overlay.
 * @param {HTMLElement} dialogOverlay - Dialog overlay.
 * @param {HTMLElement} modalContent - Modal content.
 * @returns {void} Result.
 */
/**
 * Open Add Task Dialog Overlay.
 * @param {HTMLElement} dialogOverlay - dialog overlay.
 * @param {HTMLElement} modalContent - modal content.
 * @returns {void} Nothing.
 */
function openAddTaskDialogOverlay(dialogOverlay, modalContent) {
  dialogOverlay.dataset.closing = "false";
  dialogOverlay.classList.remove("d-none");
  document.body.classList.add("add-task-dialog-open");
  modalContent.classList.remove("is-open");
}

/**
 * Registers add-task dialog backdrop handler.
 * @param {HTMLElement} dialogOverlay - Dialog overlay.
 * @returns {void} Result.
 */
/**
 * Register Add Task Dialog Backdrop Handler.
 * @param {HTMLElement} dialogOverlay - dialog overlay.
 * @returns {void} Nothing.
 */
function registerAddTaskDialogBackdropHandler(dialogOverlay) {
  if (window.addTaskDialogBackdropHandlerAdded) return;
  window.addTaskDialogBackdropHandlerAdded = true;
  dialogOverlay.addEventListener("click", handleAddTaskDialogBackdropClick);
}

/**
 * Handles add-task dialog backdrop clicks.
 * @param {Event} event - Browser event.
 * @returns {void} Result.
 */
/**
 * Handle Add Task Dialog Backdrop Click.
 * @param {Event} event - event.
 * @returns {void} Nothing.
 */
function handleAddTaskDialogBackdropClick(event) {
  if (event.target !== event.currentTarget) return;
  event.stopPropagation();
  closeAddTaskDialog();
}

/**
 * Starts add-task dialog animation.
 * @param {HTMLElement} modalContent - Modal content.
 * @returns {void} Result.
 */
/**
 * Start Add Task Dialog Animation.
 * @param {HTMLElement} modalContent - modal content.
 * @returns {void} Nothing.
 */
function startAddTaskDialogAnimation(modalContent) {
  if (typeof applyTodayMinDate === "function") applyTodayMinDate();
  void modalContent.offsetWidth;
  requestAnimationFrame(() => modalContent.classList.add("is-open"));
}

/**
 * Initializes add-task dialog form state.
 * @returns {void} Result.
 */
/**
 * Initialize Add Task Dialog Form.
 * @returns {void} Nothing.
 */
function initializeAddTaskDialogForm() {
  selectedContacts = [];
  selectContacts();
  renderSelectedAvatars();
  callOptionalGlobalFunction("initAddDropdownClose");
  callOptionalGlobalFunction("initAddTaskBlurValidation");
  callOptionalGlobalFunction("updateCreateButtonState");
  callOptionalGlobalFunction("initAddSubtaskEnter");
}

/**
 * Calls optional global function by name.
 * @param {string} functionName - Function name.
 * @returns {void} Result.
 */
/**
 * Call Optional Global Function.
 * @param {string} functionName - function name.
 * @returns {void} Nothing.
 */
function callOptionalGlobalFunction(functionName) {
  if (typeof window[functionName] === "function") window[functionName]();
}

/**
 * Closes add task dialog.
 * @returns {void} Result.
 */
/**
 * Close Add Task Dialog.
 * @returns {void} Nothing.
 */
function closeAddTaskDialog() {
  const dialogOverlay = document.getElementById("add-task-dialog");
  const modalContent = document.getElementById("add-task-dialog-message");
  if (!dialogOverlay) return;
  if (!markAddTaskDialogAsClosing(dialogOverlay)) return;
  const cleanup = () => cleanupAddTaskDialog(dialogOverlay);
  if (!modalContent) {
    cleanup();
    return;
  }
  closeAddTaskDialogWithTransition(modalContent, cleanup);
}

/**
 * Marks add-task dialog as closing.
 * @param {HTMLElement} dialogOverlay - Dialog overlay.
 * @returns {boolean} Result.
 */
/**
 * Mark Add Task Dialog As Closing.
 * @param {HTMLElement} dialogOverlay - dialog overlay.
 * @returns {void} Nothing.
 */
function markAddTaskDialogAsClosing(dialogOverlay) {
  if (dialogOverlay.dataset.closing === "true") return false;
  dialogOverlay.dataset.closing = "true";
  return true;
}

/**
 * Cleans up add-task dialog state.
 * @param {HTMLElement} dialogOverlay - Dialog overlay.
 * @returns {void} Result.
 */
/**
 * Cleanup Add Task Dialog.
 * @param {HTMLElement} dialogOverlay - dialog overlay.
 * @returns {void} Nothing.
 */
function cleanupAddTaskDialog(dialogOverlay) {
  dialogOverlay.classList.add("d-none");
  dialogOverlay.dataset.closing = "false";
  document.body.classList.remove("add-task-dialog-open");
}

/**
 * Closes add-task dialog with transition.
 * @param {HTMLElement} modalContent - Modal content.
 * @param {Function} cleanup - Cleanup callback.
 * @returns {void} Result.
 */
/**
 * Close Add Task Dialog With Transition.
 * @param {HTMLElement} modalContent - modal content.
 * @param {any} cleanup - cleanup.
 * @returns {void} Nothing.
 */
function closeAddTaskDialogWithTransition(modalContent, cleanup) {
  const onTransitionEnd = (event) => {
    handleAddTaskDialogTransitionEnd(event, modalContent, onTransitionEnd, cleanup);
  };
  modalContent.addEventListener("transitionend", onTransitionEnd);
  requestAnimationFrame(() => modalContent.classList.remove("is-open"));
  scheduleAddTaskDialogFallbackCleanup(modalContent, onTransitionEnd, cleanup);
}

/**
 * Handles add-task dialog transition end.
 * @param {Event} event - Browser event.
 * @param {HTMLElement} modalContent - Modal content.
 * @param {Function} onTransitionEnd - Transition handler.
 * @param {Function} cleanup - Cleanup callback.
 * @returns {void} Result.
 */
/**
 * Handle Add Task Dialog Transition End.
 * @param {Event} event - event.
 * @param {HTMLElement} modalContent - modal content.
 * @param {any} onTransitionEnd - on transition end.
 * @param {any} cleanup - cleanup.
 * @returns {void} Nothing.
 */
function handleAddTaskDialogTransitionEnd(event, modalContent, onTransitionEnd, cleanup) {
  if (event && event.target !== modalContent) return;
  modalContent.removeEventListener("transitionend", onTransitionEnd);
  cleanup();
}

/**
 * Schedules add-task dialog fallback cleanup.
 * @param {HTMLElement} modalContent - Modal content.
 * @param {Function} onTransitionEnd - Transition handler.
 * @param {Function} cleanup - Cleanup callback.
 * @returns {void} Result.
 */
/**
 * Schedule Add Task Dialog Fallback Cleanup.
 * @param {HTMLElement} modalContent - modal content.
 * @param {any} onTransitionEnd - on transition end.
 * @param {any} cleanup - cleanup.
 * @returns {void} Nothing.
 */
function scheduleAddTaskDialogFallbackCleanup(modalContent, onTransitionEnd, cleanup) {
  setTimeout(() => {
    modalContent.removeEventListener("transitionend", onTransitionEnd);
    cleanup();
  }, 400);
}
