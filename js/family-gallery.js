/**
 * Family Gallery JavaScript
 * Handles the modern family gallery with lightbox functionality
 * Sanford and Hun Film and Photography Website
 */

class FamilyGallery {
    constructor() {
        // Gallery configuration - using family gallery images
        // Gallery images with SEO-optimized alt text for Hickory, NC family photography
        this.galleryImages = [
            { src: 'images/family-gallery/04dba80f.webp', alt: 'Hickory NC family photographer - Beautiful family portrait outdoors' },
            { src: 'images/family-gallery/472e37d6.webp', alt: 'Family photography Hickory - Joy and laughter moment' },
            { src: 'images/family-gallery/74b011e7.webp', alt: 'Children playing together - Family session North Carolina' },
            { src: 'images/family-gallery/888d0dea.webp', alt: 'Family love and connection - Hickory NC photographer' },
            { src: 'images/family-gallery/9435438b.webp', alt: 'Candid family moment - Professional family photography' },
            { src: 'images/family-gallery/a918a03c.webp', alt: 'Family celebration photography - Hickory North Carolina' },
            { src: 'images/family-gallery/c6b65462.webp', alt: 'Sweet family embrace - NC family photo session' },
            { src: 'images/family-gallery/c8e26c38.webp', alt: 'Family adventure together - Hickory family photographer' }
        ];
        
        // Gallery state
        this.currentImageIndex = 0;
        this.imagesPerLoad = 6; // Show 6 images initially, then load more
        this.loadedImagesCount = 0;
        
        // DOM elements
        this.galleryContainer = document.getElementById('familyGallery');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.lightboxOverlay = document.getElementById('lightboxOverlay');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxClose = document.getElementById('lightboxClose');
        this.lightboxPrev = document.getElementById('lightboxPrev');
        this.lightboxNext = document.getElementById('lightboxNext');
        this.lightboxCounter = document.getElementById('lightboxCounter');
        
        // Initialize gallery
        this.init();
    }
    
    /**
     * Initialize the gallery
     */
    init() {
        if (!this.galleryContainer) return;
        
        // Load initial images
        this.loadImages();
        
        // Bind event listeners
        this.bindEvents();
        
        // Set up intersection observer for lazy loading effect
        this.setupIntersectionObserver();
    }
    
    /**
     * Load images into the gallery
     */
    loadImages() {
        const fragment = document.createDocumentFragment();
        const imagesToLoad = Math.min(
            this.imagesPerLoad, 
            this.galleryImages.length - this.loadedImagesCount
        );
        
        for (let i = 0; i < imagesToLoad; i++) {
            const imageIndex = this.loadedImagesCount + i;
            const image = this.galleryImages[imageIndex];
            
            if (image) {
                const galleryItem = this.createGalleryItem(image, imageIndex);
                fragment.appendChild(galleryItem);
            }
        }
        
        this.galleryContainer.appendChild(fragment);
        this.loadedImagesCount += imagesToLoad;
        
        // Hide load more button if all images are loaded
        if (this.loadedImagesCount >= this.galleryImages.length) {
            this.loadMoreBtn.style.display = 'none';
        }
    }
    
    /**
     * Create a gallery item element
     */
    createGalleryItem(image, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-index', index);
        
        // Create image element
        const img = document.createElement('img');
        img.className = 'gallery-image';
        img.src = image.src;
        img.alt = image.alt;
        img.loading = 'lazy'; // Native lazy loading
        
        // Add click handler for lightbox
        item.addEventListener('click', () => {
            this.openLightbox(index);
        });
        
        // Add hover effect class after image loads
        img.addEventListener('load', () => {
            item.classList.add('loaded');
        });
        
        item.appendChild(img);
        return item;
    }
    
    /**
     * Set up intersection observer for animation effects
     */
    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        // Observe gallery items as they're added
        const observeNewItems = () => {
            const items = this.galleryContainer.querySelectorAll('.gallery-item:not(.observed)');
            items.forEach(item => {
                observer.observe(item);
                item.classList.add('observed');
            });
        };
        
        // Initial observation
        setTimeout(observeNewItems, 100);
        
        // Store observer reference for future use
        this.observer = observer;
        this.observeNewItems = observeNewItems;
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Load more button
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                // Track load more action
                if (window.Analytics) {
                    window.Analytics.trackGalleryInteraction('family', 'load_more', this.loadedImagesCount);
                }
                
                this.loadImages();
                // Observe newly added items
                setTimeout(this.observeNewItems, 100);
            });
        }
        
        // Lightbox controls
        if (this.lightboxClose) {
            this.lightboxClose.addEventListener('click', () => this.closeLightbox());
        }
        
        if (this.lightboxPrev) {
            this.lightboxPrev.addEventListener('click', () => this.previousImage());
        }
        
        if (this.lightboxNext) {
            this.lightboxNext.addEventListener('click', () => this.nextImage());
        }
        
        // Lightbox overlay click to close
        if (this.lightboxOverlay) {
            this.lightboxOverlay.addEventListener('click', (e) => {
                if (e.target === this.lightboxOverlay) {
                    this.closeLightbox();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightboxOverlay.classList.contains('active')) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });
    }
    
    /**
     * Open lightbox with specific image
     */
    openLightbox(index) {
        this.currentImageIndex = index;
        const image = this.galleryImages[index];
        
        if (image && this.lightboxOverlay && this.lightboxImage) {
            // Set image source
            this.lightboxImage.src = image.src;
            this.lightboxImage.alt = image.alt;
            
            // Update counter
            this.updateCounter();
            
            // Track lightbox open
            if (window.Analytics) {
                window.Analytics.trackGalleryInteraction('family', 'open', index);
            }
            
            // Show lightbox
            this.lightboxOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Focus management for accessibility
            this.lightboxClose.focus();
        }
    }
    
    /**
     * Close lightbox
     */
    closeLightbox() {
        if (this.lightboxOverlay) {
            // Track lightbox close
            if (window.Analytics) {
                window.Analytics.trackGalleryInteraction('family', 'close', this.currentImageIndex);
            }
            
            this.lightboxOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
    
    /**
     * Show previous image
     */
    previousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
        
        // Track navigation
        if (window.Analytics) {
            window.Analytics.trackGalleryInteraction('family', 'previous', this.currentImageIndex);
        }
        
        this.updateLightboxImage();
    }
    
    /**
     * Show next image
     */
    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryImages.length;
        
        // Track navigation
        if (window.Analytics) {
            window.Analytics.trackGalleryInteraction('family', 'next', this.currentImageIndex);
        }
        
        this.updateLightboxImage();
    }
    
    /**
     * Update lightbox image
     */
    updateLightboxImage() {
        const image = this.galleryImages[this.currentImageIndex];
        if (image && this.lightboxImage) {
            this.lightboxImage.src = image.src;
            this.lightboxImage.alt = image.alt;
            this.updateCounter();
        }
    }
    
    /**
     * Update image counter
     */
    updateCounter() {
        if (this.lightboxCounter) {
            this.lightboxCounter.textContent = `${this.currentImageIndex + 1} / ${this.galleryImages.length}`;
        }
    }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FamilyGallery();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FamilyGallery;
}
