import React from 'react';
import { 
  Wallet, 
  PieChart, 
  ArrowDownRight, 
  Receipt, 
  Plus, 
  Clock, 
  Edit3, 
  Check, 
  X, 
  ChevronDown 
} from 'lucide-react';
import HoldingsTab from './portfolio/HoldingsTab';
import SellsTab from './portfolio/SellsTab';
import DividendsTab from './portfolio/DividendsTab';

export default function PortfolioView({
  portfolioName,
  setPortfolioName,
  isEditingPortfolioName,
  setIsEditingPortfolioName,
  tempPortfolioName,
  setTempPortfolioName,
  isMarketOpen,
  currentLiveTime,
  isTransactionMenuOpen,
  setIsTransactionMenuOpen,
  openBuyModal,
  openSellModal,
  openDividendModal,
  totalPortfolioValue,
  totalInvestedAmount,
  totalUnrealizedPnL,
  totalUnrealizedPnLPct,
  totalDayPnL,
  totalDayPnLPct,
  totalRealizedGain,
  totalNetDividends,
  portfolioSubTab,
  setPortfolioSubTab,
  consolidatedHoldings,
  sells,
  calculatedSells,
  dividends,
  consolidatedDividends,
  expandedStocks,
  toggleStockExpansion,
  expandedDividends,
  toggleDividendExpansion,
  handleDeleteLot,
  handleDeleteEntireStock,
  handleDeleteSell,
  handleDeleteDividend,
  handleDeleteEntireDividendStock
}) {
  return (
    <div className="portfolio-unified-container">
      {/* 1. DESKTOP PORTFOLIO VIEW (Screen > 900px) */}
      <div className="portfolio-desktop-view">
        {/* Desktop 4-Card Summary Metrics */}
        <div className="desktop-kpi-grid">
          <div className="desktop-kpi-card">
            <div className="desktop-kpi-top">
              <span className="desktop-kpi-lbl">Current Market Value</span>
              <Wallet size={16} style={{ color: 'var(--accent-emerald)' }} />
            </div>
            <div className="desktop-kpi-val bold-cyan">Rs. {totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            <div className={`desktop-kpi-sub ${totalDayPnL >= 0 ? 'pos-text' : 'neg-text'}`}>
              <span>Day Gain: {totalDayPnL >= 0 ? '+' : ''}Rs. {totalDayPnL.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ({totalDayPnL >= 0 ? '+' : ''}{totalDayPnLPct.toFixed(2)}%)</span>
            </div>
          </div>

          <div className="desktop-kpi-card">
            <div className="desktop-kpi-top">
              <span className="desktop-kpi-lbl">Total Cost Basis</span>
              <PieChart size={16} style={{ color: 'var(--accent-blue)' }} />
            </div>
            <div className="desktop-kpi-val">Rs. {totalInvestedAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            <div className={`desktop-kpi-sub ${totalUnrealizedPnL >= 0 ? 'pos-text' : 'neg-text'}`}>
              <span>Total Return: {totalUnrealizedPnL >= 0 ? '+' : ''}Rs. {totalUnrealizedPnL.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ({totalUnrealizedPnL >= 0 ? '+' : ''}{totalUnrealizedPnLPct.toFixed(2)}%)</span>
            </div>
          </div>

          <div className="desktop-kpi-card">
            <div className="desktop-kpi-top">
              <span className="desktop-kpi-lbl">Realized Sell Gain/Loss</span>
              <ArrowDownRight size={16} style={{ color: 'var(--accent-purple)' }} />
            </div>
            <div className={`desktop-kpi-val ${totalRealizedGain >= 0 ? 'pos-text' : 'neg-text'}`}>
              {totalRealizedGain >= 0 ? '+' : ''}Rs. {totalRealizedGain.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="desktop-kpi-sub" style={{ color: 'var(--text-muted)' }}>
              <span>From {sells.length} executed sell trade{sells.length === 1 ? '' : 's'}</span>
            </div>
          </div>

          <div className="desktop-kpi-card">
            <div className="desktop-kpi-top">
              <span className="desktop-kpi-lbl">Net Dividends Collected</span>
              <Receipt size={16} style={{ color: 'var(--accent-amber)' }} />
            </div>
            <div className="desktop-kpi-val pos-text">Rs. {totalNetDividends.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            <div className="desktop-kpi-sub" style={{ color: 'var(--text-muted)' }}>
              <span>From {dividends.length} logged dividend payout{dividends.length === 1 ? '' : 's'}</span>
            </div>
          </div>
        </div>

        {/* Desktop Subtabs */}
        <div className="desktop-subtabs-bar">
          <button 
            className={`desktop-subtab-btn ${portfolioSubTab === 'holdings' ? 'active' : ''}`}
            onClick={() => setPortfolioSubTab('holdings')}
          >
            <Wallet size={14} />
            <span>Active Holdings ({consolidatedHoldings.length})</span>
          </button>
          <button 
            className={`desktop-subtab-btn ${portfolioSubTab === 'sells' ? 'active' : ''}`}
            onClick={() => setPortfolioSubTab('sells')}
          >
            <ArrowDownRight size={14} />
            <span>Realized Sells ({sells.length})</span>
          </button>
          <button 
            className={`desktop-subtab-btn ${portfolioSubTab === 'dividends' ? 'active' : ''}`}
            onClick={() => setPortfolioSubTab('dividends')}
          >
            <Receipt size={14} />
            <span>Dividend Income ({consolidatedDividends.length})</span>
          </button>
        </div>

        {/* Subtab Contents for Desktop Table View */}
        {portfolioSubTab === 'holdings' && (
          <HoldingsTab 
            isMobile={false}
            consolidatedHoldings={consolidatedHoldings}
            expandedStocks={expandedStocks}
            toggleStockExpansion={toggleStockExpansion}
            openBuyModal={openBuyModal}
            openSellModal={openSellModal}
            handleDeleteLot={handleDeleteLot}
            handleDeleteEntireStock={handleDeleteEntireStock}
          />
        )}

        {portfolioSubTab === 'sells' && (
          <SellsTab 
            isMobile={false}
            sells={sells}
            calculatedSells={calculatedSells}
            openSellModal={openSellModal}
            handleDeleteSell={handleDeleteSell}
          />
        )}

        {portfolioSubTab === 'dividends' && (
          <DividendsTab 
            isMobile={false}
            consolidatedDividends={consolidatedDividends}
            expandedDividends={expandedDividends}
            toggleDividendExpansion={toggleDividendExpansion}
            openDividendModal={openDividendModal}
            handleDeleteDividend={handleDeleteDividend}
            handleDeleteEntireDividendStock={handleDeleteEntireDividendStock}
          />
        )}
      </div>

      {/* 2. MOBILE INVESTIFY PORTFOLIO VIEW (Screen <= 900px, Investify Card Layout) */}
      <div className="portfolio-mobile-view investify-container">
        {/* Investify Market Ribbon */}
        <div className="investify-ribbon">
          <div className="investify-ribbon-left">
            <span className={`investify-market-badge ${isMarketOpen ? 'open' : 'closed'}`}>
              <span className="pulse-dot"></span>
              {isMarketOpen ? 'OPEN' : 'CLOSED'}
            </span>
            <div className="investify-benchmark">
              <span className="investify-bm-sym">KSE100</span>
              <span className="investify-bm-val">169,392</span>
              <span className="investify-bm-chg up">+1,422 ▲ 0.85%</span>
            </div>
          </div>
          <div className="investify-ribbon-right">
            <Clock size={12} />
            <span>{currentLiveTime || '15 SEP 5:30PM'}</span>
          </div>
        </div>

        {/* Investify Top Actions Bar */}
        <div className="investify-toolbar">
          <div className="investify-toolbar-left">
            {isEditingPortfolioName ? (
              <div className="investify-name-edit-box">
                <input 
                  type="text" 
                  value={tempPortfolioName}
                  onChange={(e) => setTempPortfolioName(e.target.value)}
                  className="investify-name-input"
                  placeholder="Portfolio Name"
                  autoFocus
                />
                <button 
                  className="investify-btn-icon-save"
                  onClick={() => {
                    const clean = tempPortfolioName.trim() || 'My Portfolio';
                    setPortfolioName(clean);
                    setIsEditingPortfolioName(false);
                  }}
                >
                  <Check size={14} />
                </button>
                <button 
                  className="investify-btn-icon-cancel"
                  onClick={() => {
                    setTempPortfolioName(portfolioName);
                    setIsEditingPortfolioName(false);
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button 
                className="investify-tool-btn"
                onClick={() => {
                  setTempPortfolioName(portfolioName);
                  setIsEditingPortfolioName(true);
                }}
              >
                <Edit3 size={13} />
                <span>Edit Portfolio</span>
              </button>
            )}
          </div>

          <div className="investify-toolbar-right">
            <div className="investify-tx-dropdown-wrapper">
              <button 
                className="investify-tool-btn primary"
                onClick={() => setIsTransactionMenuOpen(!isTransactionMenuOpen)}
              >
                <Plus size={14} />
                <span>Transaction</span>
                <ChevronDown size={12} />
              </button>

              {isTransactionMenuOpen && (
                <div className="investify-tx-menu">
                  <button 
                    className="investify-tx-menu-item"
                    onClick={() => {
                      setIsTransactionMenuOpen(false);
                      openBuyModal();
                    }}
                  >
                    <Plus size={14} style={{ color: 'var(--accent-emerald)' }} />
                    <div>
                      <strong>Record Purchase Lot</strong>
                      <span>Add buying lot with custom price & date</span>
                    </div>
                  </button>
                  <button 
                    className="investify-tx-menu-item"
                    onClick={() => {
                      setIsTransactionMenuOpen(false);
                      openSellModal();
                    }}
                  >
                    <ArrowDownRight size={14} style={{ color: 'var(--color-red)' }} />
                    <div>
                      <strong>Record Sell Order</strong>
                      <span>Realize profit/loss and reduce holdings</span>
                    </div>
                  </button>
                  <button 
                    className="investify-tx-menu-item"
                    onClick={() => {
                      setIsTransactionMenuOpen(false);
                      openDividendModal();
                    }}
                  >
                    <Receipt size={14} style={{ color: 'var(--accent-amber)' }} />
                    <div>
                      <strong>Log Dividend Payout</strong>
                      <span>Record DPS, tax deduction & net income</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Investify Hero Overview Card */}
        <div className="investify-hero-card">
          <div className="investify-hero-header">
            <div className="investify-hero-name-col">
              <span className="investify-sub-tag">PORTFOLIO NAME</span>
              <h2 className="investify-hero-title">{portfolioName}</h2>
            </div>
            <div className="investify-hero-val-col">
              <span className="investify-sub-tag">CURRENT MARKET VALUE</span>
              <div className="investify-hero-mv-row">
                <span className="investify-currency">Rs.</span>
                <span className="investify-hero-mv">
                  {totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          {/* Side-by-Side High Contrast Status Blocks */}
          <div className="investify-hero-pnl-grid">
            <div className={`investify-pnl-block ${totalDayPnL >= 0 ? 'pos' : 'neg'}`}>
              <span className="investify-pnl-block-title">DAY'S P&L HOLDING</span>
              <span className="investify-pnl-block-val">
                {totalDayPnL >= 0 ? '+' : ''}{totalDayPnL.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ({totalDayPnL >= 0 ? '+' : ''}{totalDayPnLPct.toFixed(2)}%)
              </span>
            </div>

            <div className={`investify-pnl-block ${totalUnrealizedPnL >= 0 ? 'pos' : 'neg'}`}>
              <span className="investify-pnl-block-title">TOTAL P&L HOLDING</span>
              <span className="investify-pnl-block-val">
                {totalUnrealizedPnL >= 0 ? '+' : ''}{totalUnrealizedPnL.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ({totalUnrealizedPnL >= 0 ? '+' : ''}{totalUnrealizedPnLPct.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Holding Section Header Banner */}
        <div className="investify-section-banner">
          <div className="investify-banner-title-group">
            <h3 className="investify-banner-title">HOLDING</h3>
            <span className="investify-banner-sub">Shares in Hand</span>
          </div>
          <div className="investify-banner-actions">
            <button 
              className="investify-banner-btn"
              title="Add new purchase lot"
              onClick={() => openBuyModal()}
            >
              <Plus size={15} />
            </button>
          </div>
        </div>

        {/* Sub-Tab Navigation Chips */}
        <div className="investify-subtabs">
          <button 
            className={`investify-subtab-chip ${portfolioSubTab === 'holdings' ? 'active' : ''}`}
            onClick={() => setPortfolioSubTab('holdings')}
          >
            <Wallet size={13} />
            <span>Holdings ({consolidatedHoldings.length})</span>
          </button>
          <button 
            className={`investify-subtab-chip ${portfolioSubTab === 'sells' ? 'active' : ''}`}
            onClick={() => setPortfolioSubTab('sells')}
          >
            <ArrowDownRight size={13} />
            <span>Sells ({sells.length})</span>
          </button>
          <button 
            className={`investify-subtab-chip ${portfolioSubTab === 'dividends' ? 'active' : ''}`}
            onClick={() => setPortfolioSubTab('dividends')}
          >
            <Receipt size={13} />
            <span>Dividends ({consolidatedDividends.length})</span>
          </button>
        </div>

        {/* Subtab Contents for Mobile View */}
        {portfolioSubTab === 'holdings' && (
          <HoldingsTab 
            isMobile={true}
            consolidatedHoldings={consolidatedHoldings}
            expandedStocks={expandedStocks}
            toggleStockExpansion={toggleStockExpansion}
            openBuyModal={openBuyModal}
            openSellModal={openSellModal}
            handleDeleteLot={handleDeleteLot}
            handleDeleteEntireStock={handleDeleteEntireStock}
          />
        )}

        {portfolioSubTab === 'sells' && (
          <SellsTab 
            isMobile={true}
            sells={sells}
            calculatedSells={calculatedSells}
            openSellModal={openSellModal}
            handleDeleteSell={handleDeleteSell}
          />
        )}

        {portfolioSubTab === 'dividends' && (
          <DividendsTab 
            isMobile={true}
            consolidatedDividends={consolidatedDividends}
            expandedDividends={expandedDividends}
            toggleDividendExpansion={toggleDividendExpansion}
            openDividendModal={openDividendModal}
            handleDeleteDividend={handleDeleteDividend}
            handleDeleteEntireDividendStock={handleDeleteEntireDividendStock}
          />
        )}
      </div>
    </div>
  );
}
