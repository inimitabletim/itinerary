/**
 * Main Application Entry Point
 * Initializes all modules and coordinates the app lifecycle
 */

import { initCountdown, destroyCountdown } from './modules/countdown.js';
import { initCrowd, destroyCrowd } from './modules/crowd.js';
import { initWeather, destroyWeather } from './modules/weather.js';
import { initNavigation, destroyNavigation } from './modules/navigation.js';
import { initAnimations, destroyAnimations } from './modules/animations.js';
import { initErrorHandler } from './modules/error-handler.js';

/**
 * Initialize all application modules
 */
function initApp() {
    console.log('🏮 Initializing 2026 馬年春節孝親之旅 App');

    // Initialize error handler first
    initErrorHandler();

    // Initialize all feature modules
    initCountdown();
    initCrowd();
    initWeather();
    initNavigation();
    initAnimations();

    console.log('✅ App initialized successfully');
}

/**
 * Cleanup all application modules
 * Called before page unload
 */
function cleanupApp() {
    destroyCountdown();
    destroyCrowd();
    destroyWeather();
    destroyNavigation();
    destroyAnimations();
}

/**
 * Register Service Worker for PWA support
 */
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration.scope);
        } catch (error) {
            console.warn('Service Worker registration failed:', error);
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Register service worker
registerServiceWorker();

// Cleanup on page unload
window.addEventListener('beforeunload', cleanupApp);

// Export for potential external use
export { initApp, cleanupApp };
