/**
 * Global JavaScript - Site-wide functionality
 * Sanford and Hun Film and Photography Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set current year for copyright
    setCopyrightYear();
});

/**
 * Set the current year in the copyright notice
 */
function setCopyrightYear() {
    const copyrightYearElement = document.getElementById('copyright-year');
    
    if (copyrightYearElement) {
        const currentYear = new Date().getFullYear();
        copyrightYearElement.textContent = currentYear;
    }
}