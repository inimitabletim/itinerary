# 動態倒數計時與智慧人潮評估 實作計畫

Created: 2026-01-18
Status: VERIFIED
Approved: Yes
Iterations: 0

> **Status Lifecycle:** PENDING → COMPLETE → VERIFIED
> **Iterations:** Tracks implement→verify cycles (incremented by /verify)

## Summary

**Goal:** 讓倒數計時和人潮評估功能根據實際情況自動更新，提供更智慧的行程輔助資訊。

**Architecture:**
- 倒數計時模組增加行程階段判斷（行程前/行程中/行程後），行程期間顯示當天天數與主題
- 人潮評估模組重構為智慧評估引擎，考慮日期、時段、春節假期狀態、地點特性

**Tech Stack:** Vanilla JavaScript (ES Modules)

## Scope

### In Scope
- 重構 `countdown.js` 支援多階段顯示
- 重構 `crowd.js` 實作智慧人潮評估演算法
- 更新 `config.js` 新增地點人潮權重設定
- 更新 HTML 中的人潮顯示元素支援地點專屬評估

### Out of Scope
- 天氣因素對人潮的影響（可未來擴展）
- 後端 API 整合（純前端計算）
- UI 視覺設計變更

## Prerequisites
- 現有 `countdown.js`, `crowd.js`, `config.js` 檔案
- 了解春節假期日期結構（初一至初四：2/17-2/20）

## Context for Implementer

### 現有架構
- 模組使用 ES Modules (`import`/`export`)
- 設定集中在 `src/js/config.js`
- 頁面透過 `src/js/app.js` 初始化所有模組
- 人潮條使用 CSS class: `.crowd-fill.fill-low/.fill-med/.fill-high`

### 春節假期邏輯
```
2026年春節假期：
- 2/14 (六) - 除夕前週末
- 2/15 (日) - 除夕前週末
- 2/16 (一) - 除夕（小年夜）
- 2/17 (二) - 初一 ← 行程第1天
- 2/18 (三) - 初二 ← 行程第2天
- 2/19 (四) - 初三 ← 行程第3天
- 2/20 (五) - 初四 ← 行程第4天
- 2/21 (六) - 初五
- 2/22 (日) - 初六
```

### 人潮評估邏輯設計
| 日期 | 基準人潮 | 說明 |
|------|----------|------|
| 初一 | 極高 (1.0) | 走春最高峰 |
| 初二 | 高 (0.85) | 回娘家日 |
| 初三 | 中高 (0.7) | 人潮略減 |
| 初四 | 中 (0.6) | 收假前夕 |
| 非假期 | 低 (0.3) | 平常日 |

| 時段 | 權重 | 說明 |
|------|------|------|
| 06:00-09:00 | 0.5 | 早晨較少 |
| 09:00-11:00 | 0.8 | 人潮漸增 |
| 11:00-14:00 | 1.0 | 午間高峰 |
| 14:00-17:00 | 0.9 | 下午略降 |
| 17:00-19:00 | 0.7 | 傍晚時段 |
| 19:00-22:00 | 0.4 | 夜間較少 |

| 地點 | 熱門度 | 說明 |
|------|--------|------|
| 關渡宮 | 1.2 | 走春熱點 |
| 陽明山花鐘 | 1.3 | 花季超熱門 |
| 淡水漁人碼頭 | 1.0 | 標準熱度 |
| 三層崎公園 | 0.9 | 新景點較少人知 |
| 二子坪步道 | 0.7 | 需轉乘較冷門 |
| 復興公園足湯 | 0.6 | 小景點 |

## Progress Tracking

**MANDATORY: Update this checklist as tasks complete. Change `[ ]` to `[x]`.**

- [x] Task 1: 更新 config.js 新增人潮評估設定
- [x] Task 2: 重構 countdown.js 支援多階段顯示
- [x] Task 3: 重構 crowd.js 實作智慧評估引擎
- [x] Task 4: 更新 HTML 人潮元素加入地點識別

**Total Tasks:** 4 | **Completed:** 4 | **Remaining:** 0

## Implementation Tasks

### Task 1: 更新 config.js 新增人潮評估設定

**Objective:** 擴展設定檔，新增春節假期日期、人潮權重係數、地點熱門度設定

**Files:**
- Modify: `src/js/config.js`

**Implementation Steps:**
1. 在 `CONFIG` 物件中新增 `cnyHoliday` 區塊，定義假期開始/結束日期
2. 擴展 `crowd` 區塊，新增：
   - `dateWeights`: 各假期日期的人潮權重（初一到初六）
   - `timeSlots`: 時段權重陣列
   - `locationPopularity`: 各地點熱門度係數
3. 確保與現有設定相容，不破壞現有功能

**Expected Changes:**
```javascript
cnyHoliday: {
    year: 2026,
    start: '2026-02-14',  // 除夕前週末開始
    end: '2026-02-22',    // 初六結束
    lunarDays: {
        '2026-02-16': { day: 0, name: '除夕', weight: 0.7 },
        '2026-02-17': { day: 1, name: '初一', weight: 1.0 },
        '2026-02-18': { day: 2, name: '初二', weight: 0.85 },
        // ...
    }
},
crowd: {
    // 保留現有設定
    highStart: 10,
    highEnd: 19,
    // 新增
    timeSlots: [...],
    locationPopularity: {...}
}
```

**Definition of Done:**
- [ ] 新增完整假期日期設定
- [ ] 新增時段權重陣列
- [ ] 新增地點熱門度設定
- [ ] 現有程式碼不受影響（向下相容）

---

### Task 2: 重構 countdown.js 支援多階段顯示

