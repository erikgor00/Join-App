let contactDetailsOverflowTimeoutId;

/**
 * Temporarily hides horizontal overflow while contact details slide in.
 * @returns {void} Result.
 */
/**
 * Suppress Horizontal Overflow During Details Animation.
 * @returns {void} Nothing.
 */
function suppressHorizontalOverflowDuringDetailsAnimation() {
  const detailsSection = document.querySelector('.contact-section-right');
  if (!detailsSection) return;

  detailsSection.style.overflowX = 'hidden';
  window.clearTimeout(contactDetailsOverflowTimeoutId);
  contactDetailsOverflowTimeoutId = window.setTimeout(() => {
    detailsSection.style.overflowX = '';
  }, 320);
}

/**
 * Executes handle contact click logic.
 * @param {Event} event - Browser event.
 * @returns {Promise<*>} Result.
 */
/**
 * Handle Contact Click.
 * @param {Event} event - event.
 * @returns {Promise<void>} Result value.
 */
async function handleContactClick(event) {
  const clickedContact = event.currentTarget;
  selectClickedContact(clickedContact);
  const contactId = clickedContact.dataset.id;
  const contactData = await fetchContactDetails(contactId);
  if (!contactData) {
    console.error("Kontakt konnte nicht geladen werden.");
    return;
  }
  renderContactDetails(contactData, contactId);
  suppressHorizontalOverflowDuringDetailsAnimation();
  initContactMoreMenuAutoClose();
  showContactDetailsOnMobile();
}

/**
 * Selects clicked contact.
 * @param {HTMLElement} clickedContact - Clicked contact element.
 * @returns {void} Result.
 */
/**
 * Select Clicked Contact.
 * @param {Object} clickedContact - clicked contact.
 * @returns {any} Result value.
 */
function selectClickedContact(clickedContact) {
  document.querySelectorAll('.contact-area, .contact-item').forEach(contact => contact.classList.remove('selected'));
  clickedContact.classList.add('selected');
}

/**
 * Renders contact details.
 * @param {Object} contactData - Contact data.
 * @param {string} contactId - Contact identifier.
 * @returns {void} Result.
 */
/**
 * Render Contact Details.
 * @param {Object} contactData - contact data.
 * @param {string} contactId - contact id.
 * @returns {void} Nothing.
 */
function renderContactDetails(contactData, contactId) {
  const container = document.getElementById('contact-details');
  const initials = getContactInitialsFromName(contactData.name);
  const phone = contactData.phone || '';
  container.innerHTML = getContactDetailsTemplate(initials, contactData.name, contactData.email, phone, contactId);
}

/**
 * Shows contact details on mobile.
 * @returns {void} Result.
 */
/**
 * Show Contact Details On Mobile.
 * @returns {void} Nothing.
 */
function showContactDetailsOnMobile() {
  if (window.innerWidth <= 780) document.querySelector('.wrapper').classList.add('show-contact-details');
}

/**
 * Adds contact click listeners.
 * @returns {void} Result.
 */
/**
 * Add Contact Click Listeners.
 * @returns {void} Nothing.
 */
function addContactClickListeners() {
  document.querySelectorAll('.contact-item[data-id], .contact-area[data-id]').forEach(contact => {
    contact.addEventListener('click', handleContactClick);
  });
}

/**
 * Renders contact group.
 * @returns {Promise<*>} Result.
 */
/**
 * Render Contact Group.
 * @returns {Promise<void>} Result value.
 */
async function renderContactGroup() {
  await loadContacts();
  const contactListRef = document.getElementById('contact-list');
  contactListRef.innerHTML = '';
  renderContactEntries(contactListRef, contacts);
  colorizeContactInitials();
  addContactClickListeners();
}

/**
 * Renders contact entries.
 * @param {*} contactListRef - Parameter.
 * @param {*} contactsData - Parameter.
 * @returns {void} Result.
 */
/**
 * Render Contact Entries.
 * @param {HTMLElement} contactListRef - contact list ref.
 * @param {Array} contactsData - contacts data.
 * @returns {void} Nothing.
 */
function renderContactEntries(contactListRef, contactsData) {
  let currentLetter = '';
  contactsData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  for (let i = 0; i < contactsData.length; i++) {
    const contact = contactsData[i];
    const firstLetter = (contact.name || 'Unnamed').charAt(0).toUpperCase();
    if (currentLetter !== firstLetter) {
      currentLetter = firstLetter;
      contactListRef.innerHTML += getHeaderLetter(firstLetter);
    }
    const name = contact.name || 'Unnamed';
    const initials = getContactInitialsFromName(name);
    const content = getContactItem(name, contact.email, initials);
    contactListRef.innerHTML += getContactItemWrapper(contact.id, contact.phone, content);
  }
}

/**
 * Executes refresh contact details logic.
 * @returns {void} Result.
 */
/**
 * Refresh Contact Details.
 * @returns {void} Nothing.
 */
function refreshContactDetails() {
  const contactDetailsContainerRef = document.getElementById('contact-details');
  contactDetailsContainerRef.innerHTML = '';
  if (window.innerWidth <= 780) {
    document.querySelector('.wrapper').classList.remove('show-contact-details');
  }
}

/**
 * Executes colorize contact initials logic.
 * @returns {void} Result.
 */
/**
 * Colorize Contact Initials.
 * @returns {void} Nothing.
 */
function colorizeContactInitials() {
  const initialsElements = document.querySelectorAll('.contact-initials');
  initialsElements.forEach(el => {
    el.classList.remove('bg-blue', 'bg-green', 'bg-purple', 'bg-orange', 'bg-pink', 'bg-red', 'bg-teal', 'bg-brown');
    el.classList.add(getRandomInitialsColorClass());
  });
}

/**
 * Returns random initials color class.
 * @returns {*} Result.
 */
/**
 * Get Random Initials Color Class.
 * @returns {any} Result value.
 */
function getRandomInitialsColorClass() {
  const colorClasses = [
    'bg-blue',
    'bg-green',
    'bg-purple',
    'bg-orange',
    'bg-pink',
    'bg-red',
    'bg-teal',
    'bg-brown'
  ];
  return colorClasses[Math.floor(Math.random() * colorClasses.length)];
}
