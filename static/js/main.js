/**
 * Main JavaScript file for Aptify
 * Handles common functionality across all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('open');
        });
    }
    
    // Set active nav item based on current page
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.navbar-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath || 
            (currentPath.includes(href) && href !== '/')) {
            item.classList.add('active');
        }
    });
    
    // Close nav menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navbarMenu && navbarMenu.classList.contains('open') && 
            !navbarMenu.contains(event.target) && 
            !navbarToggle.contains(event.target)) {
            navbarMenu.classList.remove('open');
        }
    });
    
    // Add accessibility support for keyboard navigation
    navItems.forEach(item => {
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = item.getAttribute('href');
            }
        });
    });
    
    // Initialize tooltips if any
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.setAttribute('role', 'tooltip');
        tooltip.setAttribute('tabindex', '0');
    });
});

/**
 * Format time in MM:SS format
 * @param {number} seconds - Total seconds to format
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Get stored data from localStorage
 * @param {string} key - localStorage key
 * @param {*} defaultValue - Default value if key not found
 * @returns {*} Stored data or default value
 */
function getStoredData(key, defaultValue = null) {
    const data = localStorage.getItem(key);
    if (!data) return defaultValue;
    
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error(`Error parsing data for key ${key}:`, e);
        return defaultValue;
    }
}

/**
 * Store data in localStorage
 * @param {string} key - localStorage key
 * @param {*} data - Data to store
 */
function storeData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Error storing data for key ${key}:`, e);
    }
}

/**
 * Show error message in a container
 * @param {HTMLElement} container - Container element
 * @param {string} message - Error message
 */
function showError(container, message) {
    container.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
    container.style.display = 'block';
}
