/**
 * Application Configuration
 * Centralized settings for the itinerary app
 */

export const CONFIG = {
    // Trip Information
    trip: {
        startDate: '2026-02-17T00:00:00',
        days: [
            { date: '2026-02-17', dayNum: 1, lunar: '初一', title: '關渡祈福 & 三層崎花海' },
            { date: '2026-02-18', dayNum: 2, lunar: '初二', title: '淡水夕陽 & 頂級名廚盛宴' },
            { date: '2026-02-19', dayNum: 3, lunar: '初三', title: '陽明山花季 & 頂級森林浴' },
            { date: '2026-02-20', dayNum: 4, lunar: '初四', title: '名湯巡禮 & 暖心返程' }
        ]
    },

    // Weather API Configuration (Open-Meteo - Free, No API Key Required)
    weather: {
        enabled: true,
        location: {
            name: '北投',
            latitude: 25.1363,
            longitude: 121.5061
        },
        timezone: 'Asia/Taipei'
    },

    // Update Intervals (in milliseconds)
    intervals: {
        countdown: 1000,        // 1 second
        crowd: 60000,           // 1 minute
        weather: 1800000        // 30 minutes
    },

    // Crowd Level Thresholds (based on hour of day)
    crowd: {
        highStart: 10,
        highEnd: 19,
        medStart: 7,
        medEnd: 22
    }
};

/**
 * Format date for display
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date string
 */
export function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
