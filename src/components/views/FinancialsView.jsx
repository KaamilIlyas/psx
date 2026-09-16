import React from 'react';
import { PieChart, Percent } from 'lucide-react';
import { 
  calculateTTM, 
  getYearEndPrice, 
  formatFinancialValue, 
  getFinancialStyle, 
  parseFinancialValue 
} from '../../utils/financials';

export default function FinancialsView({ stockDetails }) {
  if (!stockDetails) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Annual Income Statement Summary */}
      {(() => {
        const years = Object.keys(stockDetails.financials?.[0]?.values || {}).sort((a, b) => b - a);
        const ttmValues = {};
        (stockDetails.financials || []).forEach(row => {
          ttmValues[row.metric] = calculateTTM(row.metric, stockDetails.financials, stockDetails.quarterly);
        });

        return (
          <div className="card">
            <h3 className="card-title">
              <PieChart size={18} style={{ color: 'var(--accent-emerald)' }} />
              <span>Annual Financial Performance</span>
            </h3>
            {(!stockDetails.financials || stockDetails.financials.length === 0) ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                No annual financials reported in this view.
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="financial-table">
                  <thead>
                    <tr>
                      <th className="sticky-col">Metric</th>
                      <th>TTM</th>
                      {years.map(year => (
                        <th key={year}>{year}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stockDetails.financials.map((row, idx) => {
                      const ttmVal = ttmValues[row.metric];
                      return (
                        <tr key={idx}>
                          <td className="sticky-col">{row.metric}</td>
                          <td style={getFinancialStyle(ttmVal)}>
                            {formatFinancialValue(row.metric, ttmVal)}
                          </td>
                          {years.map(year => {
                            const val = row.values[year];
                            const parsed = parseFinancialValue(val);
                            return (
                              <td key={year} style={getFinancialStyle(parsed)}>
                                {val || 'N/A'}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })()}

      {/* Financial Evaluation Ratios */}
      {(() => {
        const years = Object.keys(stockDetails.ratios?.[0]?.values || {}).sort((a, b) => b - a);
        const latestYear = parseInt(years[0]) || 2025;

        const ttmValues = {};
        
        const profitTtm = calculateTTM('Profit after Taxation', stockDetails.financials, stockDetails.quarterly);
        const revenueMetric = stockDetails.financials?.find(f => f.metric === 'Sales' || f.metric === 'Total Income' || f.metric === 'Mark-up Earned')?.metric;
        const revenueTtm = revenueMetric ? calculateTTM(revenueMetric, stockDetails.financials, stockDetails.quarterly) : null;
        
        ttmValues['Net Profit Margin (%)'] = (profitTtm && revenueTtm) ? (profitTtm / revenueTtm) * 100 : null;
        
        const epsTtm = calculateTTM('EPS', stockDetails.financials, stockDetails.quarterly);
        const peTtm = (epsTtm && epsTtm > 0) ? stockDetails.price / epsTtm : null;
        ttmValues['PE Ratio'] = peTtm;
        
        const epsRow = stockDetails.financials?.find(f => f.metric === 'EPS');
        const prevYearEpsVal = epsRow ? epsRow.values[(latestYear - 1).toString()] : null;
        const prevYearEps = prevYearEpsVal ? parseFinancialValue(prevYearEpsVal) : null;
        const epsGrowthTtm = (epsTtm && prevYearEps) ? ((epsTtm - prevYearEps) / prevYearEps) * 100 : null;
        ttmValues['EPS Growth (%)'] = epsGrowthTtm;
        
        ttmValues['PEG'] = (peTtm && epsGrowthTtm && epsGrowthTtm > 0) ? peTtm / epsGrowthTtm : null;

        const gmRow = stockDetails.ratios?.find(r => r.metric === 'Gross Profit Margin (%)');
        if (gmRow) {
          ttmValues['Gross Profit Margin (%)'] = null; 
        }

        const ratioMetrics = ['PE Ratio', 'PEG', 'Net Profit Margin (%)', 'Gross Profit Margin (%)', 'EPS Growth (%)'];
        const availableRatios = ratioMetrics.filter(m => 
          m === 'PE Ratio' || (stockDetails.ratios && stockDetails.ratios.some(r => r.metric === m))
        );

        return (
          <div className="card">
            <h3 className="card-title">
              <Percent size={18} style={{ color: 'var(--accent-purple)' }} />
              <span>Financial Valuation Ratios</span>
            </h3>
            {(!stockDetails.ratios || stockDetails.ratios.length === 0) ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                No valuation metrics computed for this asset.
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="financial-table">
                  <thead>
                    <tr>
                      <th className="sticky-col">Metric</th>
                      <th>TTM</th>
                      {years.map(year => (
                        <th key={year}>{year}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {availableRatios.map((metric, idx) => {
                      const ttmVal = ttmValues[metric];
                      const scrapedRow = stockDetails.ratios?.find(r => r.metric === metric);
                      
                      return (
                        <tr key={idx}>
                          <td className="sticky-col">{metric}</td>
                          <td style={getFinancialStyle(ttmVal)}>
                            {formatFinancialValue(metric, ttmVal)}
                          </td>
                          {years.map(year => {
                            let val = 'N/A';
                            if (metric === 'PE Ratio') {
                              const yearEndPrice = getYearEndPrice(parseInt(year), stockDetails.priceHistory);
                              const yearEpsRow = stockDetails.financials?.find(f => f.metric === 'EPS');
                              const yearEps = yearEpsRow ? parseFinancialValue(yearEpsRow.values[year]) : null;
                              const yearPe = (yearEndPrice && yearEps && yearEps > 0) ? yearEndPrice / yearEps : null;
                              val = yearPe !== null ? yearPe.toFixed(2) : 'N/A';
                            } else if (scrapedRow && scrapedRow.values?.[year] !== undefined) {
                              val = scrapedRow.values[year];
                            }
                            const parsedVal = parseFinancialValue(val);
                            return (
                              <td key={year} style={getFinancialStyle(parsedVal)}>
                                {val}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
