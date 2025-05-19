/**
 * Animation utilities for Aptify
 * Handles animations, transitions, and visual effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all fade-in elements
    initFadeIn();
    
    // Initialize glassmorphism effects
    initGlassmorphism();
    
    // Add hover animations to cards
    initCardHover();
});

/**
 * Initialize fade-in animations for elements
 * Elements with .fade-in class will fade in when they enter the viewport
 */
function initFadeIn() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length === 0) return;
    
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: '0px'
        });
        
        fadeElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.4s ease-in-out';
            observer.observe(el);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        fadeElements.forEach(el => {
            el.style.opacity = '1';
        });
    }
}

/**
 * Initialize glassmorphism effects
 * Applies backdrop-filter to elements with .glass-card class
 */
function initGlassmorphism() {
    const glassElements = document.querySelectorAll('.glass-card, .modal-content, .custom-quiz, .quiz-container');
    
    glassElements.forEach(el => {
        // Check if backdrop-filter is supported
        const isBackdropSupported = CSS.supports('backdrop-filter', 'blur(8px)');
        
        if (isBackdropSupported) {
            el.style.backdropFilter = 'blur(8px)';
            el.style.webkitBackdropFilter = 'blur(8px)';
        } else {
            // Fallback for browsers that don't support backdrop-filter
            el.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        }
    });
}

/**
 * Initialize hover animations for cards
 */
function initCardHover() {
    const cards = document.querySelectorAll('.feature-card, .category-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            animateCardHover(this, true);
        });
        
        card.addEventListener('mouseleave', function() {
            animateCardHover(this, false);
        });
    });
}

/**
 * Animate card hover effect
 * @param {HTMLElement} card - Card element
 * @param {boolean} isHovering - Whether the card is being hovered
 */
function animateCardHover(card, isHovering) {
    const scale = isHovering ? 'scale(1.05)' : 'scale(1)';
    const shadow = isHovering ? '0 6px 20px rgba(0, 0, 0, 0.15)' : '0 4px 15px rgba(0, 0, 0, 0.1)';
    
    card.style.transform = scale;
    card.style.boxShadow = shadow;
}

/**
 * Add slide-in animation to an element
 * @param {HTMLElement} element - Element to animate
 * @param {string} direction - Direction of slide ('left', 'right', 'up', 'down')
 * @param {number} delay - Delay in milliseconds
 */
function slideIn(element, direction = 'right', delay = 0) {
    if (!element) return;
    
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
    
    let transform;
    switch (direction) {
        case 'left':
            transform = 'translateX(-50px)';
            break;
        case 'right':
            transform = 'translateX(50px)';
            break;
        case 'up':
            transform = 'translateY(-50px)';
            break;
        case 'down':
            transform = 'translateY(50px)';
            break;
        default:
            transform = 'translateX(50px)';
    }
    
    element.style.transform = transform;
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translate(0)';
    }, delay);
}

/**
 * Add fade-in animation to an element
 * @param {HTMLElement} element - Element to animate
 * @param {number} delay - Delay in milliseconds
 */
function fadeIn(element, delay = 0) {
    if (!element) return;
    
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.4s ease-in-out';
    
    setTimeout(() => {
        element.style.opacity = '1';
    }, delay);
}

/**
 * Add pulse animation to an element
 * @param {HTMLElement} element - Element to animate
 * @param {number} duration - Duration in milliseconds
 */
function pulse(element, duration = 1000) {
    if (!element) return;
    
    element.style.animation = `pulse ${duration}ms ease-in-out`;
    
    element.addEventListener('animationend', () => {
        element.style.animation = '';
    }, { once: true });
}

// Add CSS keyframes for pulse animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}
`;
document.head.appendChild(styleSheet);
