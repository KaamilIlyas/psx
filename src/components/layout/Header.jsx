import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Wallet, 
  Edit3, 
  Check, 
  X, 
  Clock, 
  Plus, 
  ArrowDownRight, 
  Receipt 
} from 'lucide-react';
import { getPriceColor } from '../../utils/formatters';

export default function Header({
  activeTab,
  portfolioName,
  setPortfolioName,
  isEditingPortfolioName,
  setIsEditingPortfolioName,
  tempPortfolioName,
  setTempPortfolioName,
  isMarketOpen,
  currentLiveTime,
  consolidatedHoldings = [],
  openBuyModal,
  openSellModal,
  openDividendModal,
  loadingDetails,
  stockDetails,
  handleManualRefresh
}) {
  // 1. Portfolio Mode Header
  if (activeTab === 'portfolio') {
    return (
      <header className="dash-header">
        <div className="dash-company-info">
          <div className="dash-avatar" style={{ background: 'linear-gradient(135deg, #0d9488, #10b981)', boxShadow: '0 3px 8px rgba(13, 148, 136, 0.4)' }}>
            <Wallet size={22} />
          </div>
          <div className="dash-name-block">
            {isEditingPortfolioName ? (
              <div className="desktop-title-edit-box">
                <input 
                  type="text" 
                  value={tempPortfolioName} 
                  onChange={(e) => setTempPortfolioName(e.target.value)}
                  className="desktop-title-input"
                  autoFocus
                />
                <button 
                  className="btn-icon-save"
                  onClick={() => {
                    const clean = tempPortfolioName.trim() || 'My Portfolio';
                    setPortfolioName(clean);
                    setIsEditingPortfolioName(false);
                  }}
                >
                  <Check size={14} />
                </button>
                <button 
                  className="btn-icon-cancel"
                  onClick={() => {
                    setTempPortfolioName(portfolioName);
                    setIsEditingPortfolioName(false);
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="dash-title">{portfolioName}</h2>
                <button 
                  className="desktop-btn-edit-title" 
                  title="Rename Portfolio"
                  onClick={() => {
                    setTempPortfolioName(portfolioName);
                    setIsEditingPortfolioName(true);
                  }}
                >
                  <Edit3 size={13} />
                </button>
              </div>
            )}
            <div className="dash-subtitle-row">
              <span className="dash-symbol-pill">{consolidatedHoldings.length} Holding{consolidatedHoldings.length === 1 ? '' : 's'}</span>
              <span className={`investify-market-badge ${isMarketOpen ? 'open' : 'closed'}`}>
                <span className="pulse-dot"></span>
                {isMarketOpen ? 'MARKET OPEN' : 'MARKET CLOSED'}
              </span>
              <span className="desktop-time-tag"><Clock size={12} /> {currentLiveTime}</span>
            </div>
          </div>
        </div>

        {/* Right side quick action buttons for portfolio */}
        <div className="desktop-portfolio-action-btns">
          <button className="btn-portfolio-action primary" onClick={() => openBuyModal()}>
            <Plus size={14} />
            <span className="btn-lbl-full">Record Purchase Lot</span>
            <span className="btn-lbl-short">Buy Lot</span>
          </button>
          <button className="btn-portfolio-action secondary" onClick={() => openSellModal()}>
            <ArrowDownRight size={14} />
            <span className="btn-lbl-full">Record Sell Order</span>
            <span className="btn-lbl-short">Sell</span>
          </button>
          <button className="btn-portfolio-action secondary" onClick={() => openDividendModal()}>
            <Receipt size={14} />
            <span className="btn-lbl-full">Log Dividend</span>
            <span className="btn-lbl-short">Dividend</span>
          </button>
        </div>
      </header>
    );
  }

  // 2. Stock Detail Mode Header
  return (
    <header className="dash-header">
      {loadingDetails && !stockDetails ? (
        <div className="dash-company-info">
          <div className="spinner" style={{ width: '24px', height: '24px' }}></div>
          <span>Loading company statistics...</span>
        </div>
      ) : stockDetails ? (
        <>
          <div className="dash-company-info">
            <div className="dash-avatar">
              {stockDetails.symbol.substring(0, 2)}
            </div>
            <div className="dash-name-block">
              <h2 className="dash-title">{stockDetails.companyName}</h2>
              <div className="dash-subtitle-row">
                <span className="dash-symbol-pill">{stockDetails.symbol}</span>
                <span className="dash-sector-pill">{stockDetails.sector}</span>
              </div>
            </div>
          </div>

          <div className="dash-price-block">
            <div className="dash-price-value-row">
              <span className="dash-price">Rs. {stockDetails.price.toFixed(2)}</span>
              <span className={`dash-change-badge ${getPriceColor(stockDetails.change)}`}>
                {stockDetails.change >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                <span>{stockDetails.change >= 0 ? '+' : ''}{stockDetails.change.toFixed(2)} ({stockDetails.changePercent.toFixed(2)}%)</span>
              </span>
            </div>
            <button className="btn-refresh" onClick={handleManualRefresh} aria-label="Refresh Stock Data">
              <RefreshCw size={14} />
              <span className="btn-refresh-text">Refresh</span>
            </button>
          </div>
        </>
      ) : (
        <div style={{ color: 'var(--text-secondary)' }}>Select a stock from the watchlist to view market data.</div>
      )}
    </header>
  );
}
