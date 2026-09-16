import React from 'react';

export default function PsxLogo({ size = 32, className = '', variant = 'badge' }) {
  if (variant === 'mark') {
    // Transparent / mark only (for embedding inside chips or custom badges)
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="PSX Logo"
      >
        <defs>
          <linearGradient id="mark-g1" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#047857"/>
            <stop offset="100%" stopColor="#10b981"/>
          </linearGradient>
          <linearGradient id="mark-g2" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#059669"/>
            <stop offset="100%" stopColor="#34d399"/>
          </linearGradient>
          <linearGradient id="mark-g3" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#0d9488"/>
            <stop offset="100%" stopColor="#2dd4bf"/>
          </linearGradient>
          <linearGradient id="mark-g4" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#0284c7"/>
            <stop offset="100%" stopColor="#38bdf8"/>
          </linearGradient>
        </defs>
        
        {/* 4 Ascending PSX Pillars */}
        <rect x="14.5" y="23" width="5.5" height="11" rx="2" fill="url(#mark-g1)"/>
        <rect x="24.5" y="18" width="5.5" height="16" rx="2" fill="url(#mark-g2)"/>
        <rect x="34.5" y="13" width="5.5" height="21" rx="2" fill="url(#mark-g3)"/>
        <rect x="44.5" y="8"  width="5.5" height="26" rx="2" fill="url(#mark-g4)"/>
        
        {/* Trendline */}
        <path d="M11 26 L23 20 L33 15 L46.5 7" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polygon points="51,4.5 45,5.5 48.5,9" fill="#ffffff"/>
        <circle cx="50" cy="5" r="1.8" fill="#38bdf8"/>
        
        {/* PSX Lettermark */}
        <text 
          x="32" 
          y="54" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          fontSize="14.5" 
          fontWeight="900" 
          letterSpacing="1.5" 
          fill="#ffffff" 
          textAnchor="middle"
        >
          PSX
        </text>
      </svg>
    );
  }

  // Default: Full sleek badge with rich dark emerald gradient and glowing border
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="PSX Logo Badge"
    >
      <defs>
        <linearGradient id="comp-psx-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#04261d"/>
          <stop offset="50%" stopColor="#061a15"/>
          <stop offset="100%" stopColor="#020f0c"/>
        </linearGradient>

        <radialGradient id="comp-psx-glow" cx="75%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
        </radialGradient>

        <linearGradient id="comp-psx-border" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.8"/>
          <stop offset="50%" stopColor="#10b981" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.7"/>
        </linearGradient>

        <linearGradient id="comp-bar-1" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#047857"/>
          <stop offset="100%" stopColor="#10b981"/>
        </linearGradient>
        <linearGradient id="comp-bar-2" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#059669"/>
          <stop offset="100%" stopColor="#34d399"/>
        </linearGradient>
        <linearGradient id="comp-bar-3" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#0d9488"/>
          <stop offset="100%" stopColor="#2dd4bf"/>
        </linearGradient>
        <linearGradient id="comp-bar-4" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#0284c7"/>
          <stop offset="100%" stopColor="#38bdf8"/>
        </linearGradient>
      </defs>

      {/* Container Badge with rounded squircle and inset neon border */}
      <rect width="64" height="64" rx="15" fill="url(#comp-psx-bg)"/>
      <rect width="64" height="64" rx="15" fill="url(#comp-psx-glow)"/>
      <rect x="1" y="1" width="62" height="62" rx="14" fill="none" stroke="url(#comp-psx-border)" strokeWidth="1.5"/>

      {/* 4 Ascending PSX Market Pillars */}
      <rect x="14.5" y="23" width="5.5" height="11" rx="2" fill="url(#comp-bar-1)"/>
      <rect x="24.5" y="18" width="5.5" height="16" rx="2" fill="url(#comp-bar-2)"/>
      <rect x="34.5" y="13" width="5.5" height="21" rx="2" fill="url(#comp-bar-3)"/>
      <rect x="44.5" y="8"  width="5.5" height="26" rx="2" fill="url(#comp-bar-4)"/>

      {/* Bull Trendline */}
      <path d="M11 26 L23 20 L33 15 L46.5 7" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95"/>
      <polygon points="51,4.5 45,5.5 48.5,9" fill="#ffffff"/>
      <circle cx="50" cy="5" r="1.8" fill="#38bdf8"/>

      {/* PSX Lettermark */}
      <text 
        x="32" 
        y="54" 
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        fontSize="14.5" 
        fontWeight="900" 
        letterSpacing="1.5" 
        fill="#ffffff" 
        textAnchor="middle"
      >
        PSX
      </text>
    </svg>
  );
}