**Objective:** 倒數計時根據當前日期判斷階段（行程前/行程中/行程後），行程期間顯示當天天數與主題

**Files:**
- Modify: `src/js/modules/countdown.js`

**Implementation Steps:**
1. 新增 `getTripPhase()` 函數，判斷當前屬於哪個階段
2. 新增 `getCurrentTripDay()` 函數，取得當前是行程第幾天及主題
3. 修改 `updateCountdown()` 函數：
   - 行程前：顯示倒數（現有邏輯）
   - 行程中：顯示「🎉 第N天 - {主題}」
   - 行程後：顯示「✨ 旅程完美結束」
4. 確保計時器在行程結束後停止更新

**Expected Output:**
- 行程前：`3d 12h 30m 15s`
- 行程第1天：`🎉 第1天 - 關渡祈福 & 三層崎花海`
- 行程第4天：`🎉 第4天 - 名湯巡禮 & 暖心返程`
- 行程後：`✨ 旅程完美結束`

**Definition of Done:**
- [ ] 正確判斷行程前/中/後三個階段
- [ ] 行程期間顯示正確的天數和主題
- [ ] 行程後顯示結束訊息並停止計時
- [ ] 無 console 錯誤

---

### Task 3: 重構 crowd.js 實作智慧評估引擎

**Objective:** 人潮評估考慮日期、時段、假期狀態、地點特性，提供更精準的人潮預測

**Files:**
- Modify: `src/js/modules/crowd.js`

**Implementation Steps:**
1. 新增 `getHolidayWeight(date)` 函數：
   - 判斷日期是否在春節假期內
   - 返回該日期的人潮權重（初一最高）
2. 新增 `getTimeSlotWeight(hour)` 函數：
   - 根據小時返回時段權重
3. 新增 `getLocationWeight(locationId)` 函數：
   - 根據地點 ID 返回熱門度權重
4. 修改 `getCrowdLevel()` 函數：
   - 接受 `locationId` 參數
   - 計算公式：`finalScore = holidayWeight × timeWeight × locationWeight`
   - 根據 finalScore 返回人潮等級（低/中/高/極高）
5. 修改 `updateCrowdStats()` 函數：
   - 遍歷所有帶有 `data-location` 屬性的人潮元素
   - 為每個地點計算專屬人潮等級
   - 更新 Dashboard 顯示全台平均人潮

**計算公式範例：**
```javascript
// 初一(1.0) × 中午(1.0) × 關渡宮(1.2) = 1.2 → 極高
// 初三(0.7) × 傍晚(0.7) × 二子坪(0.7) = 0.343 → 低
```

**人潮等級對照：**
| finalScore | 等級 | 顏色 |
|------------|------|------|
| ≥ 0.8 | 極高 | #ff4d4f |
| ≥ 0.5 | 中等 | #faad14 |
| < 0.5 | 低 | #52c41a |

**Definition of Done:**
- [ ] 正確計算春節假期權重
- [ ] 正確計算時段權重
- [ ] 正確計算地點權重
- [ ] 綜合評分準確反映人潮狀況
- [ ] Dashboard 顯示整體評估
- [ ] 各地點人潮條顯示專屬評估

---

### Task 4: 更新 HTML 人潮元素加入地點識別

**Objective:** 為 HTML 中的人潮顯示元素加入 `data-location` 屬性，讓 JavaScript 能識別並更新

**Files:**
- Modify: `index.html`

**Implementation Steps:**
1. 找到所有 `.crowd-bar` 元素
2. 為每個元素加入 `data-location` 屬性，對應 config.js 中的地點 ID
3. 更新人潮描述文字的 `<p>` 標籤，加入 `class="crowd-text"` 和 `data-location` 屬性

**修改位置：**
- Day 1: 關渡宮的 crowd-bar (line ~86-88)
- Day 3: 陽明山花鐘的 crowd-bar (line ~175-177)

**Expected HTML:**
```html
<div class="crowd-bar" data-location="關渡宮">
    <div class="crowd-fill fill-med"></div>
</div>
<p class="crowd-text" data-location="關渡宮">📍 人潮壓力：--</p>
```

**Definition of Done:**
- [ ] 所有 crowd-bar 元素有 data-location 屬性
- [ ] 所有人潮描述文字有對應的 class 和 data-location
- [ ] JavaScript 能正確選取並更新這些元素

---

## Testing Strategy

**手動驗證步驟：**

1. **倒數計時測試**
   - 修改 `CONFIG.trip.startDate` 為過去日期，驗證「旅程完美結束」
   - 修改為今天日期，驗證「第1天」顯示
   - 修改為未來日期，驗證倒數顯示

2. **人潮評估測試**
   - 在瀏覽器 console 測試各種組合：
     ```javascript
     // 測試初一中午關渡宮
     getCrowdLevel('關渡宮', new Date('2026-02-17T12:00:00'))
     // 預期：極高

     // 測試初三傍晚二子坪
     getCrowdLevel('二子坪步道', new Date('2026-02-19T18:00:00'))
     // 預期：低
     ```

3. **UI 顯示測試**
   - 確認 Dashboard 人潮顯示正確
   - 確認各地點人潮條顏色正確
   - 確認人潮描述文字更新

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| 日期計算時區問題 | Medium | Medium | 使用 `Asia/Taipei` 時區，統一用 ISO 字串比對 |
| 現有功能被破壞 | Low | High | 保持向下相容，新增設定不刪除舊設定 |
| 人潮計算過於複雜 | Low | Low | 使用簡單乘法公式，易於理解和調整 |

## Open Questions
- 無
