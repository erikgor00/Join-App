/**
 * Executes logout logic.
 * @param {Event} event - Browser event.
 * @returns {void} Result.
 */
/**
 * Logout.
 * @param {Event} event - event.
 * @returns {void} Nothing.
 */
function logout(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  clearUserSession();
  safeFirebaseLogout();
  redirectToLogin();
}

/**
 * Clears user session.
 * @returns {void} Result.
 */
/**
 * Clear User Session.
 * @returns {void} Nothing.
 */
function clearUserSession() {
  localStorage.removeItem("user");
}

/**
 * Executes safe firebase logout logic.
 * @returns {void} Result.
 */
/**
 * Safe Firebase Logout.
 * @returns {void} Nothing.
 */
function safeFirebaseLogout() {
  try {
    if (typeof window.firebaseLogout === "function") {
      window.firebaseLogout();
    }
  } catch (e) {
    console.warn("Firebase logout failed (not critical):", e);
  }
}

/**
 * Executes redirect to login logic.
 * @returns {void} Result.
 */
/**
 * Redirect To Login.
 * @returns {void} Nothing.
 */
function redirectToLogin() {
  window.location.replace(getPagePath("index.html"));
}

/**
 * Executes navigate to help logic.
 * @returns {void} Result.
 */
/**
 * Navigate To Help.
 * @returns {void} Nothing.
 */
function navigateToHelp() {
  window.location.href = getPagePath("help.html");
}

/**
 * Builds a page path that works from root pages and /public pages.
 * @param {string} fileName - Target HTML file.
 * @returns {string} Context-safe relative path.
 */
/**
 * Get Page Path.
 * @param {string} fileName - file name.
 * @returns {any} Result value.
 */
function getPagePath(fileName) {
  const normalizedPath = String(window.location.pathname || "").replace(/\\/g, "/");
  const inPublicFolder = normalizedPath.includes("/public/");
  return `${inPublicFolder ? "../" : "./"}${fileName}`;
}

window.addEventListener("pageshow", (event) => {
  const currentPage = window.location.pathname;
  if (!event.persisted || isPublicPage(currentPage)) {
    return;
  }
  if (!localStorage.getItem("user")) {
    window.location.replace(getPagePath("index.html"));
  }
});
window.addEventListener("beforeunload", () => {
});

