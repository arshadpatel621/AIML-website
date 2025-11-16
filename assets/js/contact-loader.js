// Contact Info Loader - Fetches contact information from Supabase and displays on frontend
// This ensures contact info updated in admin panel automatically appears on the website

(async function loadContactInfo() {
  try {
    // Check if Supabase is available
    if (!window.supabase) {
      console.warn('Supabase not initialized. Contact info will display static content.');
      return;
    }

    // Fetch contact info from Supabase
    const { data: contactInfo, error } = await window.supabase
      .from('contact_info')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching contact info:', error);
      // Keep static content if there's an error
      return;
    }

    // If no contact data, keep static content
    if (!contactInfo) {
      console.log('No contact info found in database. Displaying static content.');
      return;
    }

    // Find the contact list container
    const contactList = document.querySelector('#contact .contact-list');
    
    if (!contactList) {
      console.warn('Contact list container not found');
      return;
    }

    // Build contact list HTML from database data
    let contactListHTML = '';

    // Address
    if (contactInfo.address) {
      contactListHTML += `
        <li><i class="fa-solid fa-location-dot"></i> ${escapeHtml(contactInfo.address)}</li>
      `;
    }

    // Phone
    if (contactInfo.phone) {
      contactListHTML += `
        <li><i class="fa-solid fa-phone"></i> ${escapeHtml(contactInfo.phone)}</li>
      `;
    }

    // Email(s)
    if (contactInfo.email) {
      let emailText = escapeHtml(contactInfo.email);
      if (contactInfo.alternate_email) {
        emailText += `, ${escapeHtml(contactInfo.alternate_email)}`;
      }
      contactListHTML += `
        <li><i class="fa-solid fa-envelope"></i> ${emailText}</li>
      `;
    }

    // Website (optional)
    if (contactInfo.website) {
      contactListHTML += `
        <li><i class="fa-solid fa-globe"></i> <a href="${escapeHtml(contactInfo.website)}" target="_blank" rel="noopener noreferrer">${escapeHtml(contactInfo.website)}</a></li>
      `;
    }

    // Office Hours (optional)
    if (contactInfo.office_hours) {
      contactListHTML += `
        <li><i class="fa-solid fa-clock"></i> ${escapeHtml(contactInfo.office_hours)}</li>
      `;
    }

    // Update the contact list if we have data
    if (contactListHTML) {
      contactList.innerHTML = contactListHTML;
      console.log('✅ Contact info loaded from database');
    } else {
      console.log('Contact info found but no fields populated. Displaying static content.');
    }

  } catch (error) {
    console.error('Unexpected error loading contact info:', error);
    // Keep static content on error
  }
})();

// Helper function to escape HTML (prevent XSS)
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

