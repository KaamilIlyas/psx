import { parseFinancialValue } from './financials';

export const getPriceColor = (change) => {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'neutral';
};

export const formatTime = (dateStr) => {
  try {
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) {
      const mins = Math.floor(diffMs / (1000 * 60));
      return `${mins}m ago`;
    }
    if (diffHrs < 24) {
      return `${diffHrs}h ago`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

// Dynamic Investment Checklist & Rating Scorer
export const getInvestmentDetails = (details) => {
  let score = 0;
  const checks = [
    { id: 'eps', label: 'Consistent Profitability', description: 'Checking annual earnings...', passed: false },
    { id: 'growth', label: 'Earnings Growth Trend', description: 'Checking EPS growth...', passed: false },
    { id: 'float', label: 'Liquidity Margin', description: 'Checking float...', passed: false },
    { id: 'valuation', label: 'Valuation Safety', description: 'Checking valuation...', passed: false },
    { id: 'dividends', label: 'Active Income Yield', description: 'Checking dividends...', passed: false }
  ];

  if (!details || !details.financials || !details.ratios) return { score: 0, checks };

  // 1. EPS check
  const epsRow = details.financials.find(f => f.metric === 'EPS');
  if (epsRow && epsRow.values) {
    const vals = Object.entries(epsRow.values).map(([year, v]) => ({ year, val: parseFinancialValue(v) }));
    const allPositive = vals.length > 0 && vals.every(v => v.val > 0);
    const valuesStr = vals.map(v => `${v.year}: ${v.val >= 0 ? 'Rs. ' + v.val : '(' + Math.abs(v.val) + ')'}`).join(', ');
    if (vals.length > 0 && allPositive) {
      checks[0].passed = true;
      checks[0].description = `Positive EPS in all recorded years (${valuesStr}).`;
      score++;
    } else {
      checks[0].description = `Negative or zero EPS encountered. Values: ${valuesStr}.`;
    }
  } else {
    checks[0].description = 'No annual EPS history available to verify.';
  }

  // 2. Growth check
  if (epsRow && epsRow.values) {
    const years = Object.keys(epsRow.values).sort();
    if (years.length >= 2) {
      const latestYear = years[years.length - 1];
      const prevYear = years[years.length - 2];
      const latestVal = parseFinancialValue(epsRow.values[latestYear]);
      const prevVal = parseFinancialValue(epsRow.values[prevYear]);
      if (latestVal > prevVal) {
        checks[1].passed = true;
        checks[1].description = `Growth: Latest EPS (Rs. ${latestVal} in ${latestYear}) > prev year (Rs. ${prevVal} in ${prevYear}).`;
        score++;
      } else {
        checks[1].description = `Decline: Latest EPS (Rs. ${latestVal} in ${latestYear}) <= prev year (Rs. ${prevVal} in ${prevYear}).`;
      }
    } else {
      checks[1].description = 'Insufficient EPS history (requires at least 2 years).';
    }
  } else {
    checks[1].description = 'No EPS data available to compute growth trend.';
  }

  // 3. Free float check
  const ffPct = parseFinancialValue(details.freeFloatPercent);
  if (!isNaN(ffPct) && ffPct >= 20.0) {
    checks[2].passed = true;
    checks[2].description = `Healthy float of ${ffPct}% (above 20% institutional baseline).`;
    score++;
  } else {
    checks[2].description = `Tight liquidity: Free float is ${details.freeFloatPercent || 'N/A'} (below 20%).`;
  }

  // 4. Valuation / PEG check
  const pegRow = details.ratios.find(r => r.metric === 'PEG');
  if (pegRow && pegRow.values) {
    const years = Object.keys(pegRow.values).sort();
    if (years.length > 0) {
      const latestYear = years[years.length - 1];
      const latestPeg = parseFinancialValue(pegRow.values[latestYear]);
      if (latestPeg > 0 && latestPeg < 1.5) {
        checks[3].passed = true;
        checks[3].description = `Safe Valuation: PEG ratio is ${latestPeg} in ${latestYear} (under 1.5).`;
        score++;
      } else if (latestPeg <= 0) {
        checks[3].description = `Negative PEG (${latestPeg} in ${latestYear}) due to negative EPS growth.`;
      } else {
        checks[3].description = `Premium valuation: PEG is ${latestPeg} in ${latestYear} (above 1.5).`;
      }
    } else {
      checks[3].description = 'No PEG metrics found.';
    }
  } else {
    checks[3].description = 'No PEG valuation data available.';
  }

  // 5. Dividend check
  const divAnnouncements = (details.announcements || []).filter(a => 
    a.title.toLowerCase().includes('dividend') || 
    a.title.toLowerCase().includes('payout') ||
    a.title.toLowerCase().includes('book closure')
  );
  if (divAnnouncements.length > 0) {
    checks[4].passed = true;
    checks[4].description = `Active yield program: found ${divAnnouncements.length} dividend/closure filings.`;
    score++;
  } else {
    checks[4].description = 'No recent dividend or book closure announcements detected.';
  }

  return { score, checks };
};

// Dynamic Analyst Summary Text Generator
export const getAnalystSummary = (details) => {
  if (!details) return '';
  const name = details.companyName;
  const symbol = details.symbol;
  const sector = details.sector;
  const ff = details.freeFloatPercent;
  
  let pegText = '';
  if (details.ratios) {
    const pegRow = details.ratios.find(r => r.metric === 'PEG');
    if (pegRow && pegRow.values) {
      const years = Object.keys(pegRow.values).sort();
      if (years.length > 0) {
        const val = pegRow.values[years[years.length - 1]];
        pegText = ` The asset PEG ratio of ${val} suggests aligning valuation thresholds.`;
      }
    }
  }

  let growthText = 'stable profile';
  if (details.financials) {
    const epsRow = details.financials.find(f => f.metric === 'EPS');
    if (epsRow && epsRow.values) {
      const years = Object.keys(epsRow.values).sort();
      if (years.length >= 2) {
        const latest = parseFloat(epsRow.values[years[years.length - 1]]);
        if (!isNaN(latest)) {
          growthText = `active annual growth (latest EPS at Rs. ${latest})`;
        }
      }
    }
  }

  return `${name} (${symbol}) demonstrates a robust long-term profile in the ${sector} sector. With a free float of ${ff} indicating adequate liquidity and ${growthText}, this asset displays defensive compounding qualities.${pegText} Investors should monitor upcoming board closures and earnings reports to verify yield targets.`;
};
