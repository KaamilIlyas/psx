import React from 'react';
import { Home, Info, BarChart2, FileText, Wallet } from 'lucide-react';

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  setIsSidebarOpen,
  stockDetails,
  consolidatedHoldings
}) {
  return (
    <nav className="mobile-bottom-nav">
      <button 
        className={`mobile-bottom-item ${activeTab === 'news' ? 'active' : ''}`}
        onClick={() => { setActiveTab('news'); setIsSidebarOpen(false); }}
      >
        <Home size={19} />
        <span>Home</span>
      </button>
      <button 
        className={`mobile-bottom-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }}
      >
        <Info size={19} />
        <span>Profile</span>
      </button>
      <button 
        className={`mobile-bottom-item ${activeTab === 'financials' ? 'active' : ''}`}
        onClick={() => { setActiveTab('financials'); setIsSidebarOpen(false); }}
      >
        <BarChart2 size={19} />
        <span>Market</span>
      </button>
      <button 
        className={`mobile-bottom-item ${activeTab === 'filings' ? 'active' : ''}`}
        onClick={() => { setActiveTab('filings'); setIsSidebarOpen(false); }}
      >
        <FileText size={19} />
        <span>Filings</span>
        {stockDetails?.announcements?.length > 0 && (
          <span className="mobile-nav-badge" style={{ backgroundColor: 'var(--accent-blue)' }}>{stockDetails.announcements.length}</span>
        )}
      </button>
      <button 
        className={`mobile-bottom-item ${activeTab === 'portfolio' ? 'active' : ''}`}
        onClick={() => { setActiveTab('portfolio'); setIsSidebarOpen(false); }}
      >
        <Wallet size={19} />
        <span>Portfolio</span>
        {consolidatedHoldings.length > 0 && (
          <span className="mobile-nav-badge">{consolidatedHoldings.length}</span>
        )}
      </button>
    </nav>
  );
}
