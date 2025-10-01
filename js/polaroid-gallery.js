/**
 * Wedding Gallery Polaroid JavaScript - Random rotation and animation delays
 * Sanford and Hun Film and Photography Website
 */

document.addEventListener('DOMContentLoaded', function() {
    setupPolaroids();
});

/**
 * Set up polaroid effects with random rotation and animation delays
 */
function setupPolaroids() {
    const polaroids = document.querySelectorAll('.polaroid');
    
    if (polaroids.length === 0) {
        console.warn('No polaroid elements found');
        return;
    }
    
    console.log(`Setting up ${polaroids.length} polaroid effects`);
    
    polaroids.forEach((polaroid, index) => {
        // No rotation - clean grid alignment
        
        // Random animation delay for staggered photo fade-in effect
        const delay = Math.random() * 1; // 0 to 1 second delay
        const img = polaroid.querySelector('.gallery-image');
        
        if (img) {
            img.style.animationDelay = `${delay}s`;
        }
        
        // Log for debugging
        console.log(`Polaroid ${index + 1}: delay ${delay.toFixed(2)}s`);
    });
    
    console.log('Polaroid effects setup complete');
}