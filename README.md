# PSX Watch & Portfolio Tracker

A portfolio tracker and analytics dashboard for the Pakistan Stock Exchange (PSX). Tracks multi-tranche purchase lots, calculates realized and unrealized P&L via FIFO liquidation, logs dividend income with tax withholding tiers, and scrapes live market data and financial statements.

## Features

- **Portfolio Tracking**: Buy lot tracking with individual purchase dates and prices, weighted average cost basis, and FIFO sell deductions.
- **Dividend Ledger**: Groups payouts by company, tracks withholding tax (15% filer, 30% non-filer, 0% exempt), and computes net income.
- **Market Quotes & Financials**: Scrapes live PSX quotes, session highs/lows, 52-week ranges, and annual/quarterly statements via Cheerio.
- **TTM Analytics**: Trailing twelve-month calculations for P/E, PEG, EPS growth, and profit margins.
- **Regulatory Filings & News**: Scrapes PUCARS announcements (with PDF links) and Google News RSS feeds with keyword sentiment tagging.
- **Lightweight Charts**: Custom zero-dependency SVG sparklines and volume histograms.

## Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS
- **Backend**: Node.js, Express, Cheerio, RSS Parser
- **Storage**: Client-side localStorage persistence

## Getting Started

### Prerequisites

Node.js 18+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KaamilIlyas/psx.git
   cd psx
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server (runs backend scraper on `:3001` and Vite frontend on `:5173`):
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## License

MIT\n