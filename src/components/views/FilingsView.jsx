import React, { useState } from 'react';
import { FileText, Search, X, Clock, ExternalLink } from 'lucide-react';

export default function FilingsView({ stockDetails }) {
  const [filingsSearch, setFilingsSearch] = useState('');

  if (!stockDetails) return null;

  const list = (stockDetails.announcements || []).filter(ann => {
    if (!filingsSearch.trim()) return true;
    const q = filingsSearch.toLowerCase();
    return (ann.title && ann.title.toLowerCase().includes(q)) || 
           (ann.type && ann.type.toLowerCase().includes(q)) ||
           (ann.date && ann.date.toLowerCase().includes(q));
  });

  return (
    <div className="filings-container">
      <div className="card">
        <div className="filings-header-row">
          <div className="filings-title-group">
            <h3 className="card-title" style={{ marginBottom: '4px' }}>
              <FileText size={18} style={{ color: 'var(--accent-emerald)' }} />
              <span>Regulatory Filings & Announcements (PUCARS)</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Official corporate disclosures, financial reports, board meetings, and material compliance notices for <strong>{stockDetails.symbol}</strong> ({stockDetails.companyName}).
            </p>
          </div>
          <span className="filings-count-badge">
            {stockDetails.announcements?.length || 0} Documents
          </span>
        </div>

        {/* Search & Filter */}
        <div className="filings-controls-row">
          <div className="filings-search-box">
            <Search size={15} style={{ color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Filter filings by title, type, or date..."
              value={filingsSearch}
              onChange={(e) => setFilingsSearch(e.target.value)}
              className="filings-search-input"
            />
            {filingsSearch && (
              <button 
                className="btn-icon-clear" 
                onClick={() => setFilingsSearch('')}
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Filings List */}
        {list.length === 0 ? (
          <div className="filings-empty-state">
            <FileText size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <h4>{filingsSearch ? `No filings found matching "${filingsSearch}"` : 'No Regulatory Filings Available'}</h4>
            <p>There are no corporate announcements or PUCARS compliance documents currently indexed for this ticker.</p>
          </div>
        ) : (
          <div className="filings-full-list">
            {list.map((ann, idx) => (
              <div key={idx} className="filing-card-item">
                <div className="filing-content-area">
                  <div className="filing-meta-header">
                    <span className="filing-type-tag">{ann.type || 'Disclosure'}</span>
                    <span className="filing-date-text">
                      <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                      {ann.date}
                    </span>
                  </div>
                  <h4 className="filing-title-text">{ann.title}</h4>
                </div>
                <div className="filing-action-col">
                  {ann.link ? (
                    <a 
                      href={ann.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-filing-view"
                    >
                      <span>View PDF</span>
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <span className="filing-no-pdf">No PDF</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
