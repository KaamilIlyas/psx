import React from 'react';
import { X, Wallet, Search, Trash2 } from 'lucide-react';
import { getPriceColor } from '../../utils/formatters';
import PsxLogo from '../common/PsxLogo';

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
  consolidatedHoldings,
  handleAddSymbol,
  searchVal,
  setSearchVal,
  loadingWatchlist,
  watchlistData,
  selectedSymbol,
  handleSelectStock,
  handleRemoveSymbol
}) {
  const totalVal = consolidatedHoldings.reduce((sum, h) => sum + h.currentVal, 0);

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div 
        className={`sidebar-backdrop ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Watchlist */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <PsxLogo size={34} />
            </div>
            <h1 className="sidebar-title">PSX Watch</h1>
          </div>
          <button 
            className="btn-sidebar-close" 
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close Watchlist Drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* PSX Watch Quick Switch to My Portfolio */}
        <div className="sidebar-nav-section">
          <button 
            className={`sidebar-portfolio-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('portfolio');
              setIsSidebarOpen(false);
            }}
          >
            <div className="sidebar-portfolio-left">
              <div className="sidebar-portfolio-icon">
                <Wallet size={16} />
              </div>
              <div className="sidebar-portfolio-info">
                <span className="sidebar-portfolio-title">My Portfolio</span>
                <span className="sidebar-portfolio-sub">{consolidatedHoldings.length} holding{consolidatedHoldings.length === 1 ? '' : 's'}</span>
              </div>
            </div>
            <div className="sidebar-portfolio-badge">
              <span className="sidebar-portfolio-val">
                Rs. {totalVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
          </button>
        </div>
        
        <form onSubmit={handleAddSymbol} className="search-container">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Add symbol (e.g. ENGRO)" 
            className="search-input"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <button type="submit" style={{ display: 'none' }} />
        </form>
        
        <div className="stock-list">
          {loadingWatchlist && watchlistData.length === 0 ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <span>Loading quotes...</span>
            </div>
          ) : watchlistData.length === 0 ? (
            <div className="error-container" style={{ padding: '24px', textAlign: 'center' }}>
              <span>Watchlist is empty. Search symbols above.</span>
            </div>
          ) : (
            watchlistData.map((stock) => {
              const colorClass = getPriceColor(stock.change);
              const isActive = selectedSymbol === stock.symbol;
              return (
                <div 
                  key={stock.symbol}
                  className={`stock-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectStock(stock.symbol)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSelectStock(stock.symbol);
                    }
                  }}
                >
                  <div className="stock-item-info">
                    <span className="stock-item-symbol">{stock.symbol}</span>
                    <span className="stock-item-name">{stock.name}</span>
                  </div>
                  <div className="stock-item-price-block">
                    <span className="stock-item-price">Rs. {stock.price.toFixed(2)}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                      <span className={`stock-item-change ${colorClass}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                      <button 
                        className="btn-trash"
                        aria-label={`Remove ${stock.symbol}`}
                        onClick={(e) => handleRemoveSymbol(e, stock.symbol)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}
