import React from 'react';
import { Menu, Layers } from 'lucide-react';
import { getPriceColor } from '../../utils/formatters';
import PsxLogo from '../common/PsxLogo';

export default function MobileHeader({
  activeTab,
  portfolioName,
  selectedSymbol,
  stockDetails,
  consolidatedHoldings,
  watchlistSymbols,
  setIsSidebarOpen
}) {
  return (
    <div className="mobile-nav-bar">
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open Watchlist Menu"
      >
        <Menu size={20} />
      </button>
      
      <div className="mobile-brand">
        <div className={`mobile-logo ${activeTab !== 'portfolio' ? 'has-psx-logo' : ''}`}>
          {activeTab === 'portfolio' ? '💼' : <PsxLogo size={28} />}
        </div>
        <span className="mobile-title">{activeTab === 'portfolio' ? portfolioName : selectedSymbol}</span>
        {activeTab !== 'portfolio' && stockDetails && (
          <span className={`mobile-price-chip ${getPriceColor(stockDetails.change)}`}>
            Rs. {stockDetails.price.toFixed(2)}
          </span>
        )}
        {activeTab === 'portfolio' && (
          <span className="mobile-price-chip" style={{ color: 'var(--accent-emerald)', backgroundColor: 'var(--accent-emerald-light)' }}>
            {consolidatedHoldings.length} Holding{consolidatedHoldings.length === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <button 
        className="mobile-watchlist-btn"
        onClick={() => setIsSidebarOpen(true)}
        title="Open Stock Search & Watchlist"
      >
        <Layers size={15} />
        <span>Watchlist ({watchlistSymbols.length})</span>
      </button>
    </div>
  );
}
