import { useState } from 'react';

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
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: { icon: 'h-10 w-10', text: 'text-lg sm:text-xl', sub: 'text-[9px] sm:text-[10px]' },
    md: { icon: 'h-14 w-14', text: 'text-xl sm:text-2xl md:text-3xl', sub: 'text-[10px] sm:text-xs' },
    lg: { icon: 'h-18 w-18', text: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl', sub: 'text-xs sm:text-sm' },
    xl: { icon: 'h-24 w-24', text: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl', sub: 'text-sm sm:text-base' },
  };

  const iconSizes = {
    sm: 40,
    md: 52,
    lg: 72,
    xl: 96,
  };

  const gapClass = compact ? 'gap-2 md:gap-3' : 'gap-2 sm:gap-3 md:gap-4';
  const titleColorClass = variant === 'dark' ? 'text-primary-foreground' : 'text-primary';
  const subtitleColorClass = variant === 'dark' ? 'text-primary-foreground/80' : 'text-muted-foreground';
  const iconSize = iconSizes[size];

  return (
    <div 
      className={`flex items-center ${gapClass} group cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Logo Icon - Always animating */}
      <div className="relative shrink-0">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 120 120"
          className={`transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        >
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.8)" />
            </linearGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--accent))" />
              <stop offset="100%" stopColor="hsl(var(--accent) / 0.7)" />
            </linearGradient>
            <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Outer rotating ring - always spinning */}
          <circle
            cx="60"
            cy="60"
            r="56"
            className="fill-none stroke-accent/30"
            strokeWidth="1"
            strokeDasharray="8 4"
            style={{
              animation: 'logo-spin 20s linear infinite',
              transformOrigin: '60px 60px',
            }}
          />
          
          {/* Compass tick marks - rotate opposite direction */}
          <g style={{
            animation: 'logo-spin-reverse 30s linear infinite',
            transformOrigin: '60px 60px',
          }}>
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
          
          {/* Main shield shape */}
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

          {/* Mountain range */}
          <g>
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
            {/* Snow caps with shimmer */}
            <path
              d="M60 38 L55 48 L60 45 L65 48 Z"
              className="fill-accent"
              style={{
                animation: 'logo-shimmer 3s ease-in-out infinite',
              }}
            />
            <path
              d="M75 48 L72 54 L75 52 L78 54 Z"
              className="fill-accent/70"
              style={{
                animation: 'logo-shimmer 3s ease-in-out infinite 0.5s',
              }}
            />
          </g>
          
          {/* North Star - pulsing */}
          <g filter="url(#starGlow)">
            <polygon
              points="60,18 62,24 68,24 63,28 65,35 60,30 55,35 57,28 52,24 58,24"
              fill="url(#goldGradient)"
              style={{
                animation: 'logo-star-pulse 2s ease-in-out infinite',
                transformOrigin: '60px 26px',
              }}
            />
            {/* Star rays */}
            <line x1="60" y1="16" x2="60" y2="12" className="stroke-accent" strokeWidth="1.5" strokeLinecap="round"
              style={{ animation: 'logo-ray-pulse 2s ease-in-out infinite' }}
            />
            <line x1="51" y1="20" x2="48" y2="17" className="stroke-accent/60" strokeWidth="1" strokeLinecap="round"
              style={{ animation: 'logo-ray-pulse 2s ease-in-out infinite 0.3s' }}
            />
            <line x1="69" y1="20" x2="72" y2="17" className="stroke-accent/60" strokeWidth="1" strokeLinecap="round"
              style={{ animation: 'logo-ray-pulse 2s ease-in-out infinite 0.6s' }}
            />
          </g>
          
          {/* "AC" monogram */}
          <text
            x="60"
            y="72"
            textAnchor="middle"
            className="fill-primary-foreground font-bold"
            style={{ fontSize: '14px', fontFamily: 'var(--font-display), serif' }}
          >
            AC
          </text>

          {/* Continuous pulse rings */}
          <circle
            cx="60"
            cy="60"
            r="52"
            className="fill-none stroke-accent/40"
            strokeWidth="1"
            style={{
              animation: 'logo-pulse-ring 3s ease-out infinite',
            }}
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            className="fill-none stroke-accent/20"
            strokeWidth="0.5"
            style={{
              animation: 'logo-pulse-ring 3s ease-out infinite 1.5s',
            }}
          />
        </svg>
        
        {/* Ambient glow - always on */}
        <div 
          className="absolute inset-0 rounded-full -z-10"
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent) / 0.25) 0%, transparent 60%)',
            filter: 'blur(10px)',
            transform: 'scale(1.3)',
            animation: 'logo-glow-pulse 4s ease-in-out infinite',
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
            <p className={`${sizeClasses[size].sub} mt-1 sm:mt-1.5 italic ${subtitleColorClass} flex items-center gap-1 sm:gap-2 flex-wrap`}>
              <span className="font-serif">Alaska's Voice Since 2026</span>
              <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-accent" style={{ animation: 'logo-dot-pulse 2s ease-in-out infinite' }} />
              <span className="font-serif hidden sm:inline">Serving the Last Frontier</span>
            </p>
          )}
        </div>
      )}

      <style>{`
        @keyframes logo-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes logo-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes logo-pulse-ring {
          0% { r: 52; opacity: 0.5; stroke-width: 1.5; }
          100% { r: 60; opacity: 0; stroke-width: 0.5; }
        }
        @keyframes logo-star-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.9; }
        }
        @keyframes logo-ray-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes logo-shimmer {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes logo-glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1.3); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes logo-dot-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
