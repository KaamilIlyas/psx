# 📘 PSX Watch — Technical Architecture & Implementation Guide

> *This guide provides an in-depth technical breakdown of the architecture, financial algorithms, engineering decisions, and design principles implemented in **PSX Watch**.*

---

## 📌 1. Executive Summary & Project Purpose

**PSX Watch** is an institutional-grade financial intelligence and portfolio management platform engineered specifically for equities listed on the **Pakistan Stock Exchange (PSX)**. 

### The Problem It Solves:
Retail investors in the Pakistan market typically face fragmented tools: traditional broker terminals lack intuitive portfolio analytics, mobile responsiveness is often subpar, and standard trackers fail to account for multi-tranche purchase lots, FIFO sell deductions, or dividend withholding tax variations.

### The Solution:
**PSX Watch** unifies real-time market data scraping, automated corporate sentiment analysis, PUCARS regulatory filings, multi-year financial statements, and an **Investify-style discrete purchase lot tracker** into a seamless, high-performance single-page application (SPA).

---

## 🛠️ 2. Technology Stack & Architectural Decisions

| Layer | Technologies Used | Engineering Rationale |
|---|---|---|
| **Frontend Framework** | React 18, Vite | Component modularity, reactive state reconciliation, and near-instant Hot Module Replacement (HMR) build performance. |
| **Styling & UI System** | Custom Vanilla CSS (Design Tokens) | Engineered without heavy utility frameworks (e.g., Tailwind/Bootstrap) to maintain total control over render performance, glassmorphism aesthetics, responsive breakpoints, and bundle size. |
| **Iconography** | Lucide React | Lightweight, tree-shakable SVG icon library ensuring consistent visual hierarchy. |
| **Backend & Ingestion** | Node.js, Express, Cheerio | Fast HTTP routing and server-side DOM scraping for real-time PSX ticker metrics, financial statements, and corporate announcements. |
| **Data Visualization** | Native SVG Engine | Zero-dependency, GPU-accelerated responsive sparklines with volume histograms, gradient fills, and interactive touch/mouse scrubbers. |
| **Client-Side Persistence** | HTML5 `localStorage` Engine | Instant cold-start load times with zero database latency, schema migration handling, and offline resilience. |
| **Cloud Infrastructure** | Vercel Serverless Functions | Serverless Express API architecture (`api/index.js`) providing global edge caching, zero server maintenance, and auto-scaling. |

---

## 🏗️ 3. Modular Codebase Architecture

The application is architected around the **Single Responsibility Principle**, decoupling mathematical calculations, UI layouts, and state management:

```
src/
├── utils/                      # Pure helper functions & financial algorithms
│   ├── sentiment.js            # Keyword-based natural language sentiment engine
│   ├── financials.js           # TTM aggregation formulas, parsers & metric formatters
│   └── formatters.js           # Time parsing, price coloring, and quality scorecards
│
├── components/
│   ├── common/
│   │   └── StockChart.jsx      # Zero-dependency responsive SVG line & volume chart
│   │
│   ├── layout/
│   │   ├── Sidebar.jsx         # Watchlist drawer, live ticker search & quick toggle
│   │   ├── Header.jsx          # Persistent top header (adaptive for stock & portfolio views)
│   │   ├── MobileHeader.jsx    # Mobile top navigation bar
│   │   ├── NavTabs.jsx         # Desktop navigation tab switcher
│   │   └── MobileBottomNav.jsx # Mobile bottom tab bar with live badge counts
│   │
│   ├── views/
│   │   ├── PortfolioView.jsx   # Unified portfolio tracker & KPI dashboard
│   │   │   ├── portfolio/HoldingsTab.jsx   # Active holdings table (desktop) & cards (mobile)
│   │   │   ├── portfolio/SellsTab.jsx      # Realized capital gains trade log
│   │   │   └── portfolio/DividendsTab.jsx  # Consolidated multi-tranche dividend accordions
│   │   ├── NewsView.jsx        # Historical chart, Google News stream & analyst outlook
│   │   ├── ProfileView.jsx     # Company profile, market segment & executive leadership
│   │   ├── FinancialsView.jsx  # Multi-year annual & quarterly income/balance sheets & ratios
│   │   └── FilingsView.jsx     # PUCARS regulatory announcements & official PDF links
│   │
│   └── modals/
│       └── TradeModal.jsx      # Multi-mode dialog (Buy lot, Sell order, Dividend entry)
│
├── App.jsx                     # Root coordinator managing global state & API hooks
└── index.css                   # Unified design system & responsive media queries
```

---

## 🧮 4. Core Financial Algorithms & Logic

### 1. Discrete Purchase Lot Tracking & Weighted Average Cost
Rather than flattening all purchases into a single static number, the system preserves each trade as an individual transaction tranche (shares, buy price, purchase date). 

The platform dynamically calculates the **Weighted Average Buy Price** across all active tranches:
$$\text{Weighted Average Cost} = \frac{\sum_{i=1}^{n} (\text{Shares}_i \times \text{Buy Price}_i)}{\sum_{i=1}^{n} \text{Shares}_i}$$

Each individual lot tracks its own unrealized return:
$$\text{Lot P&L} = (\text{Shares}_i \times \text{Live Price}) - (\text{Shares}_i \times \text{Buy Price}_i)$$

