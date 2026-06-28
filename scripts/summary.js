/**
 * Executes navigate to board logic.
 * @returns {void} Result.
 */
/**
 * Navigate To Board.
 * @returns {void} Nothing.
 */
function navigateToBoard() {
    window.location.href = "board.html";
}

/**
 * Sets text.
 * @param {string} id - Identifier.
 * @param {string} value - Value.
 * @returns {void} Result.
 */
/**
 * Set Text.
 * @param {string} id - id.
 * @param {string} value - value.
 * @returns {void} Nothing.
 */
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

/**
 * Returns greeting by time.
 * @param {*} withComma - Parameter.
 * @returns {*} Result.
 */
/**
 * Get Greeting By Time.
 * @param {any} withComma - with comma.
 * @returns {any} Result value.
 */
function getGreetingByTime(withComma) {
    const hour = new Date().getHours();
    const suffix = withComma ? "," : "!";

    if (hour < 12) return `Good morning${suffix}`;
    if (hour < 18) return `Good afternoon${suffix}`;
    return `Good evening${suffix}`;
}

/**
 * Returns stored session.
 * @returns {*} Result.
 */
/**
 * Get Stored Session.
 * @returns {any} Result value.
 */
function getStoredSession() {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

/**
 * Fetches user name by email.
 * @param {string} email - Email address.
 * @returns {Promise<*>} Result.
 */
/**
 * Fetch User Name By Email.
 * @param {string} email - email.
 * @returns {Promise<void>} Result value.
 */
async function fetchUserNameByEmail(email) {
    if (!email) return "";
    try {
        const response = await fetch(`${BASE_URL}/users.json`);
        if (!response.ok) return "";
        const data = await response.json();
        const user = Object.values(data || {}).find(u => u.email === email);
        return (user && user.name) ? String(user.name) : "";
    } catch (e) {
        console.error("Fehler beim Laden des Usernamens:", e);
        return "";
    }
}

/**
 * Renders welcome.
 * @returns {Promise<*>} Result.
 */
/**
 * Render Welcome.
 * @returns {Promise<void>} Result value.
 */
async function renderWelcome() {
    const session = getStoredSession();
    if (isGuestSession(session)) {
        renderGuestWelcome();
        return;
    }
    setText("welcome-msg", getGreetingByTime(true));
    const name = await resolveUserName(session);
    setText("username-field", name);
}

/**
 * Checks whether guest session.
 * @param {*} session - Parameter.
 * @returns {boolean} Result.
 */
/**
 * Is Guest Session.
 * @param {any} session - session.
 * @returns {boolean} Result value.
 */
function isGuestSession(session) {
    return !session || session.mode === "guest";
}

/**
 * Renders guest welcome.
 * @returns {void} Result.
 */
/**
 * Render Guest Welcome.
 * @returns {void} Nothing.
 */
function renderGuestWelcome() {
    setText("welcome-msg", getGreetingByTime(false));
    setText("username-field", "");
}

/**
 * Executes resolve user name logic.
 * @param {*} session - Parameter.
 * @returns {Promise<*>} Result.
 */
/**
 * Resolve User Name.
 * @param {any} session - session.
 * @returns {Promise<void>} Result value.
 */
async function resolveUserName(session) {
    const nameFromDb = await fetchUserNameByEmail(session.email);
    return nameFromDb || session.displayName || "User";
}

/**
 * Shows the mobile welcome overlay (<900px) for 1.5s,
 * then fades it out and removes it from the layout.
 * @returns {void} Result.
 */
/**
 * Show Mobile Welcome Overlay.
 * @returns {void} Nothing.
 */
function showMobileWelcomeOverlay() {
    const mq = window.matchMedia("(max-width: 900px)");
    const elements = getWelcomeOverlayElements();
    if (!elements) return;

    const { aside, welcomeBox } = elements;
    registerMobileWelcomeMediaListener(mq, aside, welcomeBox);
    if (resetMobileWelcomeOverlayForDesktop(mq, aside, welcomeBox)) return;

    displayMobileWelcomeOverlay(aside, welcomeBox);
    animateMobileWelcomeOverlay(aside);

    let onTransitionEnd;
    const cleanup = () => cleanupWelcomeOverlay(aside, welcomeBox, onTransitionEnd);
    onTransitionEnd = (event) => handleWelcomeOverlayTransitionEnd(event, cleanup);
    aside.addEventListener("transitionend", onTransitionEnd);
    scheduleWelcomeOverlayHide(aside, cleanup);
}

/**
 * Returns welcome overlay elements.
 * @returns {{aside: HTMLElement, welcomeBox: HTMLElement}|null} Result.
 */
/**
 * Get Welcome Overlay Elements.
 * @returns {any} Result value.
 */
function getWelcomeOverlayElements() {
    const welcomeBox = document.getElementById("welcome-msg-box");
    if (!welcomeBox) return null;

    const aside = welcomeBox.closest("aside");
    if (!aside) return null;

    return { aside, welcomeBox };
}

/**
 * Resets mobile welcome overlay state.
 * @param {HTMLElement} aside - Aside element.
 * @param {HTMLElement} welcomeBox - Welcome box element.
 * @returns {void} Result.
 */
/**
 * Reset Mobile Welcome Overlay.
 * @param {string} aside - aside.
 * @param {HTMLElement} welcomeBox - welcome box.
 * @returns {void} Nothing.
 */
function resetMobileWelcomeOverlay(aside, welcomeBox) {
    aside.classList.remove("is-visible");
    aside.classList.remove("mobile-welcome-overlay");
    aside.style.display = "";
    welcomeBox.style.display = "";
}

/**
 * Registers the mobile media query listener once.
 * @param {MediaQueryList} mq - Media query list.
 * @param {HTMLElement} aside - Aside element.
 * @param {HTMLElement} welcomeBox - Welcome box element.
 * @returns {void} Result.
 */
/**
 * Register Mobile Welcome Media Listener.
 * @param {any} mq - mq.
 * @param {string} aside - aside.
 * @param {HTMLElement} welcomeBox - welcome box.
 * @returns {void} Nothing.
 */
function registerMobileWelcomeMediaListener(mq, aside, welcomeBox) {
    if (!window.mobileWelcomeOverlayMqListenerAdded) {
        window.mobileWelcomeOverlayMqListenerAdded = true;
        mq.addEventListener("change", (event) => {
            if (!event.matches) resetMobileWelcomeOverlay(aside, welcomeBox);
        });
    }
}

/**
 * Resets overlay for desktop view if needed.
 * @param {MediaQueryList} mq - Media query list.
 * @param {HTMLElement} aside - Aside element.
 * @param {HTMLElement} welcomeBox - Welcome box element.
 * @returns {boolean} Result.
 */
/**
 * Reset Mobile Welcome Overlay For Desktop.
 * @param {any} mq - mq.
 * @param {string} aside - aside.
 * @param {HTMLElement} welcomeBox - welcome box.
 * @returns {void} Nothing.
 */
function resetMobileWelcomeOverlayForDesktop(mq, aside, welcomeBox) {
    if (!mq.matches) {
        resetMobileWelcomeOverlay(aside, welcomeBox);
        return true;
    }
    return false;
}

/**
 * Displays the mobile welcome overlay.
 * @param {HTMLElement} aside - Aside element.
 * @param {HTMLElement} welcomeBox - Welcome box element.
 * @returns {void} Result.
 */
/**
 * Display Mobile Welcome Overlay.
 * @param {string} aside - aside.
 * @param {HTMLElement} welcomeBox - welcome box.
 * @returns {void} Nothing.
 */
function displayMobileWelcomeOverlay(aside, welcomeBox) {
    aside.classList.add("mobile-welcome-overlay");
    aside.style.display = "flex";
    welcomeBox.style.display = "flex";
}

/**
 * Animates the mobile welcome overlay in.
 * @param {HTMLElement} aside - Aside element.
 * @returns {void} Result.
 */
/**
 * Animate Mobile Welcome Overlay.
 * @param {string} aside - aside.
 * @returns {void} Nothing.
 */
function animateMobileWelcomeOverlay(aside) {
    aside.classList.remove("is-visible");
    requestAnimationFrame(() => aside.classList.add("is-visible"));
}

/**
 * Handles the welcome overlay transition end.
 * @param {TransitionEvent} event - Transition event.
 * @param {Function} cleanup - Cleanup callback.
 * @returns {void} Result.
 */
/**
 * Handle Welcome Overlay Transition End.
 * @param {Event} event - event.
 * @param {any} cleanup - cleanup.
 * @returns {void} Nothing.
 */
function handleWelcomeOverlayTransitionEnd(event, cleanup) {
    if (event.propertyName !== "opacity") return;
    cleanup();
}

/**
 * Cleans up the mobile welcome overlay.
 * @param {HTMLElement} aside - Aside element.
 * @param {HTMLElement} welcomeBox - Welcome box element.
 * @param {Function} onTransitionEnd - Transition handler.
 * @returns {void} Result.
 */
/**
 * Cleanup Welcome Overlay.
 * @param {string} aside - aside.
 * @param {HTMLElement} welcomeBox - welcome box.
 * @param {any} onTransitionEnd - on transition end.
 * @returns {void} Nothing.
 */
function cleanupWelcomeOverlay(aside, welcomeBox, onTransitionEnd) {
    if (aside.classList.contains("is-visible")) return;
    aside.style.display = "none";
    welcomeBox.style.display = "";
    aside.classList.remove("mobile-welcome-overlay");
    aside.removeEventListener("transitionend", onTransitionEnd);
}

/**
 * Schedules the welcome overlay hide and cleanup.
 * @param {HTMLElement} aside - Aside element.
 * @param {Function} cleanup - Cleanup callback.
 * @returns {void} Result.
 */
/**
 * Schedule Welcome Overlay Hide.
 * @param {string} aside - aside.
 * @param {any} cleanup - cleanup.
 * @returns {void} Nothing.
 */