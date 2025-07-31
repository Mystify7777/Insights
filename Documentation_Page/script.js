document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link'); // Get all nav links

    // Toggle menu visibility and hamburger icon animation
    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('open');
        menuToggle.classList.toggle('open');
    });

    // Close menu when a nav link is clicked (for single-page navigation)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('open')) {
                navbar.classList.remove('open');
                menuToggle.classList.remove('open');
            }
        });
    });

    // Optional: Add 'active' class to current nav link based on scroll position
    // This part is more complex and would require an Intersection Observer or scroll event listener
    // For now, we'll just handle the menu toggle.
});
