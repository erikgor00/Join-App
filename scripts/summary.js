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
function scheduleWelcomeOverlayHide(aside, cleanup) {
    setTimeout(() => aside.classList.remove("is-visible"), 1500);
    setTimeout(cleanup, 2300);
}

/**
 * Fetches tasks.
 * @returns {Promise<*>} Result.
 */
/**
 * Fetch Tasks.
 * @returns {Promise<void>} Result value.
 */
async function fetchTasks() {
    const response = await fetch(`${BASE_URL}/tasks.json`);
    if (!response.ok) {
        throw new Error(`HTTP-Fehler: ${response.status}`);
    }

    const data = await response.json();
    return Object.values(data || {});
}

/**
 * Updates dashboard.
 * @returns {Promise<*>} Result.
 */
/**
 * Update Dashboard.
 * @returns {Promise<void>} Result value.
 */
async function updateDashboard() {
    try {
        const tasks = await fetchTasks();
        applyDashboardStats(tasks);
    } catch (error) {
        console.error("Fehler beim Abrufen der Dashboard-Daten:", error);
    }
}

/**
 * Executes apply dashboard stats logic.
 * @param {*} tasks - Parameter.
 * @returns {void} Result.
 */
/**
 * Apply Dashboard Stats.
 * @param {Array} tasks - tasks.
 * @returns {void} Nothing.
 */
function applyDashboardStats(tasks) {
    const stats = getDashboardStats(tasks);
    setText("total-to-do", stats.todoCount);
    setText("total-done", stats.doneCount);
    setText("total-tasks-progress", stats.inProgressCount);
    setText("total-awaiting-feedback", stats.awaitingFeedbackCount);
    setText("total-urgent", stats.urgentCount);
    setText("total-tasks-board", stats.totalTasks);
    setText("due-date", formatDashboardDueDate(stats.earliestUrgentDueDate));
}

/**
 * Returns dashboard stats.
 * @param {*} tasks - Parameter.
 * @returns {*} Result.
 */
/**
 * Get Dashboard Stats.
 * @param {Array} tasks - tasks.
 * @returns {any} Result value.
 */
function getDashboardStats(tasks) {
    const urgentTasks = getOpenFutureUrgentTasks(tasks);
    const earliestUrgentDueDate = getEarliestFutureDueDate(urgentTasks);

    return {
        todoCount: countTasksByStatus(tasks, "To Do"),
        doneCount: countTasksByStatus(tasks, "Done"),
        inProgressCount: countTasksByStatus(tasks, "In Progress"),
        awaitingFeedbackCount: countTasksByStatus(tasks, "Await Feedback"),
        urgentCount: urgentTasks.length,
        earliestUrgentDueDate,
        totalTasks: tasks.length
    };
}

/**
 * Returns tasks matching a status.
 * @param {Array<Object>} tasks - Task list.
 * @param {string} status - Task status.
 * @returns {number} Result.
 */
/**
 * Count Tasks By Status.
 * @param {Array} tasks - tasks.
 * @param {string} status - status.
 * @returns {void} Nothing.
 */
function countTasksByStatus(tasks, status) {
    return tasks.filter(t => t.status === status).length;
}

/**
 * Returns open urgent tasks with future due dates.
 * @param {Array<Object>} tasks - Task list.
 * @returns {Array<Object>} Result.
 */
/**
 * Get Open Future Urgent Tasks.
 * @param {Array} tasks - tasks.
 * @returns {any} Result value.
 */
function getOpenFutureUrgentTasks(tasks) {
    return tasks.filter(isOpenFutureUrgentTask);
}

/**
 * Returns whether a task is urgent, open, and due in the future.
 * @param {Object} task - Task.
 * @returns {boolean} Result.
 */
/**
 * Is Open Future Urgent Task.
 * @param {Object} task - task.
 * @returns {boolean} Result value.
 */
function isOpenFutureUrgentTask(task) {
    if (task.priority !== "urgent" || task.status === "Done") return false;
    const due = parseTaskDueDate(task.dueDate);
    return Boolean(due && isStrictlyFutureDate(due));
}

/**
 * Returns whether a date is strictly in the future (after today).
 * @param {Date} date - Date.
 * @returns {boolean} Result.
 */
/**
 * Is Strictly Future Date.
 * @param {string} date - date.
 * @returns {boolean} Result value.
 */
function isStrictlyFutureDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date.getTime() > today.getTime();
}

/**
 * Parses a task due date string into a Date without timezone shifting.
 * Supports the app's ISO format (YYYY-MM-DD) and a few common fallbacks.
 * @param {string} dueDate - Due date string.
 * @returns {Date|null} Result.
 */
/**
 * Parse Task Due Date.
 * @param {string} dueDate - due date.
 * @returns {any} Result value.
 */
