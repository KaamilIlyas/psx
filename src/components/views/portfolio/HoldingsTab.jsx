import React from 'react';
import { Wallet, Plus, ChevronDown, Trash2, Edit3, ShoppingBag, ArrowDownRight } from 'lucide-react';

export default function HoldingsTab({
  isMobile = false,
  consolidatedHoldings,
  expandedStocks,
  toggleStockExpansion,
  openBuyModal,
  openSellModal,
  handleDeleteLot,
  handleDeleteEntireStock
}) {
  if (isMobile) {
    return (
      <div className="investify-holdings-list">
        {consolidatedHoldings.length === 0 ? (
          <div className="investify-empty-box">
            <Wallet size={36} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
            <p>No active stock holdings in portfolio yet.</p>
            <button className="btn-portfolio-action primary" onClick={() => openBuyModal()}>
              <Plus size={14} /> Add First Purchase Lot
            </button>
          </div>
        ) : (
          consolidatedHoldings.map((h) => {
            const isExpanded = !!expandedStocks[h.symbol];
            const isPosDay = h.dayPnL >= 0;
            const isPosTotal = h.profitLoss >= 0;

            return (
              <div key={h.symbol} className="investify-card">
                <div 
                  className="investify-card-main"
                  onClick={() => toggleStockExpansion(h.symbol)}
                >
                  {/* Left Column: Symbol & Price */}
                  <div className="investify-card-col-left">
                    <span className="investify-symbol-title">{h.symbol}</span>
                    <span className="investify-meta-lbl">PRICE</span>
                    <span className="investify-meta-val bold">Rs. {h.livePrice.toFixed(2)}</span>
                  </div>

                  {/* Middle Column: Cost Basis */}
                  <div className="investify-card-col-mid">
                    <div className="investify-metric-pair">
                      <span className="investify-meta-lbl">TOTAL COST</span>
                      <span className="investify-meta-val">{h.totalInvested.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="investify-metric-pair">
                      <span className="investify-meta-lbl">AVG BUY</span>
                      <span className="investify-meta-val">{h.weightedAvgBuyPrice.toFixed(2)}</span>
                    </div>
                    <div className="investify-metric-pair">
                      <span className="investify-meta-lbl">SHARES</span>
                      <span className="investify-meta-val bold">
                        {h.totalShares.toLocaleString()}
                        <span className="investify-lot-count-tag">{h.lots.length} lot{h.lots.length > 1 ? 's' : ''}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Market Val & P&L */}
                  <div className="investify-card-col-right">
                    <div className="investify-metric-pair right">
                      <span className="investify-meta-lbl">MARKET VALUE</span>
                      <span className="investify-meta-val-cyan">
                        <span className="rs-prefix">Rs. </span>
                        {h.currentVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="investify-metric-pair right">
                      <span className="investify-meta-lbl">DAY'S P&L</span>
                      <span className={`investify-pnl-text ${isPosDay ? 'pos' : 'neg'}`}>
                        {isPosDay ? '+' : ''}{h.dayPnL.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        <span className="pct-badge">
                          {isPosDay ? '+' : ''}{h.dayPnLPct.toFixed(2)}% {isPosDay ? '▲' : '▼'}
                        </span>
                      </span>
                    </div>
                    <div className="investify-metric-pair right">
                      <span className="investify-meta-lbl">TOTAL P&L</span>
                      <span className={`investify-pnl-text ${isPosTotal ? 'pos' : 'neg'}`}>
                        {isPosTotal ? '+' : ''}{h.profitLoss.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        <span className="pct-badge">
                          {isPosTotal ? '+' : ''}{h.profitLossPct.toFixed(2)}% {isPosTotal ? '▲' : '▼'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Combined Buy & Sell Action Buttons */}
                  <div className="investify-card-col-actions" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="investify-icon-btn buy"
                      title="Add new purchase lot"
                      onClick={() => openBuyModal(null, h.symbol)}
                    >
                      <Plus size={14} />
                      <span className="btn-sub-lbl">BUY</span>
                    </button>
                    <button 
                      className="investify-icon-btn sell"
                      title="Sell shares from position"
                      onClick={() => openSellModal(null, h)}
                    >
                      <ShoppingBag size={14} />
                      <span className="btn-sub-lbl">SELL</span>
                    </button>
                  </div>
                </div>

                {/* Accordion Expandable Discrete Purchase Lots */}
                {isExpanded && (
                  <div className="investify-lot-accordion">
                    <div className="investify-lot-accordion-top">
                      <span className="investify-lot-accordion-title">
                        Purchase Lots Breakdown ({h.lots.length} Tranches)
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="investify-btn-add-lot"
                          onClick={() => openBuyModal(null, h.symbol)}
                        >
                          <Plus size={12} /> Add Lot
                        </button>
                        <button 
                          className="investify-btn-sm del"
                          title={`Delete entire position for ${h.symbol}`}
                          onClick={() => handleDeleteEntireStock(h.symbol)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="investify-lot-stack">
                      {h.lots.map((lot, idx) => {
                        const lotCost = lot.shares * lot.buyPrice;
                        const lotVal = lot.shares * h.livePrice;
                        const lotPnL = lotVal - lotCost;
                        const lotPnLPct = lotCost > 0 ? (lotPnL / lotCost) * 100 : 0;
                        const lotPos = lotPnL >= 0;

                        return (
                          <div key={lot.id} className="investify-lot-row-card">
                            <div className="investify-lot-row-info">
                              <div className="investify-lot-tag-row">
                                <span className="lot-num-pill">Lot #{idx + 1}</span>
                                <span className="lot-date-txt">{lot.date || 'N/A'}</span>
                              </div>
                            </div>

                            <div className="investify-lot-row-metrics">
                              <div className="lot-stat-item">
                                <span className="lot-stat-lbl">Shares</span>
                                <span className="lot-stat-val bold">{lot.shares.toLocaleString()}</span>
                              </div>
                              <div className="lot-stat-item">
                                <span className="lot-stat-lbl">Buy Price</span>
                                <span className="lot-stat-val">Rs. {lot.buyPrice.toFixed(2)}</span>
                              </div>
                              <div className="lot-stat-item">
                                <span className="lot-stat-lbl">Total Cost</span>
                                <span className="lot-stat-val">Rs. {lotCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                              </div>
                              <div className="lot-stat-item">
                                <span className="lot-stat-lbl">Return</span>
                                <span className={`lot-stat-val ${lotPos ? 'pos-text' : 'neg-text'} bold`}>
                                  {lotPos ? '+' : ''}Rs. {lotPnL.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ({lotPos ? '+' : ''}{lotPnLPct.toFixed(2)}%)
                                </span>
                              </div>
                            </div>

                            <div className="investify-lot-row-btns">
                              <button 
                                className="investify-btn-sm" 
                                title="Edit Lot"
                                onClick={() => openBuyModal(lot)}
                              >
                                <Edit3 size={13} />
                              </button>
                              <button 
                                className="investify-btn-sm del" 
                                title="Delete Lot"
                                onClick={() => handleDeleteLot(lot.id)}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
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
      {consolidatedHoldings.length === 0 ? (
        <div className="investify-empty-box">
          <Wallet size={40} style={{ color: 'var(--text-muted)', marginBottom: '10px' }} />
          <h3>Your Portfolio is Empty</h3>
          <p>Start by recording your first purchase transaction or buy lot.</p>
          <button className="btn-portfolio-action primary" onClick={() => openBuyModal()}>
            <Plus size={15} /> Record Stock Purchase
          </button>
        </div>
      ) : (
        <div className="desktop-table-wrapper">
          <table className="desktop-portfolio-table">
            <thead>
              <tr>
                <th>Stock Ticker</th>
                <th className="text-right">Live Price</th>
                <th className="text-right">Total Shares</th>
                <th className="text-right">Avg Buy Price</th>
                <th className="text-right">Cost Basis</th>
                <th className="text-right">Market Value</th>
                <th className="text-right">Day's P&L</th>
                <th className="text-right">Unrealized Return</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {consolidatedHoldings.map((h) => {
                const isExpanded = !!expandedStocks[h.symbol];
                const isPosDay = h.dayPnL >= 0;
                const isPosTotal = h.profitLoss >= 0;

                return (
                  <React.Fragment key={h.symbol}>
                    <tr 
                      className={`desktop-holding-row ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => toggleStockExpansion(h.symbol)}
                      title="Click to view purchase lots breakdown"
                    >
                      <td>
                        <div className="desktop-tbl-ticker-cell">
                          <button 
                            className="desktop-btn-toggle-lots"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStockExpansion(h.symbol);
                            }}
                            title="View individual purchase lots"
                          >
                            <ChevronDown size={14} className={isExpanded ? 'rotated' : ''} />
                          </button>
                          <div className="desktop-tbl-sym-info">
                            <span className="desktop-tbl-sym">{h.symbol}</span>
                            <span className="desktop-tbl-lots-badge">{h.lots.length} lot{h.lots.length > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-right bold">Rs. {h.livePrice.toFixed(2)}</td>
                      <td className="text-right bold">{h.totalShares.toLocaleString()}</td>
                      <td className="text-right">Rs. {h.weightedAvgBuyPrice.toFixed(2)}</td>
                      <td className="text-right">Rs. {h.totalInvested.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                      <td className="text-right bold-cyan">Rs. {h.currentVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                      <td className={`text-right bold ${isPosDay ? 'pos-text' : 'neg-text'}`}>
                        {isPosDay ? '+' : ''}{h.dayPnL.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ({isPosDay ? '+' : ''}{h.dayPnLPct.toFixed(2)}%)
                      </td>
                      <td className={`text-right bold ${isPosTotal ? 'pos-text' : 'neg-text'}`}>
                        {isPosTotal ? '+' : ''}{h.profitLoss.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ({isPosTotal ? '+' : ''}{h.profitLossPct.toFixed(2)}%)
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="desktop-tbl-actions">
                          <button 
                            className="desktop-btn-quick-pill buy" 
                            title="Buy more shares / Add purchase lot"
                            onClick={(e) => {
                              e.stopPropagation();
                              openBuyModal(null, h.symbol);
                            }}
                          >
                            <Plus size={12} />
                            <span>Buy</span>
                          </button>
                          <button 
                            className="desktop-btn-quick-pill sell" 
                            title="Record a sell transaction"
                            onClick={(e) => {
                              e.stopPropagation();
                              openSellModal(null, h);
                            }}
                          >
                            <ArrowDownRight size={12} />
                            <span>Sell</span>
                          </button>
                          <button 
                            className="desktop-btn-action-icon del" 
                            title="Delete entire stock position"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEntireStock(h.symbol);
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Sub-Table for Lots */}
                    {isExpanded && (
                      <tr className="desktop-expanded-lots-row">
                        <td colSpan={9}>
                          <div className="desktop-nested-lots-panel">
                            <div className="desktop-nested-lots-header">
                              <span>Purchase Lots for <strong>{h.symbol}</strong> ({h.lots.length} discrete lots)</span>
                              <button 
                                className="desktop-btn-nested-add" 
                                onClick={() => openBuyModal(null, h.symbol)}
                              >
                                <Plus size={12} /> Add New Purchase Lot
                              </button>
                            </div>
                            <table className="desktop-nested-lots-table">
                              <thead>
                                <tr>
                                  <th className="text-left">Lot #</th>
                                  <th className="text-left">Purchase Date</th>
                                  <th className="text-right">Shares</th>
                                  <th className="text-right">Buy Price</th>
                                  <th className="text-right">Cost Basis</th>
                                  <th className="text-right">Current Value</th>
                                  <th className="text-right">Lot Return</th>
                                  <th className="text-center">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {h.lots.map((lot, idx) => {
                                  const lotCost = lot.shares * lot.buyPrice;
                                  const lotVal = lot.shares * h.livePrice;
                                  const lotPnL = lotVal - lotCost;
                                  const lotPnLPct = lotCost > 0 ? (lotPnL / lotCost) * 100 : 0;
                                  const lotPos = lotPnL >= 0;

                                  return (
                                    <tr key={lot.id}>
                                      <td><span className="lot-num-pill">Lot #{idx + 1}</span></td>
                                      <td>{lot.date || 'N/A'}</td>
                                      <td className="text-right bold">{lot.shares.toLocaleString()}</td>
                                      <td className="text-right">Rs. {lot.buyPrice.toFixed(2)}</td>
                                      <td className="text-right">Rs. {lotCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                      <td className="text-right bold-cyan">Rs. {lotVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                      <td className={`text-right bold ${lotPos ? 'pos-text' : 'neg-text'}`}>
                                        {lotPos ? '+' : ''}{lotPnL.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ({lotPos ? '+' : ''}{lotPnLPct.toFixed(2)}%)
                                      </td>
                                      <td>
                                        <div className="desktop-tbl-actions center">
                                          <button 
                                            className="desktop-btn-action-icon"
                                            title="Edit Lot"
                                            onClick={() => openBuyModal(lot)}
                                          >
                                            <Edit3 size={13} />
                                          </button>
                                          <button 
                                            className="desktop-btn-action-icon del"
                                            title="Delete Lot"
                                            onClick={() => handleDeleteLot(lot.id)}
                                          >
                                            <Trash2 size={13} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
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
