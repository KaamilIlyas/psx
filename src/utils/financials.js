// Helper to parse financial values (including negative parentheses syntax)
export const parseFinancialValue = (valStr) => {
  if (valStr === undefined || valStr === null) return 0;
  let clean = valStr.toString().replace(/,/g, '').trim();
  if (clean.startsWith('(') && clean.endsWith(')')) {
    clean = '-' + clean.substring(1, clean.length - 1);
  }
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
};

// TTM calculator
export const calculateTTM = (metricName, financials, quarterly) => {
  const annualRow = financials?.find(f => f.metric === metricName);
  const quarterlyRow = quarterly?.find(q => q.metric === metricName);
  
  if (!annualRow || !quarterlyRow) return null;
  
  const annualValues = {};
  Object.entries(annualRow.values || {}).forEach(([year, val]) => {
    annualValues[year] = parseFinancialValue(val);
  });
  
  const quarterlyValues = {};
  Object.entries(quarterlyRow.values || {}).forEach(([qtr, val]) => {
    quarterlyValues[qtr] = parseFinancialValue(val);
  });
  
  const qtrKeys = Object.keys(quarterlyRow.values || {});
  if (qtrKeys.length === 0) return null;
  
  const parseQtrKey = (key) => {
    const parts = key.split(' ');
    if (parts.length !== 2) return { year: 0, qtrNum: 0 };
    const qStr = parts[0];
    const yNum = parseInt(parts[1]);
    const qNum = parseInt(qStr.replace('Q', ''));
    return { year: yNum, qtrNum: qNum, key };
  };
  
  const parsedQuarters = qtrKeys.map(parseQtrKey).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.qtrNum - a.qtrNum;
  });
  
  const latestQtr = parsedQuarters[0];
  if (!latestQtr || latestQtr.year === 0) return null;
  
  if (latestQtr.qtrNum === 4) {
    return annualValues[latestQtr.year.toString()] ?? null;
  }
  
  const currentYear = latestQtr.year;
  const prevYear = currentYear - 1;
  
  let ytdCurrent = 0;
  let countCurrent = 0;
  for (let q = 1; q <= latestQtr.qtrNum; q++) {
    const key = `Q${q} ${currentYear}`;
    if (quarterlyValues[key] !== undefined) {
      ytdCurrent += quarterlyValues[key];
      countCurrent++;
    }
  }
  
  let ytdPrev = 0;
  let countPrev = 0;
  for (let q = 1; q <= latestQtr.qtrNum; q++) {
    const key = `Q${q} ${prevYear}`;
    if (quarterlyValues[key] !== undefined) {
      ytdPrev += quarterlyValues[key];
      countPrev++;
    }
  }
  
  const fullYearPrev = annualValues[prevYear.toString()];
  
  if (fullYearPrev !== undefined && countCurrent > 0 && countPrev > 0) {
    return fullYearPrev + ytdCurrent - ytdPrev;
  }
  
  return null;
};

// Year end price lookup
export const getYearEndPrice = (year, priceHistory) => {
  if (!priceHistory || priceHistory.length === 0) return null;
  const yearPoints = priceHistory.filter(h => {
    const d = new Date(h.time * 1000);
    return d.getFullYear() === year;
  });
  if (yearPoints.length === 0) return null;
  return yearPoints[yearPoints.length - 1].close;
};

// Formats financial numbers
export const formatFinancialValue = (metric, val) => {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  if (metric === 'EPS' || metric === 'PEG' || (typeof metric === 'string' && metric.includes('%')) || metric === 'PE Ratio') {
    if (val < 0) {
      return `(${Math.abs(val).toFixed(2)})`;
    }
    return val.toFixed(2);
  }
  
  if (val < 0) {
    return `(${Math.abs(val).toLocaleString()})`;
  }
  return val.toLocaleString();
};

export const getFinancialStyle = (val) => {
  if (val === null || val === undefined) return {};
  const num = typeof val === 'number' ? val : parseFinancialValue(val);
  if (num < 0) {
    return { color: 'var(--color-red)', fontWeight: '600' };
  }
  return {};
};
