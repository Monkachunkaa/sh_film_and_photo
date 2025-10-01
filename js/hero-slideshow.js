/**
 * Hero Slideshow JavaScript - Automatic image rotation every 5 seconds
 * Sanford and Hun Film and Photography Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Hero slideshow configuration
    const SLIDE_DURATION = 8000; // 8 seconds
    
    // Get slideshow elements
    const heroSlides = document.querySelectorAll('.hero-slide');
    
    if (heroSlides.length === 0) {
        console.warn('No hero slides found');
        return;
    }
    
    console.log(`Found ${heroSlides.length} hero slides`); // Debug log
    
    let currentSlideIndex = 0;
    let slideInterval;
    
    /**
     * Show a specific slide by index
     * @param {number} index - The index of the slide to show
     */
    function showSlide(index) {
        console.log(`Showing slide ${index}`); // Debug log
        
        // Remove active class from all slides
        heroSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            console.log(`Removed active from slide ${i}`); // Debug log
        });
        
        // Add active class to current slide
        if (heroSlides[index]) {
            heroSlides[index].classList.add('active');
            currentSlideIndex = index;
            console.log(`Added active to slide ${index}`); // Debug log
        }
    }
    
    /**
     * Move to the next slide
     */
    function nextSlide() {
        const nextIndex = (currentSlideIndex + 1) % heroSlides.length;
        console.log(`Moving from slide ${currentSlideIndex} to slide ${nextIndex}`); // Debug log
        
        // Track slideshow auto-advance
        if (window.Analytics) {
            window.Analytics.trackSlideshowInteraction('hero', 'auto_advance');
        }
        
        showSlide(nextIndex);
    }
    
    /**
     * Start the automatic slideshow
     */
    function startSlideshow() {
        console.log('Starting slideshow'); // Debug log
        
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        
        slideInterval = setInterval(() => {
            console.log('Interval triggered - advancing slide'); // Debug log
            nextSlide();
        }, SLIDE_DURATION);
    }
    
    /**
     * Stop the automatic slideshow
     */
    function stopSlideshow() {
        console.log('Stopping slideshow'); // Debug log
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    // Initialize slideshow
    function initSlideshow() {
        console.log('Initializing slideshow'); // Debug log
        
        // Ensure first slide is active
        showSlide(0);
        
        // Start automatic slideshow
        startSlideshow();
    }
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        console.log('Reduced motion preferred - slideshow will not auto-advance');
        showSlide(0); // Just show the first slide
    } else {
        console.log('Starting full slideshow functionality');
        initSlideshow();
    }
    
    // Expose methods globally for debugging
    window.heroSlideshow = {
        next: nextSlide,
        goTo: showSlide,
        start: startSlideshow,
        stop: stopSlideshow,
        getCurrentSlide: () => currentSlideIndex,
        getTotalSlides: () => heroSlides.length
    };
    
    console.log('Hero slideshow script loaded successfully');
});