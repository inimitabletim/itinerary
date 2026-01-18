# 交通導航卡片功能 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在每個景點下方新增交通資訊卡片，顯示推薦交通方式、停車資訊、大眾運輸路線，並提供 Google Maps 導航按鈕。

**Architecture:**
1. 在 `config.js` 新增交通資料結構
2. 建立 `transport.js` 模組處理交通卡片渲染
3. 建立 `transport.css` 樣式
4. 修改 `index.html` 加入交通卡片容器
5. 同時調整 Day 2 ↔ Day 3 行程順序（避開初二陽明山塞車）

**Tech Stack:** Vanilla JavaScript, CSS, PWA

---

## Task 1: 調整 Day 2 與 Day 3 行程順序

**Files:**
- Modify: `src/js/config.js:10-14`
- Modify: `index.html:114-198`

**Step 1: 更新 config.js 中的日期對應**

修改 `src/js/config.js` 第 10-14 行：

```javascript
days: [
    { date: '2026-02-17', dayNum: 1, lunar: '初一', title: '關渡祈福 & 三層崎花海' },
    { date: '2026-02-18', dayNum: 2, lunar: '初二', title: '淡水夕陽 & 頂級名廚盛宴' },  // 原 Day 3
    { date: '2026-02-19', dayNum: 3, lunar: '初三', title: '陽明山花季 & 頂級森林浴' },  // 原 Day 2
    { date: '2026-02-20', dayNum: 4, lunar: '初四', title: '名湯巡禮 & 暖心返程' }
]
```

**Step 2: 交換 index.html 中 Day 2 與 Day 3 的 section**

將 `#day2` 和 `#day3` 的內容互換，並更新日期顯示。

**Step 3: 本地預覽確認**

Run: `npm run dev`
Expected: 瀏覽器顯示新順序，Day 2 = 淡水，Day 3 = 陽明山

**Step 4: Commit**

```bash
git add src/js/config.js index.html
git commit -m "chore: swap Day 2 and Day 3 to avoid CNY traffic on Yangmingshan"
```

---

## Task 2: 建立交通資料結構

**Files:**
- Modify: `src/js/config.js`

**Step 1: 在 config.js 新增 transport 設定**

在 `CONFIG` 物件中新增：

```javascript
// Transport Information
transport: {
    locations: {
        '關渡宮': {
            recommendation: 'car',
            car: {
                duration: '從台北市區約 25 分鐘',
                parking: '水岸停車場',
                parkingFee: '春節期間 $60/hr',
                note: '從關渡路進入（知行路只出不進）',
                coordinates: { lat: 25.1172, lng: 121.4667 }
            },
            publicTransport: {
                route: '捷運關渡站 1 號出口，步行 10 分鐘',
                bus: '紅35、小23',
                note: '春節建議搭捷運避開車潮'
            }
        },
        '三層崎公園': {
            recommendation: 'car',
            car: {
                duration: '從關渡宮約 15 分鐘',
                parking: '秀山路旁停車格',
                parkingFee: '路邊停車費率',
                note: '停車位有限，建議 14:00 前抵達',
                coordinates: { lat: 25.1456, lng: 121.4983 }
            },
            publicTransport: {
                route: '捷運復興崗站，步行 15 分鐘',
                bus: '216、218、223',
                station: '貴子坑水土保持園區站'
            }
        },
        '淡水漁人碼頭': {
            recommendation: 'car',
            car: {
                duration: '從北投約 30 分鐘',
                parking: '福容大飯店地下停車場',
                parkingFee: '$40/hr，消費滿 $500 折 1hr',
                note: '電梯直達，長輩免走路',
                coordinates: { lat: 25.1847, lng: 121.4097 }
            },
            publicTransport: {
                route: '捷運淡水站轉紅26、836',
                note: '假日人多，建議開車'
            }
        },
        '陽明山花鐘': {
            recommendation: 'bus',
            car: {
                duration: '從北投約 40 分鐘（不塞車）',
                parking: '花季期間極難停車',
                note: '初三仰德大道 7:00-16:00 管制小客車',
                coordinates: { lat: 25.1661, lng: 121.5406 }
            },
            publicTransport: {
                route: '停百齡高中 → 搭花季專車 124/130/131',
                note: '停車場有 3hr 免費優惠（需蓋章）',
                recommended: true
            }
        },
        '二子坪步道': {
            recommendation: 'bus',
            car: {
                note: '需先到陽明山再轉乘'
            },
            publicTransport: {
                route: '陽明山公車總站轉 108、小8',
                note: '全程無階梯，輪椅可通行'
            }
        },
        '大地酒店': {
            recommendation: 'car',
            car: {
                duration: '從淡水約 25 分鐘',
                parking: '飯店專屬停車場',
                parkingFee: '用餐免費',
                coordinates: { lat: 25.1375, lng: 121.5108 }
            },
            publicTransport: {
                route: '捷運北投站/新北投站，可預約飯店接駁車',
                note: '接駁車需提前預約'
            }
        },
        '復興公園足湯': {
            recommendation: 'metro',
            car: {
                parking: '新北投捷運站停車場',
                parkingFee: '平日 $30/hr'
            },
            publicTransport: {
                route: '捷運新北投站，出站步行 3 分鐘',
                recommended: true
            }
        }
    }
}
```

