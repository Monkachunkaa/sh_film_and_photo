/**
 * Contact Form Handler (Frontend)
 * 
 * This script handles the contact form submission on the frontend.
 * It sends form data to the Netlify serverless function which processes
 * the submission and sends an email via AWS SES.
 * 
 * Usage: Include this script on your contact.html page and ensure your
 * form has the correct field names and an ID of "contactForm"
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // Get the contact form element
  const contactForm = document.getElementById('contactForm');
  
  // If the form doesn't exist on this page, exit
  if (!contactForm) {
    return;
  }

  // Add submit event listener to the form
  contactForm.addEventListener('submit', async function(e) {
    // Prevent default form submission (page reload)
    e.preventDefault();
    
    // Get the submit button and form status elements
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formStatus = document.getElementById('formStatus');
    
    // Disable the submit button to prevent duplicate submissions
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }
    
    try {
      // Collect form data
      const formData = {
        name: contactForm.querySelector('[name="name"]').value.trim(),
        email: contactForm.querySelector('[name="email"]').value.trim(),
        phone: contactForm.querySelector('[name="phone"]').value.trim(),
        eventType: contactForm.querySelector('[name="eventType"]').value,
        eventDate: contactForm.querySelector('[name="eventDate"]')?.value || '',
        message: contactForm.querySelector('[name="message"]').value.trim()
      };
      
      // Basic client-side validation
      if (!formData.name || !formData.email || !formData.phone || !formData.eventType || !formData.message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }
      
      // Send the form data to the Netlify function
      const response = await fetch('/.netlify/functions/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      // Parse the response
      const result = await response.json();
      
      // Handle the response based on status code
      if (response.ok) {
        // Success! Show success message
        showFormMessage(
          'Thank you for your message! We\'ll get back to you soon.',
          'success'
        );
        
        // Reset the form
        contactForm.reset();
      } else {
        // Error from server
        showFormMessage(
          result.error || 'Something went wrong. Please try again.',
          'error'
        );
      }
      
    } catch (error) {
      // Network or other error
      console.error('Form submission error:', error);
      showFormMessage(
        'Unable to send message. Please check your connection and try again.',
        'error'
      );
    } finally {
      // Re-enable the submit button
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    }
  });
  
  /**
   * Display a status message to the user
   * @param {string} message - The message to display
   * @param {string} type - The type of message ('success' or 'error')
   */
  function showFormMessage(message, type) {
    const formStatus = document.getElementById('formStatus');
    
    if (!formStatus) {
      // If no status element exists, create one
      const statusDiv = document.createElement('div');
      statusDiv.id = 'formStatus';
      contactForm.insertBefore(statusDiv, contactForm.firstChild);
      return showFormMessage(message, type);
    }
    
    // Set the message and styling
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
    
    // Add styles if they don't exist
    if (!document.getElementById('formStatusStyles')) {
      const style = document.createElement('style');
      style.id = 'formStatusStyles';
      style.textContent = `
        .form-status {
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 4px;
          font-weight: 500;
          text-align: center;
        }
        .form-status.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .form-status.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 5000);
    }
  }
});
