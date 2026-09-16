import express from 'express';
import cors from 'cors';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

const app = express();
const parser = new Parser();

app.use(cors());
app.use(express.json());

// In-Memory Cache Manager (with TTL)
const cache = {
  store: {},
  get(key) {
    const item = this.store[key];
    if (item && item.expiry > Date.now()) {
      return item.data;
    }
    return null;
  },
  set(key, data, ttlMs) {
    this.store[key] = {
      data,
      expiry: Date.now() + ttlMs
    };
  }
};

// Default mappings for key PSX stocks for optimal search queries
const COMPANY_NAME_MAP = {
  MEBL: 'Meezan Bank',
  FFC: 'Fauji Fertilizer',
  HUBC: 'Hub Power',
  LUCK: 'Lucky Cement',
  MARI: 'Mari Petroleum',
  SYS: 'Systems Limited',
  HINOON: 'Highnoon Laboratories'
};

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Helper to fetch text with custom headers
async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: Status ${res.status}`);
  }
  return res.text();
}

// Helper to fetch JSON with custom headers
async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch JSON ${url}: Status ${res.status}`);
  }
  return res.json();
}

// Helper to extract company name from scraped HTML or fallback to mapping/symbol
function getCompanyName(symbol, html, titleText) {
  if (COMPANY_NAME_MAP[symbol]) return COMPANY_NAME_MAP[symbol];
  
  if (titleText) {
    const match = titleText.match(/Stock quote for\s+(.*?)\s*-\s*Pakistan/i);
    if (match && match[1]) {
      return match[1].replace(/Limited/gi, '').trim();
    }
  }
  
  return symbol;
}

const router = express.Router();

// Route: Get current price, close, and % change for multiple stocks (Sidebar Watchlist)
router.get('/watchlist', async (req, res) => {
  const symbolsQuery = req.query.symbols || 'MEBL,FFC,HUBC,LUCK,MARI,SYS,HINOON';
  const symbols = symbolsQuery.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
  
  const cacheKey = `watchlist:${symbolsQuery}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const results = await Promise.all(symbols.map(async (symbol) => {
      try {
        const [intradayRes, eodRes] = await Promise.all([
          fetchJson(`https://dps.psx.com.pk/timeseries/int/${symbol}`).catch(() => null),
          fetchJson(`https://dps.psx.com.pk/timeseries/eod/${symbol}`).catch(() => null)
        ]);

        let price = 0;
        let change = 0;
        let changePercent = 0;
        let previousClose = 0;

        if (eodRes && eodRes.data && eodRes.data.length > 0) {
          const hasTodayInEod = intradayRes && intradayRes.data && intradayRes.data.length > 0;
          
          if (hasTodayInEod) {
            price = intradayRes.data[0][1];
            const eodDateStr = new Date(eodRes.data[0][0] * 1000).toDateString();
            const intraDateStr = new Date(intradayRes.data[0][0] * 1000).toDateString();
            
            if (eodDateStr === intraDateStr && eodRes.data.length > 1) {
              previousClose = eodRes.data[1][1];
            } else {
              previousClose = eodRes.data[0][1];
            }
          } else {
            price = eodRes.data[0][1];
            previousClose = eodRes.data.length > 1 ? eodRes.data[1][1] : price;
          }
        }

        if (previousClose > 0) {
          change = price - previousClose;
          changePercent = (change / previousClose) * 100;
        }

        const name = COMPANY_NAME_MAP[symbol] || symbol;

        return {
          symbol,
          name,
          price: parseFloat(price.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2))
        };
      } catch (err) {
        console.error(`Error loading watchlist data for ${symbol}:`, err.message);
        return {
          symbol,
          name: COMPANY_NAME_MAP[symbol] || symbol,
          price: 0,
          change: 0,
          changePercent: 0,
          error: true
        };
      }
    }));

    cache.set(cacheKey, results, 30 * 1000);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Get detailed information for a single stock (Scrapes details + EOD + Intraday)
