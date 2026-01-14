/**
 * Countdown Module
 * Handles the CNY countdown timer functionality
 */

import { CONFIG } from '../config.js';

let countdownInterval = null;

/**
 * Calculate time difference and update display
 */
function updateCountdown() {
    const now = new Date();
    const targetDate = new Date(CONFIG.trip.startDate);
    const diff = targetDate - now;

    const countdownEl = document.getElementById('countdown-timer');
    if (!countdownEl) return;

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / 1000 / 60) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        countdownEl.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
    } else {
        countdownEl.textContent = '新年快樂！';
        // Stop the interval once countdown is complete
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }
}

/**
 * Initialize countdown timer
 */
export function initCountdown() {
    // Initial update
    updateCountdown();

    // Set up interval
    countdownInterval = setInterval(updateCountdown, CONFIG.intervals.countdown);
}

/**
 * Cleanup countdown timer
 */
export function destroyCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}
