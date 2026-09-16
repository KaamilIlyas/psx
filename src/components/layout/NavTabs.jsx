import React from 'react';
import { Newspaper, Info, Percent, FileText, Wallet } from 'lucide-react';

export default function NavTabs({
  activeTab,
  setActiveTab,
  stockDetails,
  consolidatedHoldings
}) {
  return (
    <nav className="tabs-bar" aria-label="Dashboard Sections">
      <div className="tabs-list">
        <button 
          className={`tab-button ${activeTab === 'news' ? 'active' : ''}`}
          onClick={() => setActiveTab('news')}
        >
          <Newspaper size={14} />
          <span>Overview & News</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <Info size={14} />
          <span>Profile & Team</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'financials' ? 'active' : ''}`}
          onClick={() => setActiveTab('financials')}
        >
          <Percent size={14} />
          <span>Financials & Ratios</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'filings' ? 'active' : ''}`}
          onClick={() => setActiveTab('filings')}
        >
          <FileText size={14} />
          <span>Regulatory Filings {stockDetails?.announcements?.length ? `(${stockDetails.announcements.length})` : ''}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
          style={{ color: activeTab === 'portfolio' ? 'var(--accent-emerald)' : undefined, fontWeight: 700 }}
        >
          <Wallet size={14} />
          <span>My Portfolio ({consolidatedHoldings.length})</span>
        </button>
      </div>
    </nav>
  );
}
