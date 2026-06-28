function showMessage(message, type = "success", options = {}) {
  const box = getOrCreateMessageBox();
  setMessageBoxContent(box, message, options);
  setMessageBoxType(box, type);
  setMessageBoxBaseStyles(box);
  setMessageBoxLayoutStyles(box);
  setMessageBoxColors(box, type);
  scheduleMessageHide(box);
}

/**
 * Returns or create message box.
 * @returns {*} Result.
 */
/**
 * Get Or Create Message Box.
 * @returns {any} Result value.
 */
function getOrCreateMessageBox() {
  let box = document.getElementById("msg-box");
  if (!box) {
    box = document.createElement("div");
    box.id="msg-box";
    box.setAttribute("role", "status");
    box.setAttribute("aria-live", "polite");
    document.body.appendChild(box);
  }
  return box;
}

/**
 * Sets message box content.
 * @param {*} box - Parameter.
 * @param {string} message - Message text.
 * @param {{ iconSrc?: string, iconAlt?: string }} [options] - Optional options.
 * @returns {void} Result.
 */
/**
 * Set Message Box Content.
 * @param {HTMLElement} box - box.
 * @param {string} message - message.
 * @param {Array} options - options.
 * @returns {void} Nothing.
 */
function setMessageBoxContent(box, message, options = {}) {
  box.innerHTML = "";
  const textEl = document.createElement("span");
  textEl.textContent = message;
  box.appendChild(textEl);

  if (options && options.iconSrc) {
    const iconEl = document.createElement("img");
    iconEl.src = options.iconSrc;
    iconEl.alt = options.iconAlt || "";
    iconEl.style.width = "24px";
    iconEl.style.height = "24px";
    iconEl.style.flex = "0 0 auto";
    box.appendChild(iconEl);
  }
}

/**
 * Sets message box type.
 * @param {*} box - Parameter.
 * @param {string} type - Message type.
 * @returns {void} Result.
 */
/**
 * Set Message Box Type.
 * @param {HTMLElement} box - box.
 * @param {string} type - type.
 * @returns {void} Nothing.
 */
function setMessageBoxType(box, type) {
  box.className = `msgBox ${type}`;
}

/**
 * Sets message box base styles.
 * @param {*} box - Parameter.
 * @returns {void} Result.
 */
/**
 * Set Message Box Base Styles.
 * @param {HTMLElement} box - box.
 * @returns {void} Nothing.
 */
function setMessageBoxBaseStyles(box) {
  box.style.position = "fixed";
  box.style.left = "50%";
  box.style.top = "50%";
  box.style.transform = "translate(-50%, -50%)";
  box.style.zIndex = "9999";
}

/**
 * Sets message box layout styles.
 * @param {*} box - Parameter.
 * @returns {void} Result.
 */
/**
 * Set Message Box Layout Styles.
 * @param {HTMLElement} box - box.
 * @returns {void} Nothing.
 */
function setMessageBoxLayoutStyles(box) {
  box.style.display = "flex";
  box.style.alignItems = "center";
  box.style.justifyContent = "center";
  box.style.gap = "10px";
  box.style.minWidth = "280px";
  box.style.maxWidth = "min(520px, calc(100vw - 32px))";
  box.style.padding = "18px 22px";
  box.style.borderRadius = "18px";
  box.style.color = "#fff";
  box.style.fontSize = "18px";
  box.style.fontWeight = "400";
  box.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.22)";
  box.style.pointerEvents = "none";
}

/**
 * Sets message box colors.
 * @param {*} box - Parameter.
 * @param {string} type - Message type.
 * @returns {void} Result.
 */
/**
 * Set Message Box Colors.
 * @param {HTMLElement} box - box.
 * @param {string} type - type.
 * @returns {void} Nothing.
 */
function setMessageBoxColors(box, type) {
  if (type === "error") {
    box.style.background = "var(--urgent, #ff3d00)";
    return;
  }
  box.style.background = "var(--sidebar-bg, #2a3647)";
}

/**
 * Executes schedule message hide logic.
 * @param {*} box - Parameter.
 * @returns {void} Result.
 */
/**
 * Schedule Message Hide.
 * @param {HTMLElement} box - box.
 * @returns {void} Nothing.
 */
function scheduleMessageHide(box) {
  window.clearTimeout(box._hideTimeout);
  box._hideTimeout = window.setTimeout(() => {
    box.style.display = "none";
  }, 1500);
}

/**
 * Toggles profile menu.
 * @param {Event} event - Browser event.
 * @returns {void} Result.
 */
/**
 * Toggle Profile Menu.
 * @param {Event} event - event.
 * @returns {void} Nothing.
 */
function toggleProfileMenu(event) {
  event.stopPropagation();
  const menu = document.getElementById('profile-menu');
  if (menu) {
    menu.classList.toggle('active');
  }
}

document.addEventListener('click', (event) => {
  const menu = document.getElementById('profile-menu');
  const profileContainer = document.querySelector('.user-profile-container');
  if (menu && profileContainer && !profileContainer.contains(event.target)) {
    menu.classList.remove('active');
  }
});

