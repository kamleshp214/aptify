/**
 * Mobile navigation handler for Aptify
 */
document.addEventListener('DOMContentLoaded', () => {
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');

    if (navbarToggle && navbarMenu) {
        // Toggle menu and icon
        const toggleMenu = () => {
            navbarMenu.classList.toggle('open');
            const icon = navbarToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        };

        // Click event
        navbarToggle.addEventListener('click', toggleMenu);

        // Touch event for mobile
        navbarToggle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (navbarMenu.classList.contains('open') &&
                !navbarMenu.contains(event.target) &&
                !navbarToggle.contains(event.target)) {
                navbarMenu.classList.remove('open');
                const icon = navbarToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navbarMenu.classList.contains('open')) {
                navbarMenu.classList.remove('open');
                const icon = navbarToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    }
});