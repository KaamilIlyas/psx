import React, { useState, useEffect, useRef } from 'react';

// Custom responsive SVG line chart to show stock history
export default function StockChart({ history, colorClass, timeframe }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 220 });
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  if (!history || history.length === 0) {
    return (
      <div className="loading-container" style={{ height: '200px' }}>
        <span>No historical price data available</span>
      </div>
    );
  }

  let sliceCount = -250;
  if (timeframe === '1M') sliceCount = -20;
  else if (timeframe === '6M') sliceCount = -120;
  else if (timeframe === '1Y') sliceCount = -250;
  else if (timeframe === '5Y') sliceCount = -1237;

  const data = history.slice(sliceCount);
  const prices = data.map(d => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  
  const volumes = data.map(d => d.volume || 0);
  const maxVolume = Math.max(...volumes) || 1;
  const volumeHeightScale = Math.min(30, dimensions.height * 0.18);
  
  const paddingBottom = 26;
  const paddingTop = 22;
  const chartHeight = Math.max(20, dimensions.height - paddingBottom - paddingTop);
  
  const points = data.map((d, index) => {
    const x = data.length > 1 ? (index / (data.length - 1)) * dimensions.width : dimensions.width / 2;
    const y = paddingTop + chartHeight - ((d.close - minPrice) / priceRange) * chartHeight;
    return { x, y, price: d.close, time: d.time };
  });

  const updateHoverFromClientX = (clientX) => {
    if (!containerRef.current || points.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(rect.width, mouseX));
    const index = Math.round((clampedX / rect.width) * (points.length - 1));
    if (index >= 0 && index < points.length) {
      setHoveredPoint(points[index]);
    }
  };

  const handleMouseMove = (e) => {
    updateHoverFromClientX(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      updateHoverFromClientX(e.touches[0].clientX);
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      updateHoverFromClientX(e.touches[0].clientX);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  let dPath = '';
  if (points.length > 0) {
    dPath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  }

  const fillPath = dPath && points.length > 0 ? `${dPath} L ${points[points.length - 1].x} ${dimensions.height - paddingBottom} L ${points[0].x} ${dimensions.height - paddingBottom} Z` : '';

  const lineColor = colorClass === 'up' ? 'var(--color-green)' : 'var(--color-red)';
  const gradientId = `chart-gradient-${colorClass}-${timeframe}`;

  return (
    <div 
      ref={containerRef} 
      className="chart-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      style={{ position: 'relative', cursor: 'crosshair', touchAction: 'pan-y' }}
    >
      <svg className="sparkline-svg" width="100%" height="100%" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        {/* Horizontal grid lines */}
        <line 
          x1="0" 
          y1={paddingTop} 
          x2={dimensions.width} 
          y2={paddingTop} 
          stroke="var(--card-border)" 
          strokeDasharray="4"
        />
        <line 
          x1="0" 
          y1={dimensions.height - paddingBottom} 
          x2={dimensions.width} 
          y2={dimensions.height - paddingBottom} 
          stroke="var(--card-border)" 
          strokeDasharray="4"
        />
        
        {/* Volume bars along the bottom */}
        {data.map((d, idx) => {
          const barWidth = Math.max(1, (dimensions.width / data.length) * 0.5);
          const height = ((d.volume || 0) / maxVolume) * volumeHeightScale;
          const x = (idx / (data.length - 1 || 1)) * dimensions.width - barWidth / 2;
          const y = dimensions.height - paddingBottom - height;
          return (
            <rect
              key={idx}
              x={Math.max(0, x)}
              y={y}
              width={barWidth}
              height={Math.max(0, height)}
              fill="var(--bg-subtle)"
              rx="1"
            />
          );
        })}

        {/* Fill Area */}
        {fillPath && <path d={fillPath} fill={`url(#${gradientId})`} />}
        
        {/* Line Path */}
        {dPath && (
          <path 
            d={dPath} 
            fill="none" 
            stroke={lineColor} 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        )}

        {/* Hover Line Marker */}
        {hoveredPoint && (
          <line 
            x1={hoveredPoint.x} 
            y1={paddingTop} 
            x2={hoveredPoint.x} 
            y2={dimensions.height - paddingBottom} 
            stroke="var(--text-muted)" 
            strokeDasharray="3" 
            pointerEvents="none"
          />
        )}

        {/* Hover Dot Marker */}
        {hoveredPoint && (
          <circle 
            cx={hoveredPoint.x} 
            cy={hoveredPoint.y} 
            r="5" 
            fill={lineColor} 
            stroke="var(--bg-secondary)" 
            strokeWidth="2" 
            pointerEvents="none"
          />
        )}

        {/* Boundary Text */}
        <text x="6" y={paddingTop - 6} fill="var(--text-muted)" fontSize="9.5" fontWeight="700">
          Max: Rs. {maxPrice.toFixed(2)}
        </text>
        <text x="6" y={dimensions.height - 7} fill="var(--text-muted)" fontSize="9.5" fontWeight="700">
          Min: Rs. {minPrice.toFixed(2)}
        </text>
      </svg>

      {/* Floating Tooltip */}
      {hoveredPoint && (
        <div 
          className="chart-tooltip" 
          style={{
            position: 'absolute',
            left: `${Math.min(Math.max(8, hoveredPoint.x - 60), Math.max(8, dimensions.width - 135))}px`,
            top: `${Math.min(Math.max(6, hoveredPoint.y - 55), Math.max(6, dimensions.height - 65))}px`,
            backgroundColor: 'var(--bg-secondary)',
            border: `1px solid ${lineColor}`,
            borderRadius: '6px',
            padding: '5px 9px',
            pointerEvents: 'none',
            zIndex: 10,
            boxShadow: '0 4px 16px rgba(10, 31, 22, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            fontSize: '11px',
            color: 'var(--text-primary)',
            fontWeight: '600'
          }}
        >
          <span style={{ color: 'var(--text-muted)', fontSize: '9px', marginBottom: '2px' }}>
            {new Date(hoveredPoint.time * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          <span style={{ fontSize: '12px', fontWeight: '800' }}>Rs. {hoveredPoint.price.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}