**Step 2: 確認語法正確**

Run: `npm run lint`
Expected: 無錯誤

**Step 3: Commit**

```bash
git add src/js/config.js
git commit -m "feat: add transport data for all locations"
```

---

## Task 3: 建立交通卡片 CSS 樣式

**Files:**
- Create: `src/css/transport.css`
- Modify: `index.html` (引入 CSS)

**Step 1: 建立 transport.css**

```css
/* Transport Card Styles */
.transport-card {
    margin-top: 1rem;
    padding: 1rem;
    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
}

.transport-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 0.5rem 0;
}

.transport-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
}

.transport-badge.car {
    background: rgba(52, 152, 219, 0.2);
    color: #5dade2;
}

.transport-badge.metro {
    background: rgba(46, 204, 113, 0.2);
    color: #58d68d;
}

.transport-badge.bus {
    background: rgba(241, 196, 15, 0.2);
    color: #f4d03f;
}

.transport-toggle {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
    color: rgba(255,255,255,0.6);
}

.transport-card.expanded .transport-toggle {
    transform: rotate(180deg);
}

.transport-details {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
}

.transport-card.expanded .transport-details {
    max-height: 500px;
}

.transport-section {
    padding: 1rem 0;
    border-top: 1px solid rgba(255,255,255,0.1);
}

.transport-section:first-child {
    border-top: none;
}

.transport-section h4 {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.9);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.transport-info {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.7);
    line-height: 1.6;
}

.transport-info p {
    margin: 0.3rem 0;
}

.transport-note {
    font-size: 0.8rem;
    color: #faad14;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: rgba(250, 173, 20, 0.1);
    border-radius: 6px;
}

.nav-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 0.8rem 1.2rem;
    background: linear-gradient(135deg, #FF3B30 0%, #FF6B4A 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: transform 0.2s, box-shadow 0.2s;
}

.nav-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 59, 48, 0.4);
}

/* 長輩友善：較大的點擊區域 */
@media (max-width: 768px) {
    .transport-header {
        padding: 0.8rem 0;
    }

    .transport-badge {
        font-size: 1rem;
        padding: 0.5rem 1rem;
    }

    .nav-button {
        width: 100%;
        justify-content: center;
        padding: 1rem;
        font-size: 1rem;
    }
}
```

**Step 2: 在 index.html 引入 CSS**

在 `</head>` 前加入：
```html
<link rel="stylesheet" href="src/css/transport.css">
```

**Step 3: 預覽確認樣式載入**

Run: `npm run dev`
Expected: 無 CSS 載入錯誤

**Step 4: Commit**

```bash
git add src/css/transport.css index.html
git commit -m "feat: add transport card CSS styles"
```

---

## Task 4: 建立交通模組 JavaScript

**Files:**
- Create: `src/js/modules/transport.js`
- Modify: `src/js/app.js`

**Step 1: 建立 transport.js 模組**

