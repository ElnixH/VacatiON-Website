// src/components/SmoothImage.jsx
import { useState } from 'react';

export default function SmoothImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  eager = false,
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className={`relative overflow-hidden bg-[#191D30]/5 select-none ${containerClassName}`}
      style={{
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      {/* Subtle warm shimmer while image loads */}
      <div
        className={`absolute inset-0 bg-gradient-to-tr from-[#191D30]/5 via-[#A18E7E]/10 to-[#191D30]/5 transition-opacity duration-700 pointer-events-none ${
          loaded ? 'opacity-0' : 'opacity-100 animate-pulse'
        }`}
      />

      {/* Protected Image Layer (pointer-events-none prevents direct interaction) */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onContextMenu={(e) => e.preventDefault()}
        className={`${className} pointer-events-none select-none transition-all duration-[1200ms] ease-out ${
          loaded
            ? 'opacity-100 scale-100 blur-0'
            : 'opacity-0 scale-[1.03] blur-[2px]'
        }`}
      />

      {/* Invisible Anti-Download & Anti-Inspect Armor Mask */}
      <div
        aria-hidden="true"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className="absolute inset-0 z-10 bg-transparent cursor-inherit"
        style={{
          backgroundImage:
            'radial-gradient(rgba(25, 29, 48, 0.015) 1px, transparent 0)',
          backgroundSize: '4px 4px',
        }}
      />
    </div>
  );
}