import React from 'react';
import { Info, Briefcase } from 'lucide-react';

export default function ProfileView({ stockDetails }) {
  if (!stockDetails) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card">
        <h3 className="card-title">
          <Info size={18} style={{ color: 'var(--accent-blue)' }} />
          <span>Company Overview</span>
        </h3>
        <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
          {stockDetails.companyName} is listed on the Pakistan Stock Exchange under ticker <strong>{stockDetails.symbol}</strong>. 
          The company is classified under the <strong>{stockDetails.sector}</strong> sector. Detailed business operations, quarterly filings, and corporate governance compliance can be verified through the official regulatory disclosures.
        </p>
        <div className="quick-stats-grid">
          <div className="metric-card">
            <span className="metric-label">Today's High</span>
            <span className="metric-value" style={{ color: 'var(--color-green)' }}>Rs. {stockDetails.high.toFixed(2)}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Today's Low</span>
            <span className="metric-value" style={{ color: 'var(--color-red)' }}>Rs. {stockDetails.low.toFixed(2)}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">52-Week High</span>
            <span className="metric-value" style={{ color: 'var(--color-green)' }}>Rs. {(stockDetails.fiftyTwoWeekHigh || stockDetails.high).toFixed(2)}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">52-Week Low</span>
            <span className="metric-value" style={{ color: 'var(--color-red)' }}>Rs. {(stockDetails.fiftyTwoWeekLow || stockDetails.low).toFixed(2)}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Volume (Session)</span>
            <span className="metric-value">{stockDetails.volume.toLocaleString()}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Market Segment</span>
            <span className="metric-value">Regular (REG)</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">
          <Briefcase size={18} style={{ color: 'var(--accent-purple)' }} />
          <span>Executive Leadership</span>
        </h3>
        <div className="people-grid">
          {(!stockDetails.management || stockDetails.management.length === 0) ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '16px 0' }}>
              No executive director profile indexed in the public domain.
            </div>
          ) : (
            stockDetails.management.map((person, idx) => (
              <div key={idx} className="person-row">
                <span className="person-name">{person.name}</span>
                <span className="person-role">{person.role}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