```javascript
/**
 * Transport Module
 * Handles transport information cards for each location
 */

import { CONFIG } from '../config.js';

/**
 * Get recommendation badge HTML
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
 * Generate Google Maps URL
 */
function getGoogleMapsUrl(location, coordinates) {
    if (coordinates) {
        return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

/**
 * Create transport card HTML
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
                <a href="${mapsUrl}" target="_blank" rel="noopener" class="nav-button">
                    📍 開啟 Google Maps 導航
                </a>
            </div>
        </div>
    `;
}

/**
 * Initialize transport cards for all events
 */
export function initTransportCards() {
    const events = document.querySelectorAll('.event');

    events.forEach(event => {
        const eventName = event.querySelector('.event-name')?.textContent;
        if (!eventName) return;

        // 嘗試匹配景點名稱
        const locationKeys = Object.keys(CONFIG.transport?.locations || {});
        const matchedLocation = locationKeys.find(key => eventName.includes(key) || key.includes(eventName.split('（')[0]));

        if (matchedLocation) {
            const card = createTransportCard(matchedLocation);
            if (card) {
                const existingCard = event.querySelector('.transport-card');
                if (!existingCard) {
                    event.querySelector('.event-content').insertAdjacentHTML('beforeend', card);
                }
            }
        }
    });
}
```

**Step 2: 在 app.js 引入並初始化**

在 `src/js/app.js` 加入：

```javascript
import { initTransportCards } from './modules/transport.js';

// 在 DOMContentLoaded 事件中呼叫
document.addEventListener('DOMContentLoaded', () => {
    // ... 現有程式碼 ...
    initTransportCards();
});
```

**Step 3: 測試功能**

Run: `npm run dev`
Expected: 每個景點下方出現交通卡片，點擊可展開詳情

**Step 4: Commit**

```bash
git add src/js/modules/transport.js src/js/app.js
git commit -m "feat: add transport card module with Google Maps integration"
```

---

## Task 5: 更新 index.html 行程內容

**Files:**
- Modify: `index.html`

**Step 1: 交換 Day 2 和 Day 3 的 section 內容**

將 Day 2 (陽明山) 和 Day 3 (淡水) 的內容互換，並更新：
- `card-date` 日期
- DAY 標籤
- section id

**Step 2: 更新景點名稱以匹配 transport config**

確保 `.event-name` 文字與 `config.js` 中的 `transport.locations` 鍵名可以匹配：
- 「關渡宮走春祈福」→ 包含「關渡宮」✓
- 「北投三層崎公園」→ 包含「三層崎公園」✓
- 「淡水漁人碼頭」→ 完全匹配 ✓
- 「前往陽明山（花鐘區）」→ 包含「陽明山花鐘」✓
- 「二子坪步道」→ 完全匹配 ✓
- 「大地酒店 奇岩一號」→ 包含「大地酒店」✓
- 「復興公園泡腳池」→ 包含「復興公園足湯」✓

**Step 3: 本地測試**

Run: `npm run dev`
Expected:
- Day 2 顯示淡水行程
- Day 3 顯示陽明山行程
- 所有景點都有交通卡片

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: swap Day 2/3 content and ensure location name matching"
```

---

## Task 6: 最終測試與部署

**Step 1: 執行 lint 檢查**

Run: `npm run lint`
Expected: 無錯誤

**Step 2: 執行 build**

Run: `npm run build`
Expected: 成功建置到 dist/

**Step 3: 預覽 production 版本**

Run: `npm run preview`
Expected: 功能正常運作

**Step 4: 最終 Commit**

```bash
git add .
git commit -m "feat: complete transport navigation feature"
```

**Step 5: 推送到 GitHub（觸發部署）**

```bash
git push origin main
```

---

## 驗收清單

- [ ] Day 2 顯示「淡水夕陽」，Day 3 顯示「陽明山花季」
- [ ] 所有景點下方有交通卡片
- [ ] 點擊卡片可展開/收合
- [ ] 「開啟 Google Maps」按鈕正常運作
- [ ] 手機版顯示正常（長輩友善大按鈕）
- [ ] 離線時仍顯示交通資訊
- [ ] Build 成功無錯誤
