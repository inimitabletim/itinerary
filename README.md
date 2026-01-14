# 2026 馬年春節孝親之旅

北投陽明山春節家庭旅遊數位導覽 PWA

## 功能特色

- 即時春節倒數計時
- Open-Meteo 天氣 API 整合（無需 API Key）
- 動態人潮指標
- 離線支援（PWA）
- 響應式設計
- 滾動動畫效果

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

瀏覽器會自動開啟 `http://localhost:3000`

### 構建生產版本

```bash
npm run build
```

輸出至 `dist/` 目錄

### 預覽生產版本

```bash
npm run preview
```

## 專案結構

```
itinerary/
├── index.html              # 主頁面
├── manifest.json           # PWA 配置
├── sw.js                   # Service Worker
├── src/
│   ├── css/
│   │   ├── variables.css   # CSS 變數（設計系統）
│   │   ├── base.css        # 基礎樣式
│   │   ├── layout.css      # 佈局樣式
│   │   ├── components.css  # 元件樣式
│   │   └── responsive.css  # 響應式樣式
│   └── js/
│       ├── app.js          # 主程式入口
│       ├── config.js       # 配置檔
│       └── modules/
│           ├── countdown.js    # 倒數計時
│           ├── crowd.js        # 人潮指標
│           ├── weather.js      # 天氣 API
│           ├── navigation.js   # 導航功能
│           ├── animations.js   # 動畫效果
│           └── error-handler.js # 錯誤處理
├── assets/
│   └── icons/              # PWA 圖示
├── package.json
├── vite.config.js
└── dist/                   # 構建輸出（git ignored）
```

## 配置說明

編輯 `src/js/config.js` 調整設定：

```javascript
export const CONFIG = {
    trip: {
        startDate: '2026-02-17T00:00:00',  // 行程開始日期
        // ...
    },
    weather: {
        enabled: true,  // 是否啟用天氣功能
        location: {
            latitude: 25.1363,   // 北投
            longitude: 121.5061
        }
    },
    intervals: {
        countdown: 1000,    // 倒數更新頻率
        weather: 1800000    // 天氣更新頻率 (30分鐘)
    }
};
```

## 部署

### GitHub Pages（推薦）

1. 將專案推送至 GitHub
2. 前往 Settings → Pages
3. Source 選擇 "GitHub Actions"
4. 推送後會自動部署

### Vercel

1. 連接 GitHub 倉庫至 Vercel
2. 框架選擇 "Vite"
3. 自動部署完成

### 手動部署

```bash
npm run build
# 上傳 dist/ 目錄至任意靜態伺服器
```

## PWA 圖示

需自行建立以下尺寸的圖示放入 `assets/icons/`：

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

建議使用 [RealFaviconGenerator](https://realfavicongenerator.net/) 產生

## 指令一覽

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發伺服器 |
| `npm run build` | 構建生產版本 |
| `npm run preview` | 預覽生產版本 |
| `npm run lint` | 執行 ESLint 檢查 |
| `npm run lint:fix` | 自動修復 ESLint 問題 |
| `npm run format` | 執行 Prettier 格式化 |

## 瀏覽器支援

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## 授權

MIT License

---

祝全家 馬年大吉，平安喜樂 🏮
