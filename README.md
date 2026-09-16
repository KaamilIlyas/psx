# 📈 PSX Watch & Portfolio Intelligence Dashboard

A modern, high-performance financial intelligence and portfolio management platform for the **Pakistan Stock Exchange (PSX)**. Built with React, Vite, Node.js, and a custom CSS design system.

---

## 🚀 Key Features

### 💼 1. Complete Portfolio Management (Investify-Style)
- **Discrete Purchase Lots**: Track multiple buy tranches per stock with individual purchase dates, prices, quantities, and lot-level returns alongside consolidated weighted average price.
- **Realized P&L & FIFO Selling**: Execute sell orders with automatic First-In-First-Out (FIFO) share deductions, cost basis tracking, and realized profit/loss calculations.
- **Consolidated Dividend Income Log**: Group dividend payouts by company with expandable tranches, tax deduction tracking (15% filer, 30% non-filer, 0% exempt), and chronological sorting.
- **Dual Responsive Layout**: Fixed desktop table with aligned columns alongside an app-like mobile card stack with zero horizontal overflow.
- **Offline Persistence**: Full `localStorage` state management for instant loading with zero database latency.

### 📊 2. Corporate Fundamentals & TTM Analytics
- **Live Stock Quotes & Watchlist**: Real-time ticker prices, day changes, session high/low, 52-week ranges, market cap, and free float.
- **TTM Calculator**: Trailing Twelve Months (TTM) metric computation for P/E ratio, PEG ratio, EPS growth, and profit margins.
- **Financial Statements**: Multi-year annual and quarterly Income Statements, Balance Sheets, and Cash Flows.
- **Investment Quality Scorecard**: 5-point automated checklist evaluating profitability, earnings growth trend, liquidity margin, valuation safety, and active yield program.

### 📰 3. News, Sentiment & Regulatory Disclosures
- **Google News Stream & Sentiment Engine**: Live company news feed with real-time positive/negative keyword sentiment analysis.
- **PUCARS Regulatory Filings**: Corporate announcements, board meetings, dividend declarations, and direct PDF document links.
- **Custom Responsive SVG Sparkline Chart**: Dynamic line chart with volume bars, interactive hover/touch tooltips, and timeframe filters (`1M`, `6M`, `1Y`, `5Y`).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Lucide Icons, Vanilla CSS Design System |
| **Backend / API** | Node.js, Express, Cheerio (Scraper & PUCARS Aggregator) |
| **Charts** | Custom Zero-Dependency SVG Charting Engine |
| **Storage** | Client-Side Persistent `localStorage` Cache |
| **Deployment** | Vercel Serverless Functions (`api/index.js`) |

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🌐 Production Deployment (Vercel)

This repository includes pre-configured Vercel serverless routing (`vercel.json` & `api/index.js`):

```bash
npx vercel
```
Or connect your GitHub repository directly to your [Vercel Dashboard](https://vercel.com/new).

---

## 📁 Project Architecture

```
src/
├── utils/                # Sentiment, TTM formulas, and number formatters
├── components/
│   ├── common/          # Responsive SVG StockChart
│   ├── layout/          # Sidebar, Header, NavTabs, MobileBottomNav
│   ├── views/           # PortfolioView, NewsView, ProfileView, FinancialsView, FilingsView
│   │   └── portfolio/   # HoldingsTab, SellsTab, DividendsTab
│   └── modals/          # TradeModal (Buy, Sell, Dividend)
├── App.jsx              # Root coordinator & state manager
└── index.css            # Custom responsive CSS design tokens
```

---

## 📄 Documentation
For an in-depth explanation of the architecture, algorithms, and portfolio showcase guide, see [PROJECT_GUIDE.md](file:///Users/kamililyas/Documents/github/stock/PROJECT_GUIDE.md).
