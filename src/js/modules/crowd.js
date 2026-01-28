/**
 * Crowd Module
 * Smart crowd estimation based on date, time, and location
 */

import { CONFIG } from '../config.js';

let crowdInterval = null;

/**
 * Get holiday weight for a given date
 * @param {Date} date - Date to check
 * @returns {number} Holiday crowd weight (0.3 for non-holiday, up to 1.0 for 初一)
 */
function getHolidayWeight(date) {
    const dateStr = date.toISOString().split('T')[0];
    const lunarDay = CONFIG.cnyHoliday?.lunarDays?.[dateStr];

    if (lunarDay) {
        return lunarDay.weight;
    }

    return CONFIG.crowd.defaultDayWeight;
}

/**
 * Get time slot weight for a given hour
 * @param {number} hour - Hour (0-23)
 * @returns {number} Time slot weight
 */
function getTimeSlotWeight(hour) {
    const timeSlots = CONFIG.crowd.timeSlots;

    if (!timeSlots) {
        const { highStart, highEnd, medStart, medEnd } = CONFIG.crowd;
        if (hour >= highStart && hour <= highEnd) return 1.0;
        if (hour >= medStart && hour <= medEnd) return 0.6;
        return 0.3;
    }

    for (const slot of timeSlots) {
        if (hour >= slot.start && hour < slot.end) {
            return slot.weight;
        }
    }

    return 0.3;
}

/**
 * Get location popularity weight
 * @param {string} locationId - Location identifier
 * @returns {number} Location popularity weight
 */
function getLocationWeight(locationId) {
    const popularity = CONFIG.crowd.locationPopularity;

    if (popularity && popularity[locationId] !== undefined) {
        return popularity[locationId];
    }

    return 1.0;
}

/**
 * Calculate crowd level based on date, time, and location
 * @param {string} locationId - Location identifier (optional)
 * @param {Date} date - Date/time to evaluate (defaults to now)
 * @returns {Object} Crowd level info
 */
function getCrowdLevel(locationId = null, date = new Date()) {
    const hour = date.getHours();

    const holidayWeight = getHolidayWeight(date);
    const timeWeight = getTimeSlotWeight(hour);
    const locationWeight = locationId ? getLocationWeight(locationId) : 1.0;

    const finalScore = holidayWeight * timeWeight * locationWeight;
    const levels = CONFIG.crowd.levels;

    let result;
    if (finalScore >= levels.veryHigh.min) {
        result = {
            text: levels.veryHigh.text,
            color: levels.veryHigh.color,
            intensity: 'high',
            percentage: Math.min(100, Math.round(finalScore * 100))
        };
    } else if (finalScore >= levels.high.min) {
        result = {
            text: levels.high.text,
            color: levels.high.color,
            intensity: 'high',
            percentage: Math.round(finalScore * 100)
        };
    } else if (finalScore >= levels.medium.min) {
        result = {
            text: levels.medium.text,
            color: levels.medium.color,
            intensity: 'med',
            percentage: Math.round(finalScore * 100)
        };
    } else {
        result = {
            text: levels.low.text,
            color: levels.low.color,
            intensity: 'low',
            percentage: Math.max(10, Math.round(finalScore * 100))
        };
    }

    result.score = finalScore;
    result.factors = { holidayWeight, timeWeight, locationWeight };

    return result;
}

/**
 * Update all crowd indicators on the page
 */
function updateCrowdStats() {
    const now = new Date();

    const dashValue = document.getElementById('crowd-level-dash');
    if (dashValue) {
        const overallLevel = getCrowdLevel(null, now);
        dashValue.textContent = overallLevel.text;
        dashValue.style.color = overallLevel.color;
    }

    document.querySelectorAll('.crowd-bar[data-location]').forEach(bar => {
        const locationId = bar.dataset.location;
        const level = getCrowdLevel(locationId, now);

        const fill = bar.querySelector('.crowd-fill');
        if (fill) {
            let fillClass = 'fill-low';
            if (level.percentage > 70) {
                fillClass = 'fill-high';
            } else if (level.percentage > 40) {
                fillClass = 'fill-med';
            }
            fill.className = `crowd-fill ${fillClass}`;
        }
    });

    document.querySelectorAll('.crowd-text[data-location]').forEach(textEl => {
        const locationId = textEl.dataset.location;
        const level = getCrowdLevel(locationId, now);
        textEl.textContent = `📍 人潮壓力：${level.text}`;
        textEl.style.color = level.color;
    });

    document.querySelectorAll('.crowd-bar:not([data-location])').forEach(bar => {
        const level = getCrowdLevel(null, now);
        const fill = bar.querySelector('.crowd-fill');
        if (fill) {
            let fillClass = 'fill-low';
            if (level.percentage > 70) {
                fillClass = 'fill-high';
            } else if (level.percentage > 40) {
                fillClass = 'fill-med';
            }
            fill.className = `crowd-fill ${fillClass}`;
        }
    });
}

/**
 * Initialize crowd indicators
 */
export function initCrowd() {
    updateCrowdStats();
    crowdInterval = setInterval(updateCrowdStats, CONFIG.intervals.crowd);
}

/**
 * Cleanup crowd interval
 */
export function destroyCrowd() {
    if (crowdInterval) {
        clearInterval(crowdInterval);
        crowdInterval = null;
    }
}

export { getCrowdLevel, getHolidayWeight, getTimeSlotWeight, getLocationWeight };
