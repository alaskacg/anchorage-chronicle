import { useEffect, useState } from 'react';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark';
  compact?: boolean;
}

export function AnimatedLogo({
  size = 'md',
  showText = true,
  variant = 'light',
  compact = false,
}: AnimatedLogoProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const sizeClasses = {
    sm: { icon: 'h-10 w-10', text: 'text-xl', sub: 'text-[10px]' },
    md: { icon: 'h-14 w-14', text: 'text-2xl md:text-3xl', sub: 'text-xs' },
    lg: { icon: 'h-18 w-18', text: 'text-3xl md:text-4xl lg:text-5xl', sub: 'text-sm' },
    xl: { icon: 'h-24 w-24', text: 'text-4xl md:text-5xl lg:text-6xl', sub: 'text-base' },
  };

  const iconSizes = {
    sm: 44,
    md: 60,
    lg: 80,
    xl: 100,
  };

  const gapClass = compact ? 'gap-2 md:gap-3' : 'gap-3 md:gap-4';
  const titleColorClass = variant === 'dark' ? 'text-primary-foreground' : 'text-primary';
  const subtitleColorClass = variant === 'dark' ? 'text-primary-foreground/80' : 'text-muted-foreground';
  const iconSize = iconSizes[size];

  const active = isAnimating || isHovered;

  return (
    <div 
      className={`flex items-center ${gapClass} group cursor-pointer`}
      onMouseEnter={() => { setIsAnimating(true); setIsHovered(true); }}
      onMouseLeave={() => { setIsAnimating(false); setIsHovered(false); }}
    >
      {/* Animated Logo Icon */}
      <div className="relative shrink-0">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 120 120"
          className={`transition-transform duration-700 ${active ? 'scale-105' : 'scale-100'}`}
        >
          <defs>
            {/* Gradient for the shield */}
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.8)" />
            </linearGradient>
            
            {/* Gold accent gradient */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--accent))" />
              <stop offset="100%" stopColor="hsl(var(--accent) / 0.7)" />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Outer decorative ring */}
          <circle
            cx="60"
            cy="60"
            r="56"
            className="fill-none stroke-accent/20"
            strokeWidth="1"
          />
          
          {/* Animated compass points */}
          <g 
            className="origin-center"
            style={{
              transform: `rotate(${active ? 15 : 0}deg)`,
              transformOrigin: '60px 60px',
              transition: 'transform 0.8s ease-out',
            }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1="60"
                y1="8"
                x2="60"
                y2={angle % 90 === 0 ? "14" : "11"}
                className={angle % 90 === 0 ? "stroke-accent" : "stroke-muted-foreground/40"}
                strokeWidth={angle % 90 === 0 ? "2" : "1"}
                transform={`rotate(${angle} 60 60)`}
              />
            ))}
          </g>
          
          {/* Main shield/badge shape */}
          <path
            d="M60 16 
               C75 16, 88 22, 96 35
               C104 48, 104 65, 96 80
               C88 95, 75 104, 60 104
               C45 104, 32 95, 24 80
               C16 65, 16 48, 24 35
               C32 22, 45 16, 60 16Z"
            fill="url(#shieldGradient)"
            className="stroke-accent/30"
            strokeWidth="1"
          />
          
          {/* Inner shield border */}
          <path
            d="M60 22 
               C72 22, 82 27, 89 38
               C96 49, 96 63, 89 76
               C82 89, 72 96, 60 96
               C48 96, 38 89, 31 76
               C24 63, 24 49, 31 38
               C38 27, 48 22, 60 22Z"
            className="fill-none stroke-primary-foreground/20"
            strokeWidth="1"
          />

          {/* Mountain range - layered */}
          <g style={{
            transform: active ? 'translateY(-1px)' : 'translateY(0)',
            transition: 'transform 0.5s ease-out',
          }}>
            {/* Back mountains */}
            <path
              d="M28 78 L40 55 L48 62 L58 42 L68 58 L78 50 L92 78 Z"
              className="fill-primary-foreground/30"
            />
            {/* Front mountains - Denali-inspired */}
            <path
              d="M32 78 L45 52 L52 60 L60 38 L68 55 L75 48 L88 78 Z"
              className="fill-primary-foreground"
            />
            {/* Snow caps */}
            <path
              d="M60 38 L55 48 L60 45 L65 48 Z"
              className="fill-accent/80"
            />
            <path
              d="M75 48 L72 54 L75 52 L78 54 Z"
              className="fill-accent/60"
            />
          </g>
          
          {/* North Star - 8 pointed */}
          <g 
            filter={active ? "url(#glow)" : "none"}
            style={{
              transform: `scale(${active ? 1.15 : 1})`,
              transformOrigin: '60px 28px',
              transition: 'transform 0.4s ease-out',
            }}
          >
            {/* Main star points */}
            <polygon
              points="60,20 61.5,25 67,25 62.5,28.5 64.5,34 60,30.5 55.5,34 57.5,28.5 53,25 58.5,25"
              fill="url(#goldGradient)"
            />
            {/* Small accent rays */}
            <line x1="60" y1="18" x2="60" y2="15" className="stroke-accent" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="52" y1="22" x2="50" y2="20" className="stroke-accent/60" strokeWidth="1" strokeLinecap="round" />
            <line x1="68" y1="22" x2="70" y2="20" className="stroke-accent/60" strokeWidth="1" strokeLinecap="round" />
          </g>
          
          {/* "AC" monogram */}
          <g className="font-display" style={{ 
            opacity: active ? 1 : 0.9,
            transition: 'opacity 0.3s ease-out'
          }}>
            <text
              x="60"
              y="72"
              textAnchor="middle"
              className="fill-primary-foreground font-bold"
              style={{ fontSize: '16px', fontFamily: 'var(--font-display), serif' }}
            >
              AC
            </text>
          </g>

          {/* Animated pulse ring */}
          <circle
            cx="60"
            cy="60"
            r="52"
            className="fill-none stroke-accent/40"
            strokeWidth="1"
            style={{
              animation: active ? 'logo-pulse 2s ease-out infinite' : 'none',
            }}
          />
          
          {/* Secondary pulse */}
          <circle
            cx="60"
            cy="60"
            r="52"
            className="fill-none stroke-accent/20"
            strokeWidth="0.5"
            style={{
              animation: active ? 'logo-pulse 2s ease-out infinite 0.5s' : 'none',
            }}
          />
        </svg>
        
        {/* Glow effect behind logo */}
        <div 
          className={`absolute inset-0 rounded-full transition-opacity duration-500 -z-10 ${
            active ? 'opacity-40' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent) / 0.4) 0%, transparent 60%)',
            filter: 'blur(12px)',
            transform: 'scale(1.2)',
          }}
        />
      </div>

      {/* Text */}
      {showText && (
        <div className="min-w-0">
          <h1 
            className={`font-display ${sizeClasses[size].text} font-bold tracking-tight leading-none ${titleColorClass} transition-all duration-300`}
          >
            <span className="relative inline-block">
              The
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-500" />
            </span>{' '}
            <span className="relative inline-block">
              Anchorage
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-500 delay-100" />
            </span>{' '}
            <span className="relative inline-block">
              Chronicle
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-500 delay-200" />
            </span>
          </h1>
          {!compact && (
            <p className={`${sizeClasses[size].sub} mt-1.5 italic ${subtitleColorClass} flex items-center gap-2`}>
              <span className="font-serif">Alaska's Voice Since 2026</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="font-serif">Serving the Last Frontier</span>
            </p>
          )}
        </div>
      )}

      <style>{`
        @keyframes logo-pulse {
          0% { r: 52; opacity: 0.6; stroke-width: 2; }
          100% { r: 58; opacity: 0; stroke-width: 0.5; }
        }
      `}</style>
    </div>
  );
}