function parseTaskDueDate(dueDate) {
    if (!isStringDueDate(dueDate)) return null;
    const value = dueDate.trim();
    if (!value) return null;

    return parseIsoDueDate(value)
        || parseGermanDotDueDate(value)
        || parseSlashDueDate(value)
        || parseFallbackDueDate(value);
}

/**
 * Returns whether due date input is a string.
 * @param {*} dueDate - Due date value.
 * @returns {boolean} Result.
 */
/**
 * Is String Due Date.
 * @param {string} dueDate - due date.
 * @returns {boolean} Result value.
 */
function isStringDueDate(dueDate) {
    return Boolean(dueDate && typeof dueDate === "string");
}

/**
 * Parses an ISO due date.
 * @param {string} value - Due date string.
 * @returns {Date|null} Result.
 */
/**
 * Parse Iso Due Date.
 * @param {string} value - value.
 * @returns {any} Result value.
 */
function parseIsoDueDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.exec(value)) return null;
    const [year, month, day] = value.split("-").map(Number);
    return createValidLocalDate(year, month, day);
}

/**
 * Parses a German dot due date.
 * @param {string} value - Due date string.
 * @returns {Date|null} Result.
 */
/**
 * Parse German Dot Due Date.
 * @param {string} value - value.
 * @returns {any} Result value.
 */
function parseGermanDotDueDate(value) {
    if (!/^\d{2}\.\d{2}\.\d{4}$/.exec(value)) return null;
    const [day, month, year] = value.split(".").map(Number);
    return createValidLocalDate(year, month, day);
}

/**
 * Parses a slash due date.
 * @param {string} value - Due date string.
 * @returns {Date|null} Result.
 */
/**
 * Parse Slash Due Date.
 * @param {string} value - value.
 * @returns {any} Result value.
 */
function parseSlashDueDate(value) {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.exec(value)) return null;
    const [day, month, year] = value.split("/").map(Number);
    return createValidLocalDate(year, month, day);
}

/**
 * Parses a fallback due date.
 * @param {string} value - Due date string.
 * @returns {Date|null} Result.
 */
/**
 * Parse Fallback Due Date.
 * @param {string} value - value.
 * @returns {any} Result value.
 */
function parseFallbackDueDate(value) {
    const fallback = new Date(value);
    return getValidDateOrNull(fallback);
}

/**
 * Creates a local date from numeric date parts.
 * @param {number} year - Year.
 * @param {number} month - Month.
 * @param {number} day - Day.
 * @returns {Date|null} Result.
 */
/**
 * Create Valid Local Date.
 * @param {any} year - year.
 * @param {any} month - month.
 * @param {any} day - day.
 * @returns {boolean} Result value.
 */
function createValidLocalDate(year, month, day) {
    const date = new Date(year, month - 1, day);
    return getValidDateOrNull(date);
}

/**
 * Returns a valid date or null.
 * @param {Date} date - Date.
 * @returns {Date|null} Result.
 */
/**
 * Get Valid Date Or Null.
 * @param {string} date - date.
 * @returns {boolean} Result value.
 */
function getValidDateOrNull(date) {
    return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Returns the earliest due date among a list of tasks.
 * @param {Array<Object>} tasks - Task list.
 * @returns {Date|null} Result.
 */
/**
 * Get Earliest Due Date.
 * @param {Array} tasks - tasks.
 * @returns {any} Result value.
 */
function getEarliestDueDate(tasks) {
    let earliest = null;
    for (const task of tasks) {
        const date = parseTaskDueDate(task.dueDate);
        if (!date) continue;
        if (!earliest || date.getTime() < earliest.getTime()) earliest = date;
    }
    return earliest;
}

/**
 * Returns the earliest due date that is strictly in the future.
 * @param {Array<Object>} tasks - Task list.
 * @returns {Date|null} Result.
 */
/**
 * Get Earliest Future Due Date.
 * @param {Array} tasks - tasks.
 * @returns {any} Result value.
 */
function getEarliestFutureDueDate(tasks) {
    let earliest = null;
    for (const task of tasks) {
        const date = parseTaskDueDate(task.dueDate);
        if (!date || !isStrictlyFutureDate(date)) continue;
        if (!earliest || date.getTime() < earliest.getTime()) earliest = date;
    }
    return earliest;
}

/**
 * Formats the dashboard due date string.
 * @param {Date|null} date - Date.
 * @returns {string} Result.
 */
/**
 * Format Dashboard Due Date.
 * @param {string} date - date.
 * @returns {void} Nothing.
 */
function formatDashboardDueDate(date) {
    if (!date) return "No Urgent Date";
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric"
    }).format(date);
}

document.addEventListener("DOMContentLoaded", async () => {
    await renderWelcome();
    showMobileWelcomeOverlay();
    await updateDashboard();
});

document.addEventListener("click", (e) => {
    const card = e.target.closest(".kpi-card, .deadline-card, .task-summary-card");
    if (card) navigateToBoard();
});
