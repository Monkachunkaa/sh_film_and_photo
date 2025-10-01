/**
 * Navigation JavaScript - Mobile menu toggle and smooth scrolling
 * Sanford and Hun Film and Photography Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get navigation elements
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navigation = document.querySelector('.navigation');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    const borders = document.querySelectorAll('.border');

    // Mobile menu toggle functionality
    if (mobileMenuToggle && navigation) {
        mobileMenuToggle.addEventListener('click', function() {
            // Toggle active class on navigation
            navigation.classList.toggle('active');
            const isActive = mobileMenuToggle.classList.toggle('active');
            
            // Toggle body scroll lock
            body.classList.toggle('menu-open');
            
            // Handle border animations
            if (isActive) {
                // Menu is opening - remove unactive class to trigger animations
                borders.forEach(border => {
                    border.classList.remove('unactive');
                });
            } else {
                // Menu is closing - add unactive class to trigger reverse animations
                borders.forEach(border => {
                    border.classList.add('unactive');
                });
            }
            
            // Update aria-expanded for accessibility
            const isExpanded = navigation.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Close mobile menu when clicking on navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Close mobile menu
            navigation.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            body.classList.remove('menu-open');
            
            // Add unactive class to trigger reverse border animations
            borders.forEach(border => {
                border.classList.add('unactive');
            });
            
            // Update aria-expanded
            mobileMenuToggle.setAttribute('aria-expanded', false);
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navigation.contains(event.target);
        const isClickOnToggle = mobileMenuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navigation.classList.contains('active')) {
            navigation.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            body.classList.remove('menu-open');
            
            // Add unactive class to trigger reverse border animations
            borders.forEach(border => {
                border.classList.add('unactive');
            });
            
            mobileMenuToggle.setAttribute('aria-expanded', false);
        }
    });

    // Handle window resize - close mobile menu if window becomes large
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navigation.classList.contains('active')) {
            navigation.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            body.classList.remove('menu-open');
            
            // Add unactive class to trigger reverse border animations
            borders.forEach(border => {
                border.classList.add('unactive');
            });
            
            mobileMenuToggle.setAttribute('aria-expanded', false);
        }
    });

    // Add scroll effect to header
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove shadow based on scroll position
        if (scrollTop > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Set initial aria-expanded attribute
    if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-expanded', false);
    }
});