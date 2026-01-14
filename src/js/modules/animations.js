/**
 * Animations Module
 * Handles scroll-triggered animations using Intersection Observer
 */

let observer = null;

/**
 * Callback for intersection observer
 * @param {IntersectionObserverEntry[]} entries - Observed entries
 */
function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Optionally stop observing after animation triggers
            // observer.unobserve(entry.target);
        }
    });
}

/**
 * Initialize scroll animations
 */
export function initAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // If user prefers reduced motion, show all sections immediately
        document.querySelectorAll('.day-section').forEach(section => {
            section.classList.add('visible');
        });
        return;
    }

    // Create intersection observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% visible
    };

    observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe all day sections
    document.querySelectorAll('.day-section').forEach(section => {
        observer.observe(section);
    });
}

/**
 * Cleanup animations observer
 */
export function destroyAnimations() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
}

/**
 * Manually trigger animation for a specific element
 * @param {HTMLElement} element - Element to animate
 */
export function animateElement(element) {
    if (element) {
        element.classList.add('visible');
    }
}

/**
 * Reset animations for all sections
 */
export function resetAnimations() {
    document.querySelectorAll('.day-section').forEach(section => {
        section.classList.remove('visible');
    });

    // Re-initialize observer
    destroyAnimations();
    initAnimations();
}
