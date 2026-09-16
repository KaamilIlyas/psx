import React from 'react';
import { TrendingUp, Newspaper, Briefcase, Percent, PieChart } from 'lucide-react';
import StockChart from '../common/StockChart';
import { analyzeSentiment } from '../../utils/sentiment';
import { calculateTTM } from '../../utils/financials';
import { getPriceColor, formatTime, getAnalystSummary, getInvestmentDetails } from '../../utils/formatters';

export default function NewsView({
  stockDetails,
  newsList,
  chartTimeframe,
  setChartTimeframe
}) {
  if (!stockDetails) return null;

  return (
    <div className="grid-overview">
      <div className="overview-main-col">
        {/* SVG Sparkline Price History Card */}
        <div className="card">
          <div className="chart-header-row">
            <h3 className="card-title" style={{ margin: 0 }}>
              <TrendingUp size={18} style={{ color: 'var(--accent-emerald)' }} />
              <span>Price History</span>
            </h3>
            <div className="timeframe-buttons">
              {['1M', '6M', '1Y', '5Y'].map((tf) => (
                <button
                  key={tf}
                  className={`timeframe-btn ${chartTimeframe === tf ? 'active' : ''}`}
                  onClick={() => setChartTimeframe(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <StockChart 
            history={stockDetails.priceHistory} 
            colorClass={getPriceColor(stockDetails.change)} 
            timeframe={chartTimeframe}
          />
        </div>

        {/* Stock specific Google News stream */}
        <div className="card">
          <h3 className="card-title">
            <Newspaper size={18} style={{ color: 'var(--accent-blue)' }} />
            <span>Latest News Coverage</span>
          </h3>
          <div className="news-feed">
            {newsList.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                No recent news articles found for this company.
              </div>
            ) : (
              newsList.map((article, idx) => {
                const sentiment = analyzeSentiment(article.title);
                return (
                  <a 
                    key={idx} 
                    href={article.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="news-card"
                  >
                    <div className="news-meta">
                      <div className="news-source-row">
                        <span className="news-source">{article.source}</span>
                        <span className={`news-sentiment ${sentiment.toLowerCase()}`}>
                          {sentiment}
                        </span>
                      </div>
                      <span className="news-date">{formatTime(article.pubDate)}</span>
                    </div>
                    <h4 className="news-title">{article.title}</h4>
                    <p className="news-snippet">{article.snippet}</p>
                  </a>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="overview-sidebar-col">
        {/* Analyst Outlook Summary */}
        <div className="card">
          <h3 className="card-title">
            <Briefcase size={18} style={{ color: 'var(--accent-blue)' }} />
            <span>Analyst Outlook</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {getAnalystSummary(stockDetails)}
          </p>
        </div>

        {/* Investment Health Scorecard */}
        {(() => {
          const { score, checks } = getInvestmentDetails(stockDetails);
          return (
            <div className="card">
              <div className="health-score-header">
                <h3 className="card-title" style={{ margin: 0 }}>
                  <Percent size={18} style={{ color: 'var(--accent-emerald)' }} />
                  <span>Investment Quality</span>
                </h3>
                <span 
                  className="health-badge"
                  style={{ 
                    color: score >= 3 ? 'var(--color-green)' : 'var(--color-red)',
                    backgroundColor: score >= 3 ? 'var(--color-green-bg)' : 'var(--color-red-bg)',
                    border: `1px solid ${score >= 3 ? 'var(--color-green-border)' : 'var(--color-red-border)'}`
                  }}
                >
                  Score: {score}/5
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {checks.map((c, idx) => (
                  <div 
                    key={idx} 
                    className="health-check-item"
                    style={{ 
                      borderBottom: idx < checks.length - 1 ? '1px solid var(--card-border)' : 'none',
                      paddingBottom: idx < checks.length - 1 ? '8px' : '0'
                    }}
                  >
                    <span style={{ 
                      color: c.passed ? 'var(--color-green)' : 'var(--color-red)',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      minWidth: '14px'
                    }}>
                      {c.passed ? '✓' : '✗'}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: c.passed ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {c.label}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        {c.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Valuation Quick Ratios */}
        {(() => {
          const epsTtmVal = calculateTTM('EPS', stockDetails.financials, stockDetails.quarterly);
          const peTtmVal = (epsTtmVal && epsTtmVal > 0) ? stockDetails.price / epsTtmVal : null;
          return (
            <div className="card">
              <h3 className="card-title">
                <PieChart size={18} style={{ color: 'var(--accent-purple)' }} />
                <span>Key Market Metrics</span>
              </h3>
              <div className="metrics-list">
                <div className="metric-row">
                  <span className="metric-row-label">Market Capitalization</span>
                  <span className="metric-row-val">Rs. {stockDetails.marketCap} K</span>
                </div>
                <div className="metric-row">
                  <span className="metric-row-label">Outstanding Shares</span>
                  <span className="metric-row-val">{parseInt(stockDetails.sharesOutstanding?.replace(/,/g, '') || '0').toLocaleString()}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-row-label">PE Ratio (TTM)</span>
                  <span className="metric-row-val" style={{ color: 'var(--accent-purple)' }}>{peTtmVal ? peTtmVal.toFixed(2) : 'N/A'}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-row-label">EPS (TTM)</span>
                  <span className="metric-row-val" style={{ color: 'var(--accent-emerald)' }}>{epsTtmVal ? 'Rs. ' + epsTtmVal.toFixed(2) : 'N/A'}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-row-label">Free Float Shares</span>
                  <span className="metric-row-val">{parseInt(stockDetails.freeFloatShares?.replace(/,/g, '') || '0').toLocaleString()}</span>
                </div>
                <div className="metric-row" style={{ borderBottom: 'none' }}>
                  <span className="metric-row-label">Free Float Ratio</span>
                  <span className="metric-row-val" style={{ color: 'var(--accent-emerald)' }}>{stockDetails.freeFloatPercent}</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
