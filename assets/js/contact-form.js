// Contact Form Handler - Saves messages to Supabase database
(function contactFormHandler() {
  const contactForm = document.getElementById('contactForm');
  const statusDiv = document.getElementById('contactFormStatus');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contactFormName').value.trim();
    const email = document.getElementById('contactFormEmail').value.trim();
    const message = document.getElementById('contactFormMessageText').value.trim();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    // Validation
    if (!name || !email || !message) {
      showStatus('Please fill in all fields.', 'error');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }
    
    // Disable submit button and show loading state
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusDiv.style.display = 'none';
    
    try {
      // Check if Supabase is available
      if (!window.supabase) {
        throw new Error('Database connection not available. Please try again later.');
      }
      
      // Save message to database
      const messageData = {
        name,
        email,
        message,
        status: 'new'
      };
      
      const { data, error } = await window.supabase
        .from('contact_messages')
        .insert([messageData])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Success
      showStatus('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
      contactForm.reset();
      
      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting contact form:', err);
      
      // Show error message
      const errorMsg = err.message || 'Failed to send message. Please try again later.';
      showStatus(errorMsg, 'error');
      
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
  
  function showStatus(message, type) {
    if (!statusDiv) return;
    
    statusDiv.style.display = 'block';
    statusDiv.textContent = message;
    statusDiv.className = `contact-form-status ${type}`;
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 5000);
    }
  }
})();

