/**
 * Navigation Module
 * Handles scroll-based navigation highlighting
 */

let scrollHandler = null;

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNav() {
    const navLinks = document.querySelectorAll('.smart-nav a');
    const sections = document.querySelectorAll('.day-section');

    let currentSection = '';
    const scrollOffset = 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - scrollOffset) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');

        // Handle both anchor links and top link
        if (href && href.includes(currentSection) && currentSection !== '') {
            link.classList.add('active');
        }
    });
}

/**
 * Handle smooth scroll for navigation links
 * @param {Event} event - Click event
 */
function handleNavClick(event) {
    const link = event.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    event.preventDefault();

    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 100;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

/**
 * Initialize navigation functionality
 */
export function initNavigation() {
    const nav = document.querySelector('.smart-nav');

    // Set up scroll listener with passive flag for performance
    scrollHandler = updateActiveNav;
    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Set up click handler for smooth scrolling
    if (nav) {
        nav.addEventListener('click', handleNavClick);
    }

    // Initial update
    updateActiveNav();
}

/**
 * Cleanup navigation listeners
 */
export function destroyNavigation() {
    if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
        scrollHandler = null;
    }

    const nav = document.querySelector('.smart-nav');
    if (nav) {
        nav.removeEventListener('click', handleNavClick);
    }
}
