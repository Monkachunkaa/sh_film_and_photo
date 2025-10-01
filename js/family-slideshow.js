/**
 * Family Slideshow JavaScript
 * Handles the family slideshow functionality with auto-advance
 * Sanford and Hun Film and Photography Website
 */

class FamilySlideshow {
    constructor() {
        // Configuration
        this.slideInterval = 5000; // 5 seconds between slides
        this.currentSlide = 0;
        this.intervalId = null;
        
        // DOM elements
        this.slideContainer = document.querySelector('.family-slides');
        this.slides = document.querySelectorAll('.family-slide');
        
        // Initialize slideshow
        this.init();
    }
    
    /**
     * Initialize the slideshow
     */
    init() {
        if (!this.slideContainer || this.slides.length === 0) {
            return;
        }
        
        // Start the slideshow
        this.startSlideshow();
        
        // Pause on hover, resume on mouse leave
        this.bindHoverEvents();
        
        // Handle visibility change (pause when tab is not active)
        this.bindVisibilityEvents();
    }
    
    /**
     * Start the automatic slideshow
     */
    startSlideshow() {
        // Clear any existing interval
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        
        // Set up the interval
        this.intervalId = setInterval(() => {
            this.nextSlide();
        }, this.slideInterval);
    }
    
    /**
     * Stop the slideshow
     */
    stopSlideshow() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    /**
     * Move to the next slide
     */
    nextSlide() {
        // Remove active class from current slide
        this.slides[this.currentSlide].classList.remove('active');
        
        // Move to next slide (with wrap-around)
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        
        // Add active class to new slide
        this.slides[this.currentSlide].classList.add('active');
    }
    
    /**
     * Move to a specific slide
     */
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            // Remove active class from current slide
            this.slides[this.currentSlide].classList.remove('active');
            
            // Update current slide index
            this.currentSlide = index;
            
            // Add active class to new slide
            this.slides[this.currentSlide].classList.add('active');
        }
    }
    
    /**
     * Bind hover events to pause/resume slideshow
     */
    bindHoverEvents() {
        if (this.slideContainer) {
            // Pause slideshow on hover
            this.slideContainer.addEventListener('mouseenter', () => {
                this.stopSlideshow();
            });
            
            // Resume slideshow when mouse leaves
            this.slideContainer.addEventListener('mouseleave', () => {
                this.startSlideshow();
            });
        }
    }
    
    /**
     * Bind visibility change events to pause when tab is not active
     */
    bindVisibilityEvents() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Tab is not active, pause slideshow
                this.stopSlideshow();
            } else {
                // Tab is active again, resume slideshow
                this.startSlideshow();
            }
        });
    }
    
    /**
     * Cleanup method for removing event listeners and intervals
     */
    destroy() {
        this.stopSlideshow();
        
        if (this.slideContainer) {
            this.slideContainer.removeEventListener('mouseenter', this.stopSlideshow);
            this.slideContainer.removeEventListener('mouseleave', this.startSlideshow);
        }
    }
}

// Initialize slideshow when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FamilySlideshow();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, slideshow will be paused by the class
    } else {
        // Page is visible again, slideshow will resume
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FamilySlideshow;
}
