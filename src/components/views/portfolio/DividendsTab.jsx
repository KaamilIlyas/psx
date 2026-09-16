import React from 'react';
import { Receipt, ChevronDown, Plus, Trash2, Edit3 } from 'lucide-react';

export default function DividendsTab({
  isMobile = false,
  consolidatedDividends,
  expandedDividends,
  toggleDividendExpansion,
  openDividendModal,
  handleDeleteDividend,
  handleDeleteEntireDividendStock
}) {
  if (isMobile) {
    return (
      <div className="investify-holdings-list">
        {consolidatedDividends.length === 0 ? (
          <div className="investify-empty-box">
            <Receipt size={36} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
            <p>No dividend payouts logged yet.</p>
            <button className="btn-portfolio-action secondary" onClick={() => openDividendModal()}>
              <Receipt size={14} /> Log Dividend Payout
            </button>
          </div>
        ) : (
          consolidatedDividends.map((cd) => {
            const isExpanded = !!expandedDividends[cd.symbol];

            return (
              <div key={cd.symbol} className="investify-card">
                <div 
                  className="investify-card-main"
                  onClick={() => toggleDividendExpansion(cd.symbol)}
                >
                  {/* Left Column: Symbol & Date */}
                  <div className="investify-card-col-left">
                    <span className="investify-symbol-title">{cd.symbol}</span>
                    <span className="investify-meta-lbl">LATEST</span>
                    <span className="investify-meta-val bold">{cd.latestPayoutDate}</span>
                  </div>

                  {/* Middle Column: Gross & Tax */}
                  <div className="investify-card-col-mid">
                    <div className="investify-metric-pair">
                      <span className="investify-meta-lbl">TOTAL GROSS</span>
                      <span className="investify-meta-val">{cd.totalGross.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="investify-metric-pair">
                      <span className="investify-meta-lbl">TAX DEDUCTED</span>
                      <span className="investify-meta-val neg-text">-{cd.totalTax.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="investify-metric-pair">
                      <span className="investify-meta-lbl">PAYOUTS</span>
                      <span className="investify-meta-val bold">
                        {cd.payouts.length} tranche{cd.payouts.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Net Received & Tax % */}
                  <div className="investify-card-col-right">
                    <div className="investify-metric-pair right">
                      <span className="investify-meta-lbl">NET RECEIVED</span>
                      <span className="investify-meta-val-cyan">
                        <span className="rs-prefix">Rs. </span>
                        {cd.totalNet.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="investify-metric-pair right">
                      <span className="investify-meta-lbl">AVG TAX</span>
                      <span className="investify-meta-val bold">
                        {cd.effectiveTaxRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons Column */}
                  <div className="investify-card-col-actions" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="investify-icon-btn buy"
                      title="Add new dividend payout"
                      onClick={() => openDividendModal(null, cd.symbol)}
                    >
                      <Plus size={14} />
                      <span className="btn-sub-lbl">ADD</span>
                    </button>
                    <button 
                      className="investify-icon-btn del"
                      title={`Delete all dividend payouts for ${cd.symbol}`}
                      onClick={() => handleDeleteEntireDividendStock(cd.symbol)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Accordion Expandable Discrete Dividend Payouts */}
                {isExpanded && (
                  <div className="investify-lot-accordion">
                    <div className="investify-lot-accordion-top">
                      <span className="investify-lot-accordion-title">
                        Dividend Tranches ({cd.payouts.length} Payouts)
                      </span>
                      <button 
                        className="investify-btn-add-lot"
                        onClick={() => openDividendModal(null, cd.symbol)}
                      >
                        <Plus size={12} /> Add Payout
                      </button>
                    </div>

                    <div className="investify-lot-stack">
                      {cd.payouts.map((p, idx) => (
                        <div key={p.id} className="investify-lot-row-card">
                          <div className="investify-lot-row-info">
                            <div className="investify-lot-tag-row">
                              <span className="lot-num-pill">Payout #{idx + 1}</span>
                              <span className="lot-date-txt">{p.date || 'N/A'}</span>
                            </div>
                          </div>

                          <div className="investify-lot-row-metrics">
                            <div className="lot-stat-item">
                              <span className="lot-stat-lbl">Shares</span>
                              <span className="lot-stat-val bold">{p.shares.toLocaleString()}</span>
                            </div>
                            <div className="lot-stat-item">
                              <span className="lot-stat-lbl">DPS</span>
                              <span className="lot-stat-val">Rs. {p.dps.toFixed(2)}</span>
                            </div>
                            <div className="lot-stat-item">
                              <span className="lot-stat-lbl">Tax ({p.taxRate}%)</span>
                              <span className="lot-stat-val neg-text">-Rs. {p.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className="lot-stat-item">
                              <span className="lot-stat-lbl">Net Payout</span>
                              <span className="lot-stat-val bold-cyan">
                                Rs. {p.net.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </span>
                            </div>
                          </div>

                          <div className="investify-lot-row-btns">
                            <button 
                              className="investify-btn-sm" 
                              title="Edit Dividend"
                              onClick={() => openDividendModal(p)}
                            >
                              <Edit3 size={13} />
                            </button>
                            <button 
                              className="investify-btn-sm del" 
                              title="Delete Dividend"
                              onClick={() => handleDeleteDividend(p.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    );
  }

  // DESKTOP VIEW
  return (
    <div className="desktop-table-card card">
      {consolidatedDividends.length === 0 ? (
        <div className="investify-empty-box">
          <Receipt size={40} style={{ color: 'var(--text-muted)', marginBottom: '10px' }} />
          <h3>No Dividend Payouts Logged</h3>
          <p>Record your corporate dividend payouts to track cash income and tax withholding.</p>
          <button className="btn-portfolio-action secondary" onClick={() => openDividendModal()}>
            <Receipt size={15} /> Log Dividend Payout
          </button>
        </div>
      ) : (
        <div className="desktop-table-wrapper">
          <table className="desktop-portfolio-table">
            <colgroup>
              <col style={{ width: '16%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '8%' }} />
            </colgroup>
            <thead>
              <tr>
                <th className="text-left">Stock Ticker</th>
                <th className="text-left">Latest Payout</th>
                <th className="text-right">Entitled Shares</th>
                <th className="text-right">Gross Dividend</th>
                <th className="text-right">Avg Tax Rate</th>
                <th className="text-right">Tax Withheld</th>
                <th className="text-right">Net Received</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {consolidatedDividends.map((cd) => {
                const isExpanded = !!expandedDividends[cd.symbol];

                return (
                  <React.Fragment key={cd.symbol}>
                    <tr 
                      className={`desktop-holding-row ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => toggleDividendExpansion(cd.symbol)}
                      title="Click to view all dividend payouts for this company"
                    >
                      <td>
                        <div className="desktop-tbl-ticker-cell">
                          <button 
                            className="desktop-btn-toggle-lots"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDividendExpansion(cd.symbol);
                            }}
                            title="View individual dividend tranches"
                          >
                            <ChevronDown size={14} className={isExpanded ? 'rotated' : ''} />
                          </button>
                          <div className="desktop-tbl-sym-info">
                            <span className="desktop-tbl-sym">{cd.symbol}</span>
                            <span className="desktop-tbl-lots-badge">{cd.payouts.length} payout{cd.payouts.length > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </td>
                      <td>{cd.latestPayoutDate}</td>
                      <td className="text-right bold">{cd.totalSharesEntitled.toLocaleString()}</td>
                      <td className="text-right">Rs. {cd.totalGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="text-right">{cd.effectiveTaxRate.toFixed(1)}%</td>
                      <td className="text-right neg-text">-Rs. {cd.totalTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="text-right bold-cyan">Rs. {cd.totalNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="desktop-tbl-actions center">
                          <button 
                            className="desktop-btn-quick-pill buy"
                            title="Add another dividend payout for this stock"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDividendModal(null, cd.symbol);
                            }}
                          >
                            <Plus size={12} />
                            <span>Add</span>
                          </button>
                          <button 
                            className="desktop-btn-action-icon del" 
                            title={`Delete all dividend records for ${cd.symbol}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEntireDividendStock(cd.symbol);
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Sub-Table for Company's Dividend Payouts */}
                    {isExpanded && (
                      <tr className="desktop-expanded-lots-row">
                        <td colSpan={8}>
                          <div className="desktop-nested-lots-panel">
                            <div className="desktop-nested-lots-header">
                              <span>Dividend Payout Records for <strong>{cd.symbol}</strong> ({cd.payouts.length} discrete payouts)</span>
                              <button 
                                className="desktop-btn-nested-add" 
                                onClick={() => openDividendModal(null, cd.symbol)}
                              >
                                <Plus size={12} /> Add Dividend Payout
                              </button>
                            </div>
                            <table className="desktop-nested-lots-table">
                              <colgroup>
                                <col style={{ width: '11%' }} />
                                <col style={{ width: '13%' }} />
                                <col style={{ width: '11%' }} />
                                <col style={{ width: '12%' }} />
                                <col style={{ width: '13%' }} />
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '12%' }} />
                                <col style={{ width: '12%' }} />
                                <col style={{ width: '6%' }} />
                              </colgroup>
                              <thead>
                                <tr>
                                  <th className="text-left">Payout #</th>
                                  <th className="text-left">Payment Date</th>
                                  <th className="text-right">Shares Entitled</th>
                                  <th className="text-right">DPS (Rs.)</th>
                                  <th className="text-right">Gross Payout</th>
                                  <th className="text-right">Tax Rate</th>
                                  <th className="text-right">Tax Withheld</th>
                                  <th className="text-right">Net Received</th>
                                  <th className="text-center">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {cd.payouts.map((p, idx) => (
                                  <tr key={p.id}>
                                    <td><span className="lot-num-pill">Payout #{idx + 1}</span></td>
                                    <td>{p.date || 'N/A'}</td>
                                    <td className="text-right bold">{p.shares.toLocaleString()}</td>
                                    <td className="text-right">Rs. {p.dps.toFixed(2)}</td>
                                    <td className="text-right">Rs. {p.gross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="text-right">{p.taxRate}%</td>
                                    <td className="text-right neg-text">-Rs. {p.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="text-right bold-cyan">Rs. {p.net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>
                                      <div className="desktop-tbl-actions center">
                                        <button 
                                          className="desktop-btn-action-icon"
                                          title="Edit Dividend Entry"
                                          onClick={() => openDividendModal(p)}
                                        >
                                          <Edit3 size={13} />
                                        </button>
                                        <button 
                                          className="desktop-btn-action-icon del"
                                          title="Delete Dividend Entry"
                                          onClick={() => handleDeleteDividend(p.id)}
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
