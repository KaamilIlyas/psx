import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

// Layout & Navigation Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MobileHeader from './components/layout/MobileHeader';
import NavTabs from './components/layout/NavTabs';
import MobileBottomNav from './components/layout/MobileBottomNav';

// View Tabs
import PortfolioView from './components/views/PortfolioView';
import NewsView from './components/views/NewsView';
import ProfileView from './components/views/ProfileView';
import FinancialsView from './components/views/FinancialsView';
import FilingsView from './components/views/FilingsView';

// Modal
import TradeModal from './components/modals/TradeModal';

export default function App() {
  // Watchlist & Selected Symbol State
  const [watchlistSymbols, setWatchlistSymbols] = useState(() => {
    const saved = localStorage.getItem('watchlist_symbols');
    return saved ? JSON.parse(saved) : ['MEBL', 'FFC', 'HUBC', 'LUCK', 'MARI', 'SYS', 'HINOON'];
  });
  
  const [selectedSymbol, setSelectedSymbol] = useState(watchlistSymbols[0] || 'MEBL');
  const [searchVal, setSearchVal] = useState('');
  
  // Mobile drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Watchlist summary details (displayed in sidebar)
  const [watchlistData, setWatchlistData] = useState([]);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  
  // Detailed current stock data
  const [stockDetails, setStockDetails] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  
  // Active Tab state: 'news' | 'profile' | 'financials' | 'filings' | 'portfolio'
  const [activeTab, setActiveTab] = useState('news');
  
  // Portfolio Sub-Tab: 'holdings' | 'sells' | 'dividends'
  const [portfolioSubTab, setPortfolioSubTab] = useState('holdings');

  // Expandable stock lot accordions: Set of expanded symbols
  const [expandedStocks, setExpandedStocks] = useState({});
  // Expandable dividend accordions: Set of expanded symbols
  const [expandedDividends, setExpandedDividends] = useState({});

  // Investify-Style Discrete Buy Lots (Purchase Transactions)
  const [buyLots, setBuyLots] = useState(() => {
    const saved = localStorage.getItem('psx_portfolio_buylots');
    if (saved) return JSON.parse(saved);
    // Legacy migration check
    const legacy = localStorage.getItem('psx_portfolio_holdings');
    if (legacy) {
      const parsed = JSON.parse(legacy);
      return parsed.map(p => ({
        id: p.id || Date.now().toString() + Math.random(),
        symbol: p.symbol,
        shares: p.shares,
        buyPrice: p.avgBuyPrice || p.buyPrice || 100,
        date: p.date || '2025-09-10',
        notes: p.notes || 'Initial lot'
      }));
    }
    return [
      { id: '1', symbol: 'FFC', shares: 30, buyPrice: 500.00, date: '2025-09-12', notes: 'First tranche' },
      { id: '2', symbol: 'FFC', shares: 20, buyPrice: 520.00, date: '2025-09-14', notes: 'Second purchase' },
      { id: '3', symbol: 'MEBL', shares: 500, buyPrice: 420.50, date: '2025-06-15', notes: 'Core holding' },
      { id: '4', symbol: 'HUBC', shares: 1500, buyPrice: 180.25, date: '2025-09-01', notes: 'Energy dividend' }
    ];
  });

  const [sells, setSells] = useState(() => {
    const saved = localStorage.getItem('psx_portfolio_sells');
    return saved ? JSON.parse(saved) : [
      { id: '1', symbol: 'SYS', shares: 200, buyPrice: 450.00, sellPrice: 520.00, date: '2025-11-20', notes: 'Profit booking' }
    ];
  });

  const [dividends, setDividends] = useState(() => {
    const saved = localStorage.getItem('psx_portfolio_dividends');
    return saved ? JSON.parse(saved) : [
      { id: '1', symbol: 'FFC', shares: 50, dps: 15.50, taxRate: 15, date: '2025-10-15', notes: 'Q3 Interim Dividend' },
      { id: '2', symbol: 'MEBL', shares: 500, dps: 7.00, taxRate: 15, date: '2025-09-28', notes: 'Interim Dividend' }
    ];
  });

  // Portfolio Name state (Investify pattern)
  const [portfolioName, setPortfolioName] = useState(() => {
    return localStorage.getItem('psx_portfolio_name') || 'My Portfolio';
  });
  const [isEditingPortfolioName, setIsEditingPortfolioName] = useState(false);
  const [tempPortfolioName, setTempPortfolioName] = useState(portfolioName);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [currentLiveTime, setCurrentLiveTime] = useState('');

  // Quick transaction dropdown/modal trigger
  const [isTransactionMenuOpen, setIsTransactionMenuOpen] = useState(false);

  // Modal State: { type: 'buy' | 'edit_lot' | 'sell' | 'edit_sell' | 'dividend' | 'edit_dividend', data: null }
  const [modalConfig, setModalConfig] = useState({ type: null, data: null });

  // Form states for modals
  const [formData, setFormData] = useState({
    symbol: '',
    shares: '',
    price: '',
    buyPrice: '',
    dps: '',
    taxRate: '15',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    buyMode: 'new_lot',
    reduceHolding: true
  });
  
  // Refresh toggles & timeframe
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [chartTimeframe, setChartTimeframe] = useState('1Y');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('psx_portfolio_buylots', JSON.stringify(buyLots));
  }, [buyLots]);

  useEffect(() => {
    localStorage.setItem('psx_portfolio_sells', JSON.stringify(sells));
  }, [sells]);

  useEffect(() => {
    localStorage.setItem('psx_portfolio_dividends', JSON.stringify(dividends));
  }, [dividends]);

  useEffect(() => {
    localStorage.setItem('psx_portfolio_name', portfolioName);
  }, [portfolioName]);

  useEffect(() => {
    localStorage.setItem('watchlist_symbols', JSON.stringify(watchlistSymbols));
  }, [watchlistSymbols]);

  // Market time & status updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase() + ' ' + 
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      setCurrentLiveTime(timeStr);
      
      const day = now.getDay();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const timeVal = hours * 60 + minutes;
      const isOpen = day >= 1 && day <= 5 && timeVal >= (9 * 60 + 15) && timeVal <= (15 * 60 + 30);
      setIsMarketOpen(isOpen);
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  // Close sidebar/modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
        setIsEditingPortfolioName(false);
        setIsTransactionMenuOpen(false);
        setModalConfig({ type: null, data: null });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Effect to load sidebar watchlist stats
  useEffect(() => {
    async function loadWatchlist() {
      const allNeeded = Array.from(new Set([...watchlistSymbols, ...buyLots.map(h => h.symbol)]));
      if (allNeeded.length === 0) {
        setWatchlistData([]);
        setLoadingWatchlist(false);
        return;
      }
      setLoadingWatchlist(true);
      try {
        const query = allNeeded.join(',');
        const res = await fetch(`/api/watchlist?symbols=${query}`);
        if (!res.ok) throw new Error('Failed to load watchlist statistics');
        const data = await res.json();
        setWatchlistData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingWatchlist(false);
      }
    }
    loadWatchlist();
  }, [watchlistSymbols, buyLots, refreshTrigger]);

  // Effect to load details of the selected stock
  useEffect(() => {
    async function loadStockDetails() {
      if (!selectedSymbol) return;
      setLoadingDetails(true);
      try {
        const [detailsRes, newsRes] = await Promise.all([
          fetch(`/api/stock/${selectedSymbol}`),
          fetch(`/api/news/${selectedSymbol}`)
        ]);

        if (!detailsRes.ok) throw new Error(`Failed to load details for ${selectedSymbol}`);
        if (!newsRes.ok) throw new Error(`Failed to load news for ${selectedSymbol}`);

        const details = await detailsRes.json();
        const news = await newsRes.json();
        
        setStockDetails(details);
        setNewsList(news);
      } catch (err) {
        console.error(err);
        setStockDetails(null);
      } finally {
        setLoadingDetails(false);
      }
    }
    loadStockDetails();
  }, [selectedSymbol, refreshTrigger]);

  // Watchlist action handlers
  const handleAddSymbol = (e) => {
    e.preventDefault();
    const cleanSym = searchVal.trim().toUpperCase();
    if (!cleanSym) return;
    if (watchlistSymbols.includes(cleanSym)) {
      setSelectedSymbol(cleanSym);
      setSearchVal('');
      setIsSidebarOpen(false);
      return;
    }
    setWatchlistSymbols([...watchlistSymbols, cleanSym]);
    setSelectedSymbol(cleanSym);
    setSearchVal('');
    setIsSidebarOpen(false);
  };

  const handleRemoveSymbol = (e, sym) => {
    e.stopPropagation();
    const updated = watchlistSymbols.filter(s => s !== sym);
    setWatchlistSymbols(updated);
    if (selectedSymbol === sym && updated.length > 0) {
      setSelectedSymbol(updated[0]);
    }
  };

  const handleSelectStock = (symbol) => {
    setSelectedSymbol(symbol);
    setIsSidebarOpen(false);
  };

  const handleManualRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Helper to find live price for any ticker
  const getLivePriceForSymbol = (symbol) => {
    if (stockDetails && stockDetails.symbol === symbol) {
      return stockDetails.price;
    }
    const match = watchlistData.find(w => w.symbol === symbol);
    if (match && match.price > 0) {
      return match.price;
    }
    return null;
  };

  // Toggle lot & dividend accordion expansion
  const toggleStockExpansion = (symbol) => {
    setExpandedStocks(prev => ({
      ...prev,
      [symbol]: !prev[symbol]
    }));
  };

  const toggleDividendExpansion = (symbol) => {
    setExpandedDividends(prev => ({
      ...prev,
      [symbol]: !prev[symbol]
    }));
  };

  // Consolidated Holdings Computation
  const stockSymbolsInLots = Array.from(new Set(buyLots.map(l => l.symbol)));
  
  const consolidatedHoldings = stockSymbolsInLots.map(symbol => {
    const matchingLots = buyLots.filter(l => l.symbol === symbol).sort((a, b) => new Date(a.date) - new Date(b.date));
    const totalShares = matchingLots.reduce((sum, l) => sum + l.shares, 0);
    const totalInvested = matchingLots.reduce((sum, l) => sum + (l.shares * l.buyPrice), 0);
    const weightedAvgBuyPrice = totalShares > 0 ? totalInvested / totalShares : 0;
    
    // Live price and Day changes
    const matchWatch = watchlistData.find(w => w.symbol === symbol);
    const livePrice = matchWatch?.price || (stockDetails && stockDetails.symbol === symbol ? stockDetails.price : weightedAvgBuyPrice);
    const dayChange = matchWatch?.change || (stockDetails && stockDetails.symbol === symbol ? stockDetails.change : 0);
    const dayChangePct = matchWatch?.changePercent || (stockDetails && stockDetails.symbol === symbol ? stockDetails.changePercent : 0);
    
    const currentVal = totalShares * livePrice;
    const profitLoss = currentVal - totalInvested;
    const profitLossPct = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;
    
    const dayPnL = totalShares * dayChange;
    const dayPnLPct = dayChangePct;

    return {
      symbol,
      lots: matchingLots,
      totalShares,
      totalInvested,
      weightedAvgBuyPrice,
      livePrice,
      dayChange,
      dayChangePct,
      dayPnL,
      dayPnLPct,
      currentVal,
      profitLoss,
      profitLossPct
    };
  });

  const totalPortfolioValue = consolidatedHoldings.reduce((sum, h) => sum + h.currentVal, 0);
  const totalInvestedAmount = consolidatedHoldings.reduce((sum, h) => sum + h.totalInvested, 0);
  const totalUnrealizedPnL = totalPortfolioValue - totalInvestedAmount;
  const totalUnrealizedPnLPct = totalInvestedAmount > 0 ? (totalUnrealizedPnL / totalInvestedAmount) * 100 : 0;

  const totalDayPnL = consolidatedHoldings.reduce((sum, h) => sum + (h.dayPnL || 0), 0);
  const prevDayPortfolioVal = totalPortfolioValue - totalDayPnL;
  const totalDayPnLPct = prevDayPortfolioVal > 0 ? (totalDayPnL / prevDayPortfolioVal) * 100 : 0;

  const calculatedSells = sells.map(s => {
    const proceeds = s.shares * s.sellPrice;
    const cost = s.shares * s.buyPrice;
    const realizedPnL = proceeds - cost;
    const realizedPnLPct = cost > 0 ? (realizedPnL / cost) * 100 : 0;
    return {
      ...s,
      proceeds,
      cost,
      realizedPnL,
      realizedPnLPct
    };
  });

  const totalRealizedGain = calculatedSells.reduce((sum, s) => sum + s.realizedPnL, 0);

  const calculatedDividends = dividends.map(d => {
    const gross = d.shares * d.dps;
    const taxAmount = gross * (d.taxRate / 100);
    const net = gross - taxAmount;
    return {
      ...d,
      gross,
      taxAmount,
      net
    };
  });

  const totalNetDividends = calculatedDividends.reduce((sum, d) => sum + d.net, 0);

  // Group dividends by stock symbol (Consolidated Multi-Dividend Architecture)
  const dividendSymbols = Array.from(new Set(dividends.map(d => d.symbol)));

  const consolidatedDividends = dividendSymbols.map(symbol => {
    const matchingDivs = calculatedDividends
      .filter(d => d.symbol === symbol)
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    const totalGross = matchingDivs.reduce((sum, d) => sum + d.gross, 0);
    const totalTax = matchingDivs.reduce((sum, d) => sum + d.taxAmount, 0);
    const totalNet = matchingDivs.reduce((sum, d) => sum + d.net, 0);
    const totalSharesEntitled = matchingDivs.reduce((sum, d) => sum + d.shares, 0);
    const effectiveTaxRate = totalGross > 0 ? (totalTax / totalGross) * 100 : 0;
    const latestPayoutDate = matchingDivs[0]?.date || 'N/A';

    return {
      symbol,
      payouts: matchingDivs,
      totalGross,
      totalTax,
      totalNet,
      totalSharesEntitled,
      effectiveTaxRate,
      latestPayoutDate
    };
  }).sort((a, b) => new Date(b.latestPayoutDate || 0) - new Date(a.latestPayoutDate || 0));

  // Modal Handlers
  const openBuyModal = (editLot = null, prefillSymbol = null) => {
    if (editLot) {
      setFormData({
        symbol: editLot.symbol,
        shares: editLot.shares.toString(),
        price: editLot.buyPrice.toString(),
        buyPrice: '',
        dps: '',
        taxRate: '15',
        date: editLot.date || new Date().toISOString().split('T')[0],
        notes: editLot.notes || '',
        buyMode: 'new_lot',
        reduceHolding: false
      });
      setModalConfig({ type: 'edit_lot', data: editLot });
    } else {
      const sym = prefillSymbol || selectedSymbol || 'MEBL';
      const live = getLivePriceForSymbol(sym) || '';
      const existingHolding = consolidatedHoldings.find(h => h.symbol === sym);
      setFormData({
        symbol: sym,
        shares: '100',
        price: live ? live.toString() : '100',
        buyPrice: '',
        dps: '',
        taxRate: '15',
        date: new Date().toISOString().split('T')[0],
        notes: existingHolding ? `Purchase Lot #${existingHolding.lots.length + 1}` : 'Initial purchase',
        buyMode: 'new_lot',
        reduceHolding: false
      });
      setModalConfig({ type: 'buy', data: null });
    }
  };

  const openSellModal = (editSell = null, holdingItem = null) => {
    if (editSell && !holdingItem) {
      setFormData({
        symbol: editSell.symbol,
        shares: editSell.shares.toString(),
        price: editSell.sellPrice.toString(),
        buyPrice: editSell.buyPrice.toString(),
        dps: '',
        taxRate: '15',
        date: editSell.date || new Date().toISOString().split('T')[0],
        notes: editSell.notes || '',
        buyMode: 'new_lot',
        reduceHolding: false
      });
      setModalConfig({ type: 'edit_sell', data: editSell });
    } else if (holdingItem) {
      const live = getLivePriceForSymbol(holdingItem.symbol) || holdingItem.weightedAvgBuyPrice;
      setFormData({
        symbol: holdingItem.symbol,
        shares: holdingItem.totalShares.toString(),
        price: live.toString(),
        buyPrice: holdingItem.weightedAvgBuyPrice.toFixed(2),
        dps: '',
        taxRate: '15',
        date: new Date().toISOString().split('T')[0],
        notes: `Sold from consolidated holding`,
        buyMode: 'new_lot',
        reduceHolding: true
      });
      setModalConfig({ type: 'sell', data: holdingItem });
    } else {
      const sym = selectedSymbol || 'MEBL';
      const holding = consolidatedHoldings.find(h => h.symbol === sym);
      const live = getLivePriceForSymbol(sym) || '';
      setFormData({
        symbol: sym,
        shares: holding ? holding.totalShares.toString() : '100',
        price: live ? live.toString() : '100',
        buyPrice: holding ? holding.weightedAvgBuyPrice.toFixed(2) : (live ? live.toString() : '100'),
        dps: '',
        taxRate: '15',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        buyMode: 'new_lot',
        reduceHolding: !!holding
      });
      setModalConfig({ type: 'sell', data: null });
    }
  };

  const openDividendModal = (editDiv = null, holdingItem = null) => {
    if (editDiv && !holdingItem) {
      setFormData({
        symbol: editDiv.symbol,
        shares: editDiv.shares.toString(),
        price: '',
        buyPrice: '',
        dps: editDiv.dps.toString(),
        taxRate: editDiv.taxRate.toString(),
        date: editDiv.date || new Date().toISOString().split('T')[0],
        notes: editDiv.notes || '',
        buyMode: 'new_lot',
        reduceHolding: false
      });
      setModalConfig({ type: 'edit_dividend', data: editDiv });
    } else {
      const sym = holdingItem ? (typeof holdingItem === 'string' ? holdingItem : holdingItem.symbol) : (selectedSymbol || 'MEBL');
      const holding = consolidatedHoldings.find(h => h.symbol === sym);
      setFormData({
        symbol: sym,
        shares: holding ? holding.totalShares.toString() : '500',
        price: '',
        buyPrice: '',
        dps: '5.00',
        taxRate: '15',
        date: new Date().toISOString().split('T')[0],
        notes: 'Interim Cash Dividend',
        buyMode: 'new_lot',
        reduceHolding: false
      });
      setModalConfig({ type: 'dividend', data: holdingItem });
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const cleanSym = formData.symbol.trim().toUpperCase();
    const sharesNum = parseFloat(formData.shares) || 0;
    const priceNum = parseFloat(formData.price) || 0;
    const buyPriceNum = parseFloat(formData.buyPrice) || 0;
    const dpsNum = parseFloat(formData.dps) || 0;
    const taxRateNum = parseFloat(formData.taxRate) || 0;

    if (!cleanSym || sharesNum <= 0) {
      alert('Please provide a valid stock symbol and shares quantity.');
      return;
    }

    if (modalConfig.type === 'buy') {
      const newLot = {
        id: Date.now().toString(),
        symbol: cleanSym,
        shares: sharesNum,
        buyPrice: priceNum,
        date: formData.date,
        notes: formData.notes || `Lot ${buyLots.filter(l => l.symbol === cleanSym).length + 1}`
      };
      setBuyLots([...buyLots, newLot]);

      if (!watchlistSymbols.includes(cleanSym)) {
        setWatchlistSymbols([...watchlistSymbols, cleanSym]);
      }
    } else if (modalConfig.type === 'edit_lot') {
      const updated = buyLots.map(l => {
        if (l.id === modalConfig.data.id) {
          return {
            ...l,
            symbol: cleanSym,
            shares: sharesNum,
            buyPrice: priceNum,
            date: formData.date,
            notes: formData.notes
          };
        }
        return l;
      });
      setBuyLots(updated);
    } else if (modalConfig.type === 'sell') {
      const newSell = {
        id: Date.now().toString(),
        symbol: cleanSym,
        shares: sharesNum,
        sellPrice: priceNum,
        buyPrice: buyPriceNum,
        date: formData.date,
        notes: formData.notes
      };
      setSells([newSell, ...sells]);

      if (formData.reduceHolding) {
        let remainingToDeduct = sharesNum;
        const newLots = [];
        const symbolLots = buyLots.filter(l => l.symbol === cleanSym).sort((a, b) => new Date(a.date) - new Date(b.date));
        const otherLots = buyLots.filter(l => l.symbol !== cleanSym);

        for (const lot of symbolLots) {
          if (remainingToDeduct <= 0) {
            newLots.push(lot);
          } else if (lot.shares <= remainingToDeduct) {
            remainingToDeduct -= lot.shares;
          } else {
            newLots.push({
              ...lot,
              shares: lot.shares - remainingToDeduct
            });
            remainingToDeduct = 0;
          }
        }
        setBuyLots([...otherLots, ...newLots]);
      }
    } else if (modalConfig.type === 'edit_sell') {
      const updated = sells.map(s => {
        if (s.id === modalConfig.data.id) {
          return {
            ...s,
            symbol: cleanSym,
            shares: sharesNum,
            sellPrice: priceNum,
            buyPrice: buyPriceNum,
            date: formData.date,
            notes: formData.notes
          };
        }
        return s;
      });
      setSells(updated);
    } else if (modalConfig.type === 'dividend') {
      const newDiv = {
        id: Date.now().toString(),
        symbol: cleanSym,
        shares: sharesNum,
        dps: dpsNum,
        taxRate: taxRateNum,
        date: formData.date,
        notes: formData.notes
      };
      setDividends([newDiv, ...dividends]);
    } else if (modalConfig.type === 'edit_dividend') {
      const updated = dividends.map(d => {
        if (d.id === modalConfig.data.id) {
          return {
            ...d,
            symbol: cleanSym,
            shares: sharesNum,
            dps: dpsNum,
            taxRate: taxRateNum,
            date: formData.date,
            notes: formData.notes
          };
        }
        return d;
      });
      setDividends(updated);
    }

    setModalConfig({ type: null, data: null });
  };

  const handleDeleteLot = (lotId) => {
    if (confirm('Delete this specific purchase lot?')) {
      setBuyLots(buyLots.filter(l => l.id !== lotId));
    }
  };

  const handleDeleteEntireStock = (symbol) => {
    if (confirm(`Remove all purchase lots and holdings for ${symbol}?`)) {
      setBuyLots(buyLots.filter(l => l.symbol !== symbol));
    }
  };

  const handleDeleteSell = (id) => {
    if (confirm('Are you sure you want to remove this sell record?')) {
      setSells(sells.filter(s => s.id !== id));
    }
  };

  const handleDeleteDividend = (id) => {
    if (confirm('Are you sure you want to delete this dividend entry?')) {
      setDividends(dividends.filter(d => d.id !== id));
    }
  };

  const handleDeleteEntireDividendStock = (symbol) => {
    if (confirm(`Remove all dividend records for ${symbol}?`)) {
      setDividends(dividends.filter(d => d.symbol !== symbol));
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Watchlist */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        consolidatedHoldings={consolidatedHoldings}
        handleAddSymbol={handleAddSymbol}
        searchVal={searchVal}
        setSearchVal={setSearchVal}
        loadingWatchlist={loadingWatchlist}
        watchlistData={watchlistData}
        selectedSymbol={selectedSymbol}
        handleSelectStock={handleSelectStock}
        handleRemoveSymbol={handleRemoveSymbol}
      />

      {/* Main Dashboard Panel */}
      <main className="dashboard">
        {/* Mobile Top Navigation Bar */}
        <MobileHeader 
          activeTab={activeTab}
          portfolioName={portfolioName}
          selectedSymbol={selectedSymbol}
          stockDetails={stockDetails}
          consolidatedHoldings={consolidatedHoldings}
          watchlistSymbols={watchlistSymbols}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Dashboard Company / Portfolio Header (Always at the top) */}
        <Header 
          activeTab={activeTab}
          portfolioName={portfolioName}
          setPortfolioName={setPortfolioName}
          isEditingPortfolioName={isEditingPortfolioName}
          setIsEditingPortfolioName={setIsEditingPortfolioName}
          tempPortfolioName={tempPortfolioName}
          setTempPortfolioName={setTempPortfolioName}
          isMarketOpen={isMarketOpen}
          currentLiveTime={currentLiveTime}
          consolidatedHoldings={consolidatedHoldings}
          openBuyModal={openBuyModal}
          openSellModal={openSellModal}
          openDividendModal={openDividendModal}
          loadingDetails={loadingDetails}
          stockDetails={stockDetails}
          handleManualRefresh={handleManualRefresh}
        />

        {/* Tab Selection Bar */}
        <NavTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          stockDetails={stockDetails}
          consolidatedHoldings={consolidatedHoldings}
        />

        {/* Dashboard Dynamic View Content */}
        <section className="dash-content">
          {/* TAB 5: PORTFOLIO TRACKER */}
          {activeTab === 'portfolio' && (
            <PortfolioView 
              portfolioName={portfolioName}
              setPortfolioName={setPortfolioName}
              isEditingPortfolioName={isEditingPortfolioName}
              setIsEditingPortfolioName={setIsEditingPortfolioName}
              tempPortfolioName={tempPortfolioName}
              setTempPortfolioName={setTempPortfolioName}
              isMarketOpen={isMarketOpen}
              currentLiveTime={currentLiveTime}
              isTransactionMenuOpen={isTransactionMenuOpen}
              setIsTransactionMenuOpen={setIsTransactionMenuOpen}
              openBuyModal={openBuyModal}
              openSellModal={openSellModal}
              openDividendModal={openDividendModal}
              totalPortfolioValue={totalPortfolioValue}
              totalInvestedAmount={totalInvestedAmount}
              totalUnrealizedPnL={totalUnrealizedPnL}
              totalUnrealizedPnLPct={totalUnrealizedPnLPct}
              totalDayPnL={totalDayPnL}
              totalDayPnLPct={totalDayPnLPct}
              totalRealizedGain={totalRealizedGain}
              totalNetDividends={totalNetDividends}
              portfolioSubTab={portfolioSubTab}
              setPortfolioSubTab={setPortfolioSubTab}
              consolidatedHoldings={consolidatedHoldings}
              sells={sells}
              calculatedSells={calculatedSells}
              dividends={dividends}
              consolidatedDividends={consolidatedDividends}
              expandedStocks={expandedStocks}
              toggleStockExpansion={toggleStockExpansion}
              expandedDividends={expandedDividends}
              toggleDividendExpansion={toggleDividendExpansion}
              handleDeleteLot={handleDeleteLot}
              handleDeleteEntireStock={handleDeleteEntireStock}
              handleDeleteSell={handleDeleteSell}
              handleDeleteDividend={handleDeleteDividend}
              handleDeleteEntireDividendStock={handleDeleteEntireDividendStock}
            />
          )}

          {/* TAB 1-4: SINGLE STOCK VIEWS */}
          {activeTab !== 'portfolio' && (
            <>
              {loadingDetails && !stockDetails ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <span>Fetching corporate data streams...</span>
                </div>
              ) : !stockDetails ? (
                <div className="error-container">
                  <AlertTriangle size={36} className="error-message" />
                  <span className="error-message">Could not load details for {selectedSymbol}</span>
                  <span style={{ fontSize: '0.85rem', textAlign: 'center' }}>The ticker symbol may be incorrect or the PSX server is temporarily unresponsive.</span>
                  <button className="btn-retry" onClick={handleManualRefresh}>Retry Connection</button>
                </div>
              ) : (
                <>
                  {/* TAB 1: OVERVIEW & NEWS FEED */}
                  {activeTab === 'news' && (
                    <NewsView 
                      stockDetails={stockDetails}
                      newsList={newsList}
                      chartTimeframe={chartTimeframe}
                      setChartTimeframe={setChartTimeframe}
                    />
                  )}

                  {/* TAB 2: COMPANY PROFILE & MANAGEMENT */}
                  {activeTab === 'profile' && (
                    <ProfileView stockDetails={stockDetails} />
                  )}

                  {/* TAB 3: FINANCIALS & VALUE RATIOS */}
                  {activeTab === 'financials' && (
                    <FinancialsView stockDetails={stockDetails} />
                  )}

                  {/* TAB 4: DEDICATED REGULATORY FILINGS & CORPORATE DISCLOSURES */}
                  {activeTab === 'filings' && (
                    <FilingsView stockDetails={stockDetails} />
                  )}
                </>
              )}
            </>
          )}
        </section>
      </main>

      {/* PORTFOLIO ACTION MODAL */}
      <TradeModal 
        modalConfig={modalConfig}
        setModalConfig={setModalConfig}
        formData={formData}
        setFormData={setFormData}
        handleModalSubmit={handleModalSubmit}
      />

      {/* Investify Mobile Bottom Navigation Bar (Fixed for Mobile Screens) */}
      <MobileBottomNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsSidebarOpen={setIsSidebarOpen}
        stockDetails={stockDetails}
        consolidatedHoldings={consolidatedHoldings}
      />
    </div>
  );
}
