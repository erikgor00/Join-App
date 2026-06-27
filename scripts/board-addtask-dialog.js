/**
 * Shows add task dialog.
 * @returns {Promise<*>} Result.
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
function startAddTaskDialogAnimation(modalContent) {
  if (typeof applyTodayMinDate === "function") applyTodayMinDate();
  void modalContent.offsetWidth;
  requestAnimationFrame(() => modalContent.classList.add("is-open"));
}

/**
 * Initializes add-task dialog form state.
 * @returns {void} Result.
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
function callOptionalGlobalFunction(functionName) {
  if (typeof window[functionName] === "function") window[functionName]();
}

/**
 * Closes add task dialog.
 * @returns {void} Result.
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
function scheduleAddTaskDialogFallbackCleanup(modalContent, onTransitionEnd, cleanup) {
  setTimeout(() => {
    modalContent.removeEventListener("transitionend", onTransitionEnd);
    cleanup();
  }, 400);
}
