/**
 * Contact Form JavaScript
 * Handles form submission and validation
 * Sanford and Hun Film and Photography Website
 */

class ContactForm {
    constructor() {
        // DOM elements
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.btnText = this.submitBtn.querySelector('.btn-text');
        this.btnLoading = this.submitBtn.querySelector('.btn-loading');
        this.successMessage = document.getElementById('successMessage');
        this.errorMessage = document.getElementById('errorMessage');
        
        // Form inputs
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.phoneInput = document.getElementById('phone');
        this.messageInput = document.getElementById('message');
        
        // Initialize form
        this.init();
    }
    
    /**
     * Initialize the contact form
     */
    init() {
        if (!this.form) return;
        
        // Bind event listeners
        this.bindEvents();
        
        // Set up form validation
        this.setupValidation();
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Form submission
        this.submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Enter key submission for inputs
        [this.nameInput, this.emailInput, this.phoneInput].forEach(input => {
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleSubmit();
                    }
                });
            }
        });
        
        // Real-time validation on blur (only show errors for non-empty invalid fields)
        this.emailInput?.addEventListener('blur', () => {
            this.validateEmail(false); // Don't show error for empty field
        });
        
        this.nameInput?.addEventListener('blur', () => {
            this.validateName(false); // Don't show error for empty field
        });
        
        this.messageInput?.addEventListener('blur', () => {
            this.validateMessage(false); // Don't show error for empty field
        });
    }
    
    /**
     * Set up form validation styling
     */
    setupValidation() {
        // Add validation classes to inputs
        [this.nameInput, this.emailInput, this.messageInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    this.clearValidationState(input);
                });
            }
        });
    }
    
    /**
     * Validate name field
     * @param {boolean} showErrorForEmpty - Whether to show error state for empty fields
     */
    validateName(showErrorForEmpty = false) {
        const name = this.nameInput?.value.trim();
        
        // If field is empty and we're not showing errors for empty fields, clear validation state
        if (!name && !showErrorForEmpty) {
            this.clearValidationState(this.nameInput);
            return false;
        }
        
        // Field has content or we're showing errors for empty fields
        if (!name || name.length < 2) {
            this.setValidationState(this.nameInput, false);
            return false;
        }
        this.setValidationState(this.nameInput, true);
        return true;
    }
    
    /**
     * Validate email field
     * @param {boolean} showErrorForEmpty - Whether to show error state for empty fields
     */
    validateEmail(showErrorForEmpty = false) {
        const email = this.emailInput?.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // If field is empty and we're not showing errors for empty fields, clear validation state
        if (!email && !showErrorForEmpty) {
            this.clearValidationState(this.emailInput);
            return false;
        }
        
        // Field has content or we're showing errors for empty fields
        if (!email || !emailRegex.test(email)) {
            this.setValidationState(this.emailInput, false);
            return false;
        }
        this.setValidationState(this.emailInput, true);
        return true;
    }
    
    /**
     * Validate message field
     * @param {boolean} showErrorForEmpty - Whether to show error state for empty fields
     */
    validateMessage(showErrorForEmpty = false) {
        const message = this.messageInput?.value.trim();
        
        // If field is empty and we're not showing errors for empty fields, clear validation state
        if (!message && !showErrorForEmpty) {
            this.clearValidationState(this.messageInput);
            return false;
        }
        
        // Field has content or we're showing errors for empty fields
        if (!message || message.length < 10) {
            this.setValidationState(this.messageInput, false);
            return false;
        }
        this.setValidationState(this.messageInput, true);
        return true;
    }
    
    /**
     * Set validation state for input
     */
    setValidationState(input, isValid) {
        if (!input) return;
        
        if (isValid) {
            input.style.borderColor = '#4caf50';
        } else {
            input.style.borderColor = '#ef4444';
        }
    }
    
    /**
     * Clear validation state for input
     */
    clearValidationState(input) {
        if (!input) return;
        input.style.borderColor = '';
    }
    
    /**
     * Validate entire form (for submission - show errors for empty required fields)
     */
    validateForm() {
        const isNameValid = this.validateName(true);     // Show error for empty required field
        const isEmailValid = this.validateEmail(true);   // Show error for empty required field
        const isMessageValid = this.validateMessage(true); // Show error for empty required field
        
        return isNameValid && isEmailValid && isMessageValid;
    }
    
    /**
     * Handle form submission
     */
    async handleSubmit() {
        // Hide any existing messages
        this.hideMessages();
        
        // Validate form
        if (!this.validateForm()) {
            this.showError('Please fill in all required fields correctly.');
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        // Collect form data
        const formData = {
            name: this.nameInput?.value.trim(),
            email: this.emailInput?.value.trim(),
            phone: this.phoneInput?.value.trim(),
            message: this.messageInput?.value.trim(),
            timestamp: new Date().toISOString(),
            source: 'contact-form'
        };
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await this.submitForm(formData);
            
            // Show success message
            this.showSuccess();
            
            // Reset form
            this.resetForm();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('Sorry, there was an error sending your message. Please try again or contact us directly.');
        } finally {
            // Hide loading state
            this.setLoadingState(false);
        }
    }
    
    /**
     * Submit form data to Netlify Function
     */
    async submitForm(formData) {
        // Make actual API call to Netlify function
        const response = await fetch('/.netlify/functions/contact-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // Check if response was successful
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to send message');
        }
        
        // Return the response data
        return response.json();
    }
    
    /**
     * Set loading state
     */
    setLoadingState(isLoading) {
        if (!this.submitBtn || !this.btnText || !this.btnLoading) return;
        
        this.submitBtn.disabled = isLoading;
        
        if (isLoading) {
            this.btnText.style.display = 'none';
            this.btnLoading.style.display = 'inline';
        } else {
            this.btnText.style.display = 'inline';
            this.btnLoading.style.display = 'none';
        }
    }
    
    /**
     * Show success message
     */
    showSuccess() {
        this.hideMessages();
        if (this.successMessage) {
            this.successMessage.style.display = 'block';
            this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    /**
     * Show error message
     */
    showError(message) {
        this.hideMessages();
        if (this.errorMessage) {
            const errorText = this.errorMessage.querySelector('.error-text');
            if (errorText) {
                errorText.innerHTML = message;
            }
            this.errorMessage.style.display = 'block';
            this.errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    /**
     * Hide all messages
     */
    hideMessages() {
        if (this.successMessage) {
            this.successMessage.style.display = 'none';
        }
        if (this.errorMessage) {
            this.errorMessage.style.display = 'none';
        }
    }
    
    /**
     * Reset form to initial state
     */
    resetForm() {
        // Clear all input values
        [this.nameInput, this.emailInput, this.phoneInput, this.messageInput].forEach(input => {
            if (input) {
                input.value = '';
                this.clearValidationState(input);
            }
        });
        
        // Hide form and keep success message visible
        if (this.form) {
            this.form.style.display = 'none';
        }
    }
}

// Initialize contact form when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactForm;
}