---

### 2. First-In-First-Out (FIFO) Sell Liquidation Engine
When a user executes a sell transaction with the auto-deduct option enabled, the engine iterates through the stock's discrete purchase lots sorted chronologically by purchase date ($t_1 \le t_2 \le \dots \le t_n$):
- **Full Lot Consumption**: If $\text{Shares}_{\text{sold}} \ge \text{Shares}_{\text{lot}}$, the lot is fully liquidated and removed from the active holdings array.
- **Partial Lot Deduction**: If $\text{Shares}_{\text{sold}} < \text{Shares}_{\text{lot}}$, the lot's share count is reduced accordingly, preserving the remaining balance.
- **Realized P&L Logging**: The liquidation calculates realized proceeds vs. historical cost basis and writes a dedicated record to the Realized Sells Log.

---

### 3. Consolidated Multi-Dividend Engine with Tax Tiers
Corporate dividend payouts often occur across multiple tranches per fiscal year. The application groups all payouts by stock symbol into an expandable company accordion:
- **Tax Tier Presets**: Automatically computes withholding tax deductions for **15% (Filer)**, **30% (Non-Filer)**, and **0% (Exempt)** categories.
- **Aggregated Yield**: Computes cumulative gross income, total tax withheld, and net cash received.
- **Chronological Sorting**: Companies are sorted descending by their most recent payment date ($\text{Date}_{\text{latest}}$), prioritizing active payout cycles.

---

### 4. Trailing Twelve Months (TTM) Financial Valuation Engine
Annual financial reports are static snapshots. To provide accurate intra-year valuation multiples (such as P/E and PEG), the `calculateTTM` algorithm bridges quarterly filings with previous annual reports:
$$\text{TTM Value} = \text{Annual Value}_{Y-1} + \text{YTD Current}_{Y} - \text{YTD Previous}_{Y-1}$$

This calculation powers live valuation metrics (PE TTM, EPS Growth TTM, Net Profit Margin TTM) even before audited annual reports are published.

---

### 5. Rule-Based Natural Language Sentiment Analyzer
A lightweight client-side sentiment classifier parses incoming Google News RSS titles in real-time using financial sentiment lexicon mapping:
- **Positive Scoring Dictionary**: `profit`, `dividend`, `growth`, `record`, `expansion`, `upgrade`, `earnings`, `success`.
- **Negative Scoring Dictionary**: `loss`, `decline`, `crisis`, `investigation`, `penalty`, `deficit`, `shrink`, `warn`.
- Output tags articles as **Positive**, **Negative**, or **Neutral** with corresponding color badges.

---

### 6. Five-Point Investment Quality Scorecard
The platform automatically evaluates 5 fundamental health criteria for any selected equity:
1. **Consistent Profitability**: Verifies strictly positive EPS across all recorded historical years.
2. **Earnings Growth Momentum**: Tests whether $\text{EPS}_{\text{latest}} > \text{EPS}_{\text{previous}}$.
3. **Liquidity & Free Float Margin**: Validates free float ratio $\ge 20\%$ to ensure institutional tradeability.
4. **Valuation Safety (PEG Ratio)**: Checks if the Price/Earnings-to-Growth ratio falls within the healthy value range ($0 < \text{PEG} < 1.5$).
5. **Active Corporate Yield**: Checks for active dividend distributions and book closure announcements.

---

## 🎨 5. Front-End & UI/UX Engineering Highlights

1. **Precision Table Alignment**:
   - Implemented `table-layout: fixed` and matching `<colgroup>` percentage column constraints on desktop tables to ensure child accordion rows never drift from parent header boundaries.
2. **Dual-Responsive Layout Paradigm**:
   - **Desktop Screens (> 900px)**: Comprehensive financial data tables, sticky headers, fixed navigation tab bars, and multi-column KPI grids.
   - **Mobile Viewports (≤ 900px)**: Zero-horizontal-scroll card stacks, touch-friendly 3-column action button grids, slide-out drawer menus, and fixed bottom navigation with notification badges.
3. **Cross-Browser Dark Mode Date Picker**:
   - Replaced fragile CSS filter inversions with an explicit inline `#ffffff` SVG data URI for WebKit date picker calendar indicators, guaranteeing crisp visibility on macOS, iOS, and Chromium engines.

---

## 💼 6. Key Technical Competencies Demonstrated

This project demonstrates strong proficiency in:
- **Advanced React & State Management**: Custom hooks, state persistence, modular component architecture, and performance optimization.
- **Financial Engineering & Algorithms**: FIFO inventory liquidation, weighted average cost accounting, and Trailing Twelve Months (TTM) financial statement reconstruction.
- **Full-Stack Integration & Web Scraping**: Resilient backend data ingestion, Cheerio HTML parsing, and serverless deployment.
- **Vanilla CSS & Design Systems**: Complex responsive layouts, CSS custom properties, micro-animations, and accessible dark mode design without framework dependencies.
- **Data Visualization**: Custom mathematical SVG path calculation, coordinate mapping, and touch event handling.

---

## 🚀 7. Local Setup & Execution

```bash
# 1. Clone the project repository
git clone https://github.com/your-username/stock.git
cd stock

# 2. Install dependencies
npm install

# 3. Launch development server
npm run dev

# 4. Access the application
http://localhost:5173
```