router.get('/stock/:symbol', async (req, res) => {
  const symbol = req.params.symbol.trim().toUpperCase();
  
  const cacheKey = `stock:${symbol}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const companyUrl = `https://dps.psx.com.pk/company/${symbol}`;
    const eodUrl = `https://dps.psx.com.pk/timeseries/eod/${symbol}`;
    const intradayUrl = `https://dps.psx.com.pk/timeseries/int/${symbol}`;

    const [html, eodRes, intradayRes] = await Promise.all([
      fetchText(companyUrl),
      fetchJson(eodUrl).catch(() => ({ data: [] })),
      fetchJson(intradayUrl).catch(() => ({ data: [] }))
    ]);

    const $ = cheerio.load(html);
    const titleText = $('title').text().trim();
    const companyName = getCompanyName(symbol, html, titleText);

    // Metadata & sector
    let sector = 'Equities / Other';
    const defaultSectors = {
      MEBL: 'Commercial Banks',
      FFC: 'Fertilizer',
      HUBC: 'Power Generation & Distribution',
      LUCK: 'Cement',
      MARI: 'Oil & Gas Exploration',
      SYS: 'Technology & Communication',
      HINOON: 'Pharmaceuticals'
    };
    if (defaultSectors[symbol]) {
      sector = defaultSectors[symbol];
    } else {
      const sectorMeta = $('meta[name="keywords"]').attr('content') || '';
      if (sectorMeta) sector = 'Equities / Other';
    }

    // Key Stats
    let marketCap = 'N/A';
    let sharesOutstanding = 'N/A';
    let freeFloatShares = 'N/A';
    let freeFloatPercent = 'N/A';

    $('.stats_item').each((i, el) => {
      const label = $(el).find('.stats_label').text().trim();
      const value = $(el).find('.stats_value').text().trim();
      
      if (label.includes('Market Cap')) {
        marketCap = value;
      } else if (label === 'Shares') {
        sharesOutstanding = value;
      } else if (label === 'Free Float' && !value.includes('%')) {
        freeFloatShares = value;
      } else if (label === 'Free Float' && value.includes('%')) {
        freeFloatPercent = value;
      }
    });

    // Leadership / Management
    const management = [];
    $('table').first().find('tr').each((i, tr) => {
      const text = $(tr).text().replace(/\s+/g, ' ').trim();
      if (text) {
        const roles = ['CEO', 'Chairperson', 'Company Secretary', 'Director', 'Auditor'];
        for (const role of roles) {
          if (text.endsWith(role)) {
            management.push({
              name: text.substring(0, text.length - role.length).trim(),
              role: role
            });
            break;
          }
        }
      }
    });

    // Regulatory Announcements / PUCARS
    const announcements = [];
    $('table').each((tableIndex, table) => {
      const headerText = $(table).find('tr').first().text().replace(/\s+/g, ' ').trim();
      if (headerText.includes('Date') && headerText.includes('Title') && headerText.includes('Document')) {
        $(table).find('tr').slice(1).each((trIndex, tr) => {
          const cells = $(tr).find('td');
          if (cells.length >= 2) {
            const date = $(cells[0]).text().trim();
            const title = $(cells[1]).text().trim();
            const viewLink = $(cells[2] || cells[1]).find('a').last();
            let href = viewLink.attr('href') || '';
            if (href.startsWith('/')) {
              href = `https://dps.psx.com.pk${href}`;
            }

            announcements.push({
              date,
              title,
              link: href,
              type: tableIndex === 1 ? 'Financial Results' : tableIndex === 2 ? 'Board Meetings' : 'Corporate Actions'
            });
          }
        });
      }
    });

    // Financial Statements & Ratios
    const financials = [];
    const ratios = [];

    // Table 5 (Annual Financials)
    const annualTable = $('table').eq(4);
    if (annualTable.length > 0) {
      const years = [];
      annualTable.find('tr').first().find('td, th').each((i, cell) => {
        const text = $(cell).text().trim();
        if (text && !isNaN(text)) {
          years.push(text);
        }
      });

      annualTable.find('tr').slice(1).each((rIndex, tr) => {
        const cells = $(tr).find('td');
        if (cells.length > 0) {
          const rowName = $(cells[0]).text().trim();
          const rowValues = {};
          years.forEach((year, yIdx) => {
            const val = $(cells[yIdx + 1]).text().trim();
            rowValues[year] = val;
          });
          financials.push({ metric: rowName, values: rowValues, type: 'Annual' });
        }
      });
    }

    // Table 6 (Quarterly Financials)
    const quarterly = [];
    const quarterlyTable = $('table').eq(5);
    if (quarterlyTable.length > 0) {
      const quarters = [];
      quarterlyTable.find('tr').first().find('td, th').each((i, cell) => {
        const text = $(cell).text().trim();
        if (text) {
          quarters.push(text);
        }
      });

      quarterlyTable.find('tr').slice(1).each((rIndex, tr) => {
        const cells = $(tr).find('td');
        if (cells.length > 0) {
          const rowName = $(cells[0]).text().trim();
          const rowValues = {};
          quarters.forEach((qtr, qIdx) => {
            const val = $(cells[qIdx + 1]).text().trim();
            rowValues[qtr] = val;
          });
          quarterly.push({ metric: rowName, values: rowValues, type: 'Quarterly' });
        }
      });
    }

    // Table 7 (Ratios)
    const ratiosTable = $('table').eq(6);
    if (ratiosTable.length > 0) {
      const years = [];
      ratiosTable.find('tr').first().find('td, th').each((i, cell) => {
        const text = $(cell).text().trim();
        if (text && !isNaN(text)) {
          years.push(text);
        }
      });

      ratiosTable.find('tr').slice(1).each((rIndex, tr) => {
        const cells = $(tr).find('td');
        if (cells.length > 0) {
          const rowName = $(cells[0]).text().trim();
          const rowValues = {};
          years.forEach((year, yIdx) => {
            const val = $(cells[yIdx + 1]).text().trim();
            rowValues[year] = val;
          });
          ratios.push({ metric: rowName, values: rowValues });
        }
      });
    }

    // Price calculations
    let priceHistory = [];
    let price = 0;
    let change = 0;
    let changePercent = 0;
    let previousClose = 0;
    let high = 0;
    let low = 0;
    let volume = 0;

    if (eodRes && eodRes.data) {
      priceHistory = eodRes.data.map(item => ({
        time: item[0],
        close: item[1],
        volume: item[2],
        open: item[3] || item[1]
      })).reverse();
    }

    if (priceHistory.length > 0) {
      const hasTodayInEod = intradayRes && intradayRes.data && intradayRes.data.length > 0;
      
      if (hasTodayInEod) {
        price = intradayRes.data[0][1];
        const eodDateStr = new Date(eodRes.data[0][0] * 1000).toDateString();
        const intraDateStr = new Date(intradayRes.data[0][0] * 1000).toDateString();
        
        if (eodDateStr === intraDateStr && eodRes.data.length > 1) {
          previousClose = eodRes.data[1][1];
        } else {
          previousClose = eodRes.data[0][1];
        }

        const prices = intradayRes.data.map(item => item[1]);
        high = Math.max(...prices);
        low = Math.min(...prices);
        volume = intradayRes.data.reduce((sum, item) => sum + (item[2] || 0), 0);
      } else {
        const latestDay = eodRes.data[0];
        price = latestDay[1];
        previousClose = eodRes.data.length > 1 ? eodRes.data[1][1] : price;
        high = latestDay[1];
        low = latestDay[1];
        volume = latestDay[2];
      }
    }

    if (previousClose > 0) {
      change = price - previousClose;
      changePercent = (change / previousClose) * 100;
    }

    let fiftyTwoWeekHigh = price;
    let fiftyTwoWeekLow = price;
    if (priceHistory.length > 0) {
      const lastYearHistory = priceHistory.slice(-250);
      const closingPrices = lastYearHistory.map(item => item.close);
      if (closingPrices.length > 0) {
        fiftyTwoWeekHigh = Math.max(...closingPrices, price);
        fiftyTwoWeekLow = Math.min(...closingPrices, price);
      }
    }

    const payload = {
      symbol,
      companyName,
      sector,
      price: parseFloat(price.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      fiftyTwoWeekHigh: parseFloat(fiftyTwoWeekHigh.toFixed(2)),
      fiftyTwoWeekLow: parseFloat(fiftyTwoWeekLow.toFixed(2)),
      volume: volume,
      marketCap,
      sharesOutstanding,
      freeFloatShares,
      freeFloatPercent,
      management,
      announcements,
      financials,
      quarterly,
      ratios,
      priceHistory
    };

    cache.set(cacheKey, payload, 2 * 60 * 1000);
    res.json(payload);
  } catch (error) {
    console.error(`Error loading stock details for ${symbol}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Route: Fetch and parse Google News RSS for a symbol/company
router.get('/news/:symbol', async (req, res) => {
  const symbol = req.params.symbol.trim().toUpperCase();
  
  const cacheKey = `news:${symbol}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    let companyName = COMPANY_NAME_MAP[symbol];
    
    if (!companyName) {
      try {
        const companyUrl = `https://dps.psx.com.pk/company/${symbol}`;
        const html = await fetchText(companyUrl);
        const $ = cheerio.load(html);
        const titleText = $('title').text().trim();
        companyName = getCompanyName(symbol, html, titleText);
      } catch {
        companyName = symbol;
      }
    }

    const query = `"${companyName}" OR "${symbol}" stock Pakistan`;
    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-PK&gl=PK&ceid=PK:en`;

    const feed = await parser.parseURL(feedUrl);
    const twoYearsAgo = Date.now() - 2 * 365 * 24 * 60 * 60 * 1000;
    
    const articles = (feed.items || [])
      .filter(item => {
        if (!item.pubDate) return false;
        return new Date(item.pubDate).getTime() >= twoYearsAgo;
      })
      .map(item => {
        let title = item.title || '';
        let source = 'Google News';
        
        const parts = title.split(' - ');
        if (parts.length > 1) {
          source = parts.pop().trim();
          title = parts.join(' - ').trim();
        }

        return {
          title,
          link: item.link,
          pubDate: item.pubDate,
          isoDate: item.isoDate,
          snippet: item.contentSnippet || '',
          source
        };
      });

    articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    cache.set(cacheKey, articles, 10 * 60 * 1000);
    res.json(articles);
  } catch (error) {
    console.error(`Error fetching news for ${symbol}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Mount router on both /api and root
app.use('/api', router);
app.use('/', router);

export { app };
export default app;
