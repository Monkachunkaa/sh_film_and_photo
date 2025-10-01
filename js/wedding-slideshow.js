/**
 * Wedding Slideshow JavaScript - Automatic image rotation for wedding gallery
 * Sanford and Hun Film and Photography Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wedding slideshow configuration
    const SLIDE_DURATION = 6000; // 6 seconds - good pace for 4 images
    
    // Get slideshow elements
    const weddingSlides = document.querySelectorAll('.wedding-slide');
    
    if (weddingSlides.length === 0) {
        console.warn('No wedding slides found');
        return;
    }
    
    console.log(`Found ${weddingSlides.length} wedding slides`); // Debug log
    
    let currentSlideIndex = 0;
    let slideInterval;
    
    /**
     * Show a specific slide by index
     * @param {number} index - The index of the slide to show
     */
    function showSlide(index) {
        console.log(`Showing wedding slide ${index}`); // Debug log
        
        // Remove active class from all slides
        weddingSlides.forEach((slide, i) => {
            slide.classList.remove('active');
        });
        
        // Add active class to current slide
        if (weddingSlides[index]) {
            weddingSlides[index].classList.add('active');
            currentSlideIndex = index;
        }
    }
    
    /**
     * Move to the next slide
     */
    function nextSlide() {
        const nextIndex = (currentSlideIndex + 1) % weddingSlides.length;
        console.log(`Moving from wedding slide ${currentSlideIndex} to slide ${nextIndex}`); // Debug log
        showSlide(nextIndex);
    }
    
    /**
     * Start the automatic slideshow
     */
    function startSlideshow() {
        console.log('Starting wedding slideshow'); // Debug log
        
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        
        slideInterval = setInterval(() => {
            console.log('Wedding slideshow interval triggered'); // Debug log
            nextSlide();
        }, SLIDE_DURATION);
    }
    
    /**
     * Stop the automatic slideshow
     */
    function stopSlideshow() {
        console.log('Stopping wedding slideshow'); // Debug log
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    /**
     * Preload wedding images for smoother transitions
     */
    function preloadImages() {
        weddingSlides.forEach((slide, index) => {
            const img = slide.querySelector('.wedding-image');
            if (img && img.src) {
                const preloadImg = new Image();
                preloadImg.src = img.src;
            }
        });
    }
    
    // Initialize slideshow
    function initSlideshow() {
        console.log('Initializing wedding slideshow'); // Debug log
        
        // Ensure first slide is active
        showSlide(0);
        
        // Preload images
        preloadImages();
        
        // Start automatic slideshow
        startSlideshow();
    }
    
    /**
     * Handle page visibility change to pause slideshow when tab is not visible
     */
    function handleVisibilityChange() {
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                stopSlideshow();
            } else {
                startSlideshow();
            }
        });
    }
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        console.log('Reduced motion preferred - wedding slideshow will not auto-advance');
        showSlide(0); // Just show the first slide
    } else {
        console.log('Starting wedding slideshow functionality');
        initSlideshow();
        handleVisibilityChange();
    }
    
    // Listen for changes in motion preference
    prefersReducedMotion.addEventListener('change', function() {
        if (this.matches) {
            stopSlideshow();
        } else {
            startSlideshow();
        }
    });
    
    // Expose methods globally for debugging
    window.weddingSlideshow = {
        next: nextSlide,
        goTo: showSlide,
        start: startSlideshow,
        stop: stopSlideshow,
        getCurrentSlide: () => currentSlideIndex,
        getTotalSlides: () => weddingSlides.length
    };
    
    console.log('Wedding slideshow script loaded successfully');
});