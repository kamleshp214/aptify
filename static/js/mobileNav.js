/**
 * Specialized mobile navigation handler for Aptify
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get navigation elements
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    
    // Add click event listener to toggle button
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            // Toggle the 'open' class on the menu
            navbarMenu.classList.toggle('open');
            
            // Change the icon when menu is opened/closed
            const icon = navbarToggle.querySelector('i');
            if (icon) {
                if (navbarMenu.classList.contains('open')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navbarMenu.classList.contains('open') && 
                !navbarMenu.contains(event.target) && 
                !navbarToggle.contains(event.target)) {
                navbarMenu.classList.remove('open');
                
                // Reset icon
                const icon = navbarToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Close menu when pressing escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navbarMenu.classList.contains('open')) {
                navbarMenu.classList.remove('open');
                
                // Reset icon
                const icon = navbarToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
});