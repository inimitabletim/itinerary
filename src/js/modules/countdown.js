/**
 * Countdown Module
 * Handles the CNY countdown timer with multi-phase display
 */

import { CONFIG } from '../config.js';

let countdownInterval = null;

/**
 * Get the current trip phase
 * @param {Date} now - Current date/time
 * @returns {'before' | 'during' | 'after'} Trip phase
 */
function getTripPhase(now) {
    const tripDays = CONFIG.trip.days;
    const firstDay = new Date(`${tripDays[0].date}T00:00:00`);
    const lastDay = new Date(`${tripDays[tripDays.length - 1].date}T23:59:59`);

    if (now < firstDay) {
        return 'before';
    } else if (now <= lastDay) {
        return 'during';
    } else {
        return 'after';
    }
}

/**
 * Get the current trip day info (during trip phase)
 * @param {Date} now - Current date/time
 * @returns {Object|null} Trip day info or null if not during trip
 */
function getCurrentTripDay(now) {
    const todayStr = now.toISOString().split('T')[0];

    for (const day of CONFIG.trip.days) {
        if (day.date === todayStr) {
            return day;
        }
    }

    return null;
}

/**
 * Calculate time difference and update display based on trip phase
 */
function updateCountdown() {
    const now = new Date();
    const countdownEl = document.getElementById('countdown-timer');
    if (!countdownEl) return;

    const phase = getTripPhase(now);

    switch (phase) {
        case 'before': {
            const targetDate = new Date(CONFIG.trip.startDate);
            const diff = targetDate - now;

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const mins = Math.floor((diff / 1000 / 60) % 60);
                const secs = Math.floor((diff / 1000) % 60);

                countdownEl.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
            }
            break;
        }

        case 'during': {
            const dayInfo = getCurrentTripDay(now);
            if (dayInfo) {
                countdownEl.textContent = `🎉 第${dayInfo.dayNum}天 - ${dayInfo.title}`;
            } else {
                countdownEl.textContent = '🎉 行程進行中';
            }
            break;
        }

        case 'after': {
            countdownEl.textContent = '✨ 旅程完美結束';
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
            break;
        }
    }
}

/**
 * Initialize countdown timer
 */
export function initCountdown() {
    updateCountdown();
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
