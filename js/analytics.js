/**
 * Google Analytics 4 Event Tracking Module
 * 
 * This module provides helper functions to track custom events in Google Analytics.
 * It ensures gtag is loaded before attempting to send events and provides
 * a clean API for tracking user interactions across the site.
 * 
 * Usage:
 * window.Analytics.trackEvent('button_click', { button_name: 'Contact Us' });
 * window.Analytics.trackFormSubmission('contact');
 */

(function() {
    'use strict';
    
    /**
     * Check if Google Analytics (gtag) is loaded and available
     * @returns {boolean} True if gtag is available
     */
    function isGtagLoaded() {
        return typeof window.gtag === 'function';
    }

    /**
     * Generic event tracking function
     * Sends a custom event to Google Analytics with optional parameters
     * 
     * @param {string} eventName - The name of the event (e.g., 'button_click', 'video_play')
     * @param {Object} eventParams - Additional parameters to send with the event
     */
    function trackEvent(eventName, eventParams) {
        eventParams = eventParams || {};
        
        if (!isGtagLoaded()) {
            console.warn('Google Analytics not loaded. Event not tracked:', eventName);
            return;
        }
        
        try {
            window.gtag('event', eventName, eventParams);
            console.log('Analytics event tracked:', eventName, eventParams);
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }

    /**
     * Track contact form submissions
     * Sends a conversion event when the contact form is successfully submitted
     * 
     * @param {string} formType - Type of form submitted (e.g., 'contact', 'booking')
     * @param {Object} additionalParams - Any additional parameters to include
     */
    function trackFormSubmission(formType, additionalParams) {
        formType = formType || 'contact';
        additionalParams = additionalParams || {};
        
        trackEvent('form_submission', Object.assign({
            form_type: formType
        }, additionalParams));
    }

    /**
     * Track navigation between pages/sections
     * Useful for tracking which portfolio sections users visit
     * 
     * @param {string} destination - Where the user is navigating to
     * @param {string} source - Where the user is navigating from
     */
    function trackNavigation(destination, source) {
        source = source || 'unknown';
        
        trackEvent('navigation', {
            destination: destination,
            source: source
        });
    }

    /**
     * Track gallery interactions
     * Records when users interact with image galleries
     * 
     * @param {string} galleryName - Name of the gallery (e.g., 'weddings', 'family')
     * @param {string} action - The action performed (e.g., 'open', 'next_image', 'close')
     * @param {number} imageIndex - Optional: the index of the image being viewed
     */
    function trackGalleryInteraction(galleryName, action, imageIndex) {
        var params = {
            gallery_name: galleryName,
            action: action
        };
        
        if (imageIndex !== null && imageIndex !== undefined) {
            params.image_index = imageIndex;
        }
        
        trackEvent('gallery_interaction', params);
    }

    /**
     * Track external link clicks
     * Records when users click links to external sites (social media, etc.)
     * 
     * @param {string} linkUrl - The URL being clicked
     * @param {string} linkText - The text/label of the link
     */
    function trackExternalLink(linkUrl, linkText) {
        linkText = linkText || '';
        
        trackEvent('external_link_click', {
            link_url: linkUrl,
            link_text: linkText,
            outbound: true
        });
    }

    /**
     * Track video interactions
     * Records video plays, pauses, and completions
     * 
     * @param {string} action - The video action (e.g., 'play', 'pause', 'complete')
     * @param {string} videoTitle - Title or identifier of the video
     */
    function trackVideoInteraction(action, videoTitle) {
        videoTitle = videoTitle || '';
        
        trackEvent('video_interaction', {
            action: action,
            video_title: videoTitle
        });
    }

    /**
     * Track slideshow interactions
     * Records when users interact with image slideshows
     * 
     * @param {string} slideshowName - Name of the slideshow (e.g., 'hero', 'wedding')
     * @param {string} action - The action performed (e.g., 'next', 'previous', 'auto_advance')
     */
    function trackSlideshowInteraction(slideshowName, action) {
        trackEvent('slideshow_interaction', {
            slideshow_name: slideshowName,
            action: action
        });
    }

    /**
     * Initialize analytics event listeners for common elements
     * This function should be called on page load to set up automatic tracking
     * for elements like external links, buttons, etc.
     */
    function initializeAnalytics() {
        if (!isGtagLoaded()) {
            console.warn('Google Analytics not loaded. Event listeners not initialized.');
            return;
        }
        
        // Track all external links automatically
        document.addEventListener('click', function(e) {
            var link = e.target.closest('a');
            if (!link) return;
            
            var href = link.getAttribute('href');
            if (!href) return;
            
            // Check if it's an external link (starts with http/https and not same domain)
            if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                trackExternalLink(href, link.textContent.trim());
            }
        });
        
        console.log('Analytics event listeners initialized');
    }

    // Auto-initialize when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAnalytics);
    } else {
        initializeAnalytics();
    }

    // Expose Analytics functions globally
    window.Analytics = {
        trackEvent: trackEvent,
        trackFormSubmission: trackFormSubmission,
        trackNavigation: trackNavigation,
        trackGalleryInteraction: trackGalleryInteraction,
        trackExternalLink: trackExternalLink,
        trackVideoInteraction: trackVideoInteraction,
        trackSlideshowInteraction: trackSlideshowInteraction
    };

})();
