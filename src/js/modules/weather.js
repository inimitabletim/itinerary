/**
 * Weather Module
 * Fetches real-time weather data from Open-Meteo API
 */

import { CONFIG } from '../config.js';

let weatherInterval = null;

/**
 * Weather code to description mapping
 */
const WEATHER_CODES = {
    0: { desc: '晴天', icon: '☀️' },
    1: { desc: '大致晴朗', icon: '🌤️' },
    2: { desc: '局部多雲', icon: '⛅' },
    3: { desc: '陰天', icon: '☁️' },
    45: { desc: '霧', icon: '🌫️' },
    48: { desc: '凍霧', icon: '🌫️' },
    51: { desc: '細雨', icon: '🌧️' },
    53: { desc: '小雨', icon: '🌧️' },
    55: { desc: '中雨', icon: '🌧️' },
    61: { desc: '小雨', icon: '🌧️' },
    63: { desc: '中雨', icon: '🌧️' },
    65: { desc: '大雨', icon: '🌧️' },
    80: { desc: '陣雨', icon: '🌦️' },
    81: { desc: '中陣雨', icon: '🌦️' },
    82: { desc: '大陣雨', icon: '🌦️' },
    95: { desc: '雷雨', icon: '⛈️' }
};

/**
 * Fetch weather data from Open-Meteo API
 * @returns {Promise<Object>} Weather data
 */
async function fetchWeatherData() {
    const { latitude, longitude } = CONFIG.weather.location;
    const { timezone } = CONFIG.weather;

    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', latitude);
    url.searchParams.set('longitude', longitude);
    url.searchParams.set('current', 'temperature_2m,weather_code,relative_humidity_2m');
    url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_probability_max');
    url.searchParams.set('timezone', timezone);
    url.searchParams.set('forecast_days', '4');

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
    }

    return response.json();
}

/**
 * Update weather display on the page
 */
async function updateWeather() {
    const tempEl = document.getElementById('current-temp');
    if (!tempEl) return;

    if (!CONFIG.weather.enabled) {
        console.warn('Weather feature is disabled');
        return;
    }

    try {
        const data = await fetchWeatherData();

        // Update current temperature
        const temp = Math.round(data.current.temperature_2m);
        const weatherCode = data.current.weather_code;
        const weatherInfo = WEATHER_CODES[weatherCode] || { desc: '未知', icon: '🌡️' };

        tempEl.textContent = `${temp}°C`;
        tempEl.title = weatherInfo.desc;

    } catch (error) {
        console.error('Weather fetch error:', error);
        tempEl.textContent = '--°C';

        // Dispatch custom error event
        window.dispatchEvent(new CustomEvent('app-error', {
            detail: {
                code: 'WEATHER_ERROR',
                message: '無法取得天氣資訊'
            }
        }));
    }
}

/**
 * Initialize weather module
 */
export function initWeather() {
    if (!CONFIG.weather.enabled) {
        console.log('Weather feature disabled');
        return;
    }

    // Initial fetch
    updateWeather();

    // Set up interval for periodic updates
    weatherInterval = setInterval(updateWeather, CONFIG.intervals.weather);
}

/**
 * Cleanup weather interval
 */
export function destroyWeather() {
    if (weatherInterval) {
        clearInterval(weatherInterval);
        weatherInterval = null;
    }
}

/**
 * Get weather forecast for a specific date
 * @param {number} dayIndex - Day index (0-3)
 * @returns {Promise<Object|null>} Forecast data for the day
 */
export async function getForecastForDay(dayIndex) {
    try {
        const data = await fetchWeatherData();

        if (data.daily && dayIndex < data.daily.time.length) {
            return {
                date: data.daily.time[dayIndex],
                maxTemp: Math.round(data.daily.temperature_2m_max[dayIndex]),
                minTemp: Math.round(data.daily.temperature_2m_min[dayIndex]),
                precipProbability: data.daily.precipitation_probability_max[dayIndex]
            };
        }

        return null;
    } catch (error) {
        console.error('Forecast fetch error:', error);
        return null;
    }
}
