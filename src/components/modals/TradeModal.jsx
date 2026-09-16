import React from 'react';
import { Plus, Edit3, ArrowDownRight, Receipt, X } from 'lucide-react';

export default function TradeModal({
  modalConfig,
  setModalConfig,
  formData,
  setFormData,
  handleModalSubmit
}) {
  if (!modalConfig.type) return null;

  return (
    <div className="modal-overlay" onClick={() => setModalConfig({ type: null, data: null })}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {modalConfig.type === 'buy' && <><Plus size={18} style={{ color: 'var(--accent-emerald)' }} /> Record Stock Purchase</>}
            {modalConfig.type === 'edit_lot' && <><Edit3 size={18} style={{ color: 'var(--accent-emerald)' }} /> Edit Purchase Lot ({modalConfig.data?.symbol})</>}
            {modalConfig.type === 'sell' && <><ArrowDownRight size={18} style={{ color: 'var(--accent-blue)' }} /> Record Stock Sell</>}
            {modalConfig.type === 'edit_sell' && <><Edit3 size={18} style={{ color: 'var(--accent-blue)' }} /> Edit Sell Record ({modalConfig.data?.symbol})</>}
            {modalConfig.type === 'dividend' && <><Receipt size={18} style={{ color: 'var(--accent-amber)' }} /> Log Dividend Payout</>}
            {modalConfig.type === 'edit_dividend' && <><Edit3 size={18} style={{ color: 'var(--accent-amber)' }} /> Edit Dividend Payout ({modalConfig.data?.symbol})</>}
          </h3>
          <button 
            className="btn-modal-close"
            onClick={() => setModalConfig({ type: null, data: null })}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleModalSubmit}>
          <div className="modal-body">
            {/* Stock Symbol */}
            <div className="form-group">
              <label className="form-label">Stock Symbol (Ticker)</label>
              <input 
                type="text"
                required
                placeholder="e.g. FFC, MEBL, HUBC"
                className="form-input"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
              />
            </div>

            {/* Shares */}
            <div className="form-group">
              <label className="form-label">
                {modalConfig.type === 'dividend' || modalConfig.type === 'edit_dividend' 
                  ? 'Shares Entitled on Book Closure' 
                  : 'Number of Shares'}
              </label>
              <input 
                type="number"
                step="any"
                required
                min="1"
                placeholder="e.g. 50"
                className="form-input"
                value={formData.shares}
                onWheel={(e) => e.target.blur()}
                onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
              />
            </div>

            {/* Buy Price */}
            {(modalConfig.type === 'buy' || modalConfig.type === 'edit_lot') && (
              <div className="form-group">
                <label className="form-label">Buy Price per Share for this Lot (Rs.)</label>
                <input 
                  type="number"
                  step="any"
                  required
                  min="0.01"
                  placeholder="e.g. 500.00"
                  className="form-input"
                  value={formData.price}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            )}

            {/* Sell Inputs */}
            {(modalConfig.type === 'sell' || modalConfig.type === 'edit_sell') && (
              <>
                <div className="form-group">
                  <label className="form-label">Sell Price per Share (Rs.)</label>
                  <input 
                    type="number"
                    step="any"
                    required
                    min="0.01"
                    placeholder="e.g. 520.00"
                    className="form-input"
                    value={formData.price}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cost Basis / Buy Price per Share (Rs.)</label>
                  <input 
                    type="number"
                    step="any"
                    required
                    min="0.01"
                    placeholder="e.g. 450.00"
                    className="form-input"
                    value={formData.buyPrice}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                  />
                </div>
                {modalConfig.type === 'sell' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <input 
                      type="checkbox" 
                      id="reduceHolding"
                      checked={formData.reduceHolding}
                      onChange={(e) => setFormData({ ...formData, reduceHolding: e.target.checked })}
                    />
                    <label htmlFor="reduceHolding" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      Deduct shares from my active purchase lots (FIFO)
                    </label>
                  </div>
                )}
              </>
            )}

            {/* Dividend Inputs */}
            {(modalConfig.type === 'dividend' || modalConfig.type === 'edit_dividend') && (
              <>
                <div className="form-group">
                  <label className="form-label">Dividend per Share - DPS (Rs.)</label>
                  <input 
                    type="number"
                    step="any"
                    required
                    min="0.01"
                    placeholder="e.g. 15.50"
                    className="form-input"
                    value={formData.dps}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setFormData({ ...formData, dps: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tax Withholding Rate (%)</label>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                    <button 
                      type="button" 
                      className="timeframe-btn" 
                      style={{ flex: 1, backgroundColor: formData.taxRate === '15' ? 'var(--accent-emerald)' : undefined, color: formData.taxRate === '15' ? '#11231f' : undefined }}
                      onClick={() => setFormData({ ...formData, taxRate: '15' })}
                    >
                      15% (Filer)
                    </button>
                    <button 
                      type="button" 
                      className="timeframe-btn" 
                      style={{ flex: 1, backgroundColor: formData.taxRate === '30' ? 'var(--accent-emerald)' : undefined, color: formData.taxRate === '30' ? '#11231f' : undefined }}
                      onClick={() => setFormData({ ...formData, taxRate: '30' })}
                    >
                      30% (Non-Filer)
                    </button>
                    <button 
                      type="button" 
                      className="timeframe-btn" 
                      style={{ flex: 1, backgroundColor: formData.taxRate === '0' ? 'var(--accent-emerald)' : undefined, color: formData.taxRate === '0' ? '#11231f' : undefined }}
                      onClick={() => setFormData({ ...formData, taxRate: '0' })}
                    >
                      0% (Exempt)
                    </button>
                  </div>
                  <input 
                    type="number"
                    step="any"
                    required
                    min="0"
                    max="100"
                    placeholder="Tax rate %"
                    className="form-input"
                    value={formData.taxRate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* Date */}
            <div className="form-group">
              <label className="form-label">Transaction / Purchase Date</label>
              <input 
                type="date"
                required
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            {/* Live calculation summary */}
            <div className="form-calc-preview">
              {(modalConfig.type === 'buy' || modalConfig.type === 'edit_lot') && (
                <div className="form-calc-row total">
                  <span>Total Lot Cost:</span>
                  <span>Rs. {((parseFloat(formData.shares) || 0) * (parseFloat(formData.price) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}

              {(modalConfig.type === 'sell' || modalConfig.type === 'edit_sell') && (() => {
                const shares = parseFloat(formData.shares) || 0;
                const sellP = parseFloat(formData.price) || 0;
                const buyP = parseFloat(formData.buyPrice) || 0;
                const proceeds = shares * sellP;
                const cost = shares * buyP;
                const pnl = proceeds - cost;
                return (
                  <>
                    <div className="form-calc-row">
                      <span>Sale Proceeds:</span>
                      <span>Rs. {proceeds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="form-calc-row">
                      <span>Cost Basis:</span>
                      <span>Rs. {cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="form-calc-row total" style={{ color: pnl >= 0 ? 'var(--color-green)' : 'var(--color-red)' }}>
                      <span>Realized Profit/Loss:</span>
                      <span>{pnl >= 0 ? '+' : ''}Rs. {pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </>
                );
              })()}

              {(modalConfig.type === 'dividend' || modalConfig.type === 'edit_dividend') && (() => {
                const shares = parseFloat(formData.shares) || 0;
                const dps = parseFloat(formData.dps) || 0;
                const tax = parseFloat(formData.taxRate) || 0;
                const gross = shares * dps;
                const taxAmt = gross * (tax / 100);
                const net = gross - taxAmt;
                return (
                  <>
                    <div className="form-calc-row">
                      <span>Gross Dividend:</span>
                      <span>Rs. {gross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="form-calc-row" style={{ color: 'var(--color-red)' }}>
                      <span>Withholding Tax ({tax}%):</span>
                      <span>-Rs. {taxAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="form-calc-row total" style={{ color: 'var(--color-green)' }}>
                      <span>Net Dividend Received:</span>
                      <span>Rs. {net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-modal-cancel"
              onClick={() => setModalConfig({ type: null, data: null })}
            >
              Cancel
            </button>
            <button type="submit" className="btn-modal-submit">
              {modalConfig.type === 'buy' && (formData.buyMode === 'overwrite' ? 'Update Position' : 'Record Purchase Lot')}
              {modalConfig.type === 'edit_lot' && 'Save Lot Changes'}
              {modalConfig.type === 'sell' && 'Record Sell Order'}
              {modalConfig.type === 'edit_sell' && 'Save Sell Changes'}
              {modalConfig.type === 'dividend' && 'Log Dividend'}
              {modalConfig.type === 'edit_dividend' && 'Save Dividend Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
