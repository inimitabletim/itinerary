# Project: itinerary-app

**Last Updated:** 2026-01-18

## Overview

2026 馬年春節孝親之旅 - A Progressive Web App (PWA) for a Beitou/Yangmingshan family travel itinerary during Chinese New Year. Features real-time countdown, weather integration, crowd indicators, and offline support.

## Technology Stack

- **Language:** JavaScript (ES Modules)
- **Framework:** Vanilla JS (no framework)
- **Build Tool:** Vite 5.x
- **Testing:** None configured
- **Package Manager:** npm
- **Linting:** ESLint 8.x
- **Formatting:** Prettier 3.x

## Directory Structure

```
itinerary/
├── index.html              # Main entry page
├── itinerary.html          # Itinerary details page
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── vite.config.js          # Vite configuration
├── src/
│   ├── css/
│   │   ├── variables.css   # CSS custom properties (design system)
│   │   ├── base.css        # Base/reset styles
│   │   ├── layout.css      # Layout styles
│   │   ├── components.css  # Component styles
│   │   ├── responsive.css  # Responsive breakpoints
│   │   └── transport.css   # Transport card styles
│   └── js/
│       ├── app.js          # Main application entry
│       ├── config.js       # Configuration constants
│       └── modules/
│           ├── countdown.js    # Countdown timer
│           ├── crowd.js        # Crowd level indicators
│           ├── weather.js      # Open-Meteo weather API
│           ├── navigation.js   # Navigation/scroll handling
│           ├── animations.js   # Scroll animations
│           ├── transport.js    # Transport cards with Google Maps
│           └── error-handler.js # Error handling utilities
├── assets/
│   └── icons/              # PWA icons
└── docs/
    └── plans/              # Implementation plans
```

## Key Files

- **Configuration:** `vite.config.js`, `.eslintrc.json`, `.prettierrc`
- **Entry Points:** `index.html` (imports `src/js/app.js`)
- **PWA:** `manifest.json`, `sw.js`
- **Tests:** None configured

## Development Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |

## Architecture Notes

- **PWA Architecture:** Service worker for offline caching, manifest for installability
- **Module System:** ES Modules with Vite bundling
- **CSS Architecture:** CSS custom properties in `variables.css`, component-based organization
- **API Integration:** Open-Meteo weather API (no API key required)
- **Maps Integration:** Google Maps links for transport navigation
- **No State Management:** Simple vanilla JS with direct DOM manipulation

## External APIs

- **Open-Meteo:** Weather data for Beitou area (lat: 25.1363, lon: 121.5061)
- **Google Maps:** Deep links for navigation directions

## Browser Support

Chrome 90+, Firefox 90+, Safari 14+, Edge 90+

## Deployment

- Primary: GitHub Pages via GitHub Actions
- Alternative: Vercel with Vite preset
