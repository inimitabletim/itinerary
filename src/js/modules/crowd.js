/**
 * Crowd Module
 * Handles dynamic crowd level indicators based on time of day
 */

import { CONFIG } from '../config.js';

let crowdInterval = null;

/**
 * Determine crowd level based on current hour
 * @param {number} hour - Current hour (0-23)
 * @returns {Object} Crowd level info with text, color, and intensity
 */
function getCrowdLevel(hour) {
    const { highStart, highEnd, medStart, medEnd } = CONFIG.crowd;

    if (hour >= highStart && hour <= highEnd) {
        return {
            text: '極高',
            color: '#ff4d4f',
            intensity: 'high',
            percentage: 95
        };
    } else if (hour >= medStart && hour <= medEnd) {
        return {
            text: '中等',
            color: '#faad14',
            intensity: 'med',
            percentage: 60
        };
    } else {
        return {
            text: '低',
            color: '#52c41a',
            intensity: 'low',
            percentage: 25
        };
    }
}

/**
 * Update all crowd indicators on the page
 */
function updateCrowdStats() {
    const hour = new Date().getHours();
    const level = getCrowdLevel(hour);

    // Update dashboard display
    const dashValue = document.getElementById('crowd-level-dash');
    if (dashValue) {
        dashValue.textContent = level.text;
        dashValue.style.color = level.color;
    }

    // Update all crowd bars with variations
    document.querySelectorAll('.crowd-fill').forEach((bar, index) => {
        // Add slight variation based on index
        const variation = (index * 5) % 20;
        let intensity = level.percentage + variation;

        // Clamp to valid range
        intensity = Math.min(100, Math.max(0, intensity));

        // Determine fill class
        let fillClass = 'fill-low';
        if (intensity > 75) {
            fillClass = 'fill-high';
        } else if (intensity > 40) {
            fillClass = 'fill-med';
        }

        bar.className = `crowd-fill ${fillClass}`;
    });
}

/**
 * Initialize crowd indicators
 */
export function initCrowd() {
    // Initial update
    updateCrowdStats();

    // Set up interval
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
