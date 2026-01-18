/**
 * Transport Module
 * 交通資訊卡片功能
 */

import { CONFIG } from '../config.js';

/**
 * 取得推薦標籤 HTML
 * @param {string} type - 交通類型 (car/metro/bus)
 * @returns {string} HTML 字串
 */
function getRecommendationBadge(type) {
    const badges = {
        car: { icon: '🚗', text: '建議開車', class: 'car' },
        metro: { icon: '🚇', text: '建議搭捷運', class: 'metro' },
        bus: { icon: '🚌', text: '建議搭公車', class: 'bus' }
    };
    const badge = badges[type] || badges.car;
    return `<span class="transport-badge ${badge.class}">${badge.icon} ${badge.text}</span>`;
}

/**
 * 產生 Google Maps 導航 URL
 * @param {string} location - 地點名稱
 * @param {Object} coordinates - 座標 {lat, lng}
 * @returns {string} Google Maps URL
 */
function getGoogleMapsUrl(location, coordinates) {
    if (coordinates && coordinates.lat && coordinates.lng) {
        return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location + ' 台灣')}`;
}

/**
 * 建立交通卡片 HTML
 * @param {string} locationName - 地點名稱
 * @returns {string} HTML 字串
 */
export function createTransportCard(locationName) {
    const transport = CONFIG.transport?.locations?.[locationName];
    if (!transport) return '';

    const { recommendation, car, publicTransport } = transport;
    const mapsUrl = getGoogleMapsUrl(locationName, car?.coordinates);

    return `
        <div class="transport-card" data-location="${locationName}">
            <div class="transport-header" onclick="this.parentElement.classList.toggle('expanded')">
                ${getRecommendationBadge(recommendation)}
                <span class="transport-toggle">▼</span>
            </div>
            <div class="transport-details">
                ${car ? `
                <div class="transport-section">
                    <h4>🚗 開車資訊</h4>
                    <div class="transport-info">
                        ${car.duration ? `<p><strong>車程：</strong>${car.duration}</p>` : ''}
                        ${car.parking ? `<p><strong>停車：</strong>${car.parking}</p>` : ''}
                        ${car.parkingFee ? `<p><strong>費用：</strong>${car.parkingFee}</p>` : ''}
                    </div>
                    ${car.note ? `<div class="transport-note">💡 ${car.note}</div>` : ''}
                </div>
                ` : ''}
                ${publicTransport ? `
                <div class="transport-section">
                    <h4>🚇 大眾運輸</h4>
                    <div class="transport-info">
                        ${publicTransport.route ? `<p><strong>路線：</strong>${publicTransport.route}</p>` : ''}
                        ${publicTransport.bus ? `<p><strong>公車：</strong>${publicTransport.bus}</p>` : ''}
                        ${publicTransport.station ? `<p><strong>下車站：</strong>${publicTransport.station}</p>` : ''}
                    </div>
                    ${publicTransport.note ? `<div class="transport-note">💡 ${publicTransport.note}</div>` : ''}
                </div>
                ` : ''}
                <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="nav-button">
                    📍 開啟 Google Maps 導航
                </a>
            </div>
        </div>
    `;
}

/**
 * 嘗試匹配景點名稱
 * @param {string} eventName - 事件名稱
 * @returns {string|null} 匹配的地點名稱
 */
function matchLocation(eventName) {
    const locationKeys = Object.keys(CONFIG.transport?.locations || {});

    // 直接匹配
    for (const key of locationKeys) {
        if (eventName.includes(key)) {
            return key;
        }
    }

    // 部分匹配（處理「北投三層崎公園」這類情況）
    const simplifiedName = eventName.split('（')[0].split('(')[0].trim();
    for (const key of locationKeys) {
        if (simplifiedName.includes(key) || key.includes(simplifiedName)) {
            return key;
        }
    }

    return null;
}

/**
 * 初始化所有交通卡片
 */
export function initTransportCards() {
    const events = document.querySelectorAll('.event');

    events.forEach(event => {
        const eventNameEl = event.querySelector('.event-name');
        if (!eventNameEl) return;

        const eventName = eventNameEl.textContent;
        const matchedLocation = matchLocation(eventName);

        if (matchedLocation) {
            const card = createTransportCard(matchedLocation);
            if (card) {
                const existingCard = event.querySelector('.transport-card');
                if (!existingCard) {
                    const eventContent = event.querySelector('.event-content');
                    if (eventContent) {
                        eventContent.insertAdjacentHTML('beforeend', card);
                    }
                }
            }
        }
    });

    console.log('[Transport] 交通卡片初始化完成');
}
