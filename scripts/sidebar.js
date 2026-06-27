/**
 * Builds a page path that works from root pages and /public pages.
 * @param {string} fileName - Target HTML file.
 * @returns {string} Context-safe relative path.
 */
/**
 * Get Nav Path.
 * @param {string} fileName - file name.
 * @returns {any} Result value.
 */
function getNavPath(fileName) {
    const inPublicFolder = window.location.pathname.includes('/public/');
    return `${inPublicFolder ? '../' : './'}${fileName}`;
}

/**
 * Executes sidebar highlighting summary logic.
 * @returns {void} Result.
 */
/**
 * Sidebar Highlighting Summary.
 * @returns {void} Nothing.
 */
function sidebarHighlightingSummary() {
    window.location.href = getNavPath("summary.html");
}

/**
 * Executes sidebar highlighting add task logic.
 * @returns {void} Result.
 */
/**
 * Sidebar Highlighting Add Task.
 * @returns {void} Nothing.
 */
function sidebarHighlightingAddTask() {
    window.location.href = getNavPath("add-task.html");
}

/**
 * Executes sidebar highlighting board logic.
 * @returns {void} Result.
 */
/**
 * Sidebar Highlighting Board.
 * @returns {void} Nothing.
 */
function sidebarHighlightingBoard() {
    window.location.href = getNavPath("board.html");
}

/**
 * Executes sidebar highlighting contacts logic.
 * @returns {void} Result.
 */
/**
 * Sidebar Highlighting Contacts.
 * @returns {void} Nothing.
 */
function sidebarHighlightingContacts() {
    window.location.href = getNavPath("contacts.html");

}

/**
 * Opens log in side.
 * @returns {void} Result.
 */
/**
 * Open Log In Side.
 * @returns {void} Nothing.
 */
function openLogInSide() {
    window.location.href = getNavPath("index.html");
}

/**
 * Executes navigate to legal notice logic.
 * @returns {void} Result.
 */
/**
 * Navigate To Legal Notice.
 * @returns {void} Nothing.
 */
function navigateToLegalNotice() {
    window.location.href = getNavPath("legal-notice.html");
}

/**
 * Executes navigate to privacy policy logic.
 * @returns {void} Result.
 */
/**
 * Navigate To Privacy Policy.
 * @returns {void} Nothing.
 */
function navigateToPrivacyPolicy() {
    window.location.href = getNavPath("privacy-policy.html");
}
