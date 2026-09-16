import React from 'react';
import { ArrowDownRight, Edit3, Trash2 } from 'lucide-react';

export default function SellsTab({
  isMobile = false,
  sells,
  calculatedSells,
  openSellModal,
  handleDeleteSell
}) {
  if (isMobile) {
    return (
      <div className="investify-holdings-list">
        {sells.length === 0 ? (
          <div className="investify-empty-box">
            <ArrowDownRight size={36} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
            <p>No realized stock sells logged yet.</p>
            <button className="btn-portfolio-action secondary" onClick={() => openSellModal()}>
              <ArrowDownRight size={14} /> Record Sell Order
            </button>
          </div>
        ) : (
          calculatedSells.map((s) => {
            const isPos = s.realizedPnL >= 0;

            return (
              <div key={s.id} className="investify-flat-card">
                <div className="investify-flat-top">
                  <div className="investify-flat-ticker-grp">
                    <span className="investify-symbol-title">{s.symbol}</span>
                    <span className="investify-sell-badge">SELL</span>
                    <span className="lot-date-txt">{s.date || 'N/A'}</span>
                  </div>
                  <div className="investify-lot-row-btns">
                    <button className="investify-btn-sm" title="Edit Sell" onClick={() => openSellModal(s)}>
                      <Edit3 size={13} />
                    </button>
                    <button className="investify-btn-sm del" title="Delete Sell" onClick={() => handleDeleteSell(s.id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="investify-flat-grid">
                  <div><span className="investify-meta-lbl">SHARES SOLD</span><span className="investify-meta-val bold">{s.shares.toLocaleString()}</span></div>
                  <div><span className="investify-meta-lbl">BUY PRICE</span><span className="investify-meta-val">Rs. {s.buyPrice.toFixed(2)}</span></div>
                  <div><span className="investify-meta-lbl">SELL PRICE</span><span className="investify-meta-val bold">Rs. {s.sellPrice.toFixed(2)}</span></div>
                  <div><span className="investify-meta-lbl">COST BASIS</span><span className="investify-meta-val">Rs. {s.cost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span></div>
                  <div><span className="investify-meta-lbl">PROCEEDS</span><span className="investify-meta-val-cyan bold">Rs. {s.proceeds.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span></div>
                  <div>
                    <span className="investify-meta-lbl">REALIZED RETURN</span>
                    <span className={`investify-meta-val bold ${isPos ? 'pos-text' : 'neg-text'}`}>
                      {isPos ? '+' : ''}Rs. {s.realizedPnL.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ({isPos ? '+' : ''}{s.realizedPnLPct.toFixed(2)}%)
                    </span>
                  </div>
                </div>
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
      {sells.length === 0 ? (
        <div className="investify-empty-box">
          <ArrowDownRight size={40} style={{ color: 'var(--text-muted)', marginBottom: '10px' }} />
          <h3>No Realized Sells Recorded</h3>
          <button className="btn-portfolio-action secondary" onClick={() => openSellModal()}>
            <ArrowDownRight size={15} /> Record Sell Order
          </button>
        </div>
      ) : (
        <div className="desktop-table-wrapper">
          <table className="desktop-portfolio-table">
            <thead>
              <tr>
                <th className="text-left">Symbol</th>
                <th className="text-left">Sell Date</th>
                <th className="text-right">Shares Sold</th>
                <th className="text-right">Buy Price</th>
                <th className="text-right">Sell Price</th>
                <th className="text-right">Total Cost</th>
                <th className="text-right">Sell Proceeds</th>
                <th className="text-right">Realized Return</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {calculatedSells.map((s) => {
                const isPos = s.realizedPnL >= 0;

                return (
                  <tr key={s.id}>
                    <td><span className="desktop-tbl-sym">{s.symbol}</span></td>
                    <td>{s.date || 'N/A'}</td>
                    <td className="text-right bold">{s.shares.toLocaleString()}</td>
                    <td className="text-right">Rs. {s.buyPrice.toFixed(2)}</td>
                    <td className="text-right">Rs. {s.sellPrice.toFixed(2)}</td>
                    <td className="text-right">Rs. {s.cost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                    <td className="text-right bold-cyan">Rs. {s.proceeds.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                    <td className={`text-right bold ${isPos ? 'pos-text' : 'neg-text'}`}>
                      {isPos ? '+' : ''}{s.realizedPnL.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ({isPos ? '+' : ''}{s.realizedPnLPct.toFixed(2)}%)
                    </td>
                    <td>
                      <div className="desktop-tbl-actions center">
                        <button className="desktop-btn-action-icon" title="Edit Sell" onClick={() => openSellModal(s)}>
                          <Edit3 size={13} />
                        </button>
                        <button className="desktop-btn-action-icon del" title="Delete Sell" onClick={() => handleDeleteSell(s.id)}>
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
      )}
    </div>
  );
}
