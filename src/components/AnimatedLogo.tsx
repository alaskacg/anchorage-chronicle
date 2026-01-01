import { useId } from 'react';

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
  // Unique IDs for SVG defs to avoid conflicts
  const id = useId();
  const gradientId = `logo-gradient-${id}`;
  const glowId = `logo-glow-${id}`;
  const auroraId = `aurora-gradient-${id}`;
  const starGlowId = `star-glow-${id}`;

  const sizeClasses = {
    sm: { icon: 40, text: 'text-lg sm:text-xl', sub: 'text-[9px] sm:text-[10px]' },
    md: { icon: 56, text: 'text-xl sm:text-2xl md:text-3xl', sub: 'text-[10px] sm:text-xs' },
    lg: { icon: 80, text: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl', sub: 'text-xs sm:text-sm' },
    xl: { icon: 100, text: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl', sub: 'text-sm sm:text-base' },
  };

  const gapClass = compact ? 'gap-2 md:gap-3' : 'gap-2 sm:gap-3 md:gap-4';
  const titleColorClass = variant === 'dark' ? 'text-primary-foreground' : 'text-primary';
  const subtitleColorClass = variant === 'dark' ? 'text-primary-foreground/80' : 'text-muted-foreground';
  const iconSize = sizeClasses[size].icon;

  return (
    <div className={`flex items-center ${gapClass} group cursor-pointer`}>
      {/* Advanced Animated Logo */}
      <div className="relative shrink-0">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 100 100"
          className="transition-transform duration-500 group-hover:scale-110"
        >
          <defs>
            {/* Dynamic gradient for main emblem */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))">
                <animate
                  attributeName="stop-color"
                  values="hsl(var(--primary));hsl(var(--primary) / 0.85);hsl(var(--primary))"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.7)" />
            </linearGradient>

            {/* Aurora borealis gradient */}
            <linearGradient id={auroraId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--secondary))">
                <animate
                  attributeName="offset"
                  values="0;0.3;0"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="hsl(var(--accent))">
                <animate
                  attributeName="offset"
                  values="0.5;0.7;0.5"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="hsl(var(--secondary) / 0.6)" />
            </linearGradient>

            {/* Glow filter for star */}
            <filter id={starGlowId} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feFlood floodColor="hsl(var(--accent))" floodOpacity="0.8" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Outer glow */}
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="hsl(var(--accent))" floodOpacity="0.4" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer rotating compass ring */}
          <g className="logo-compass-ring">
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="hsl(var(--accent) / 0.3)"
              strokeWidth="0.5"
              strokeDasharray="4 3"
            />
            {/* Compass cardinal points */}
            {[0, 90, 180, 270].map((angle) => (
              <line
                key={`cardinal-${angle}`}
                x1="50"
                y1="5"
                x2="50"
                y2="9"
                stroke="hsl(var(--accent))"
                strokeWidth="1.5"
                strokeLinecap="round"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
            {/* Intercardinal points */}
            {[45, 135, 225, 315].map((angle) => (
              <line
                key={`inter-${angle}`}
                x1="50"
                y1="6"
                x2="50"
                y2="8"
                stroke="hsl(var(--muted-foreground) / 0.5)"
                strokeWidth="0.75"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
          </g>

          {/* Inner pulsing ring */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="hsl(var(--accent) / 0.2)"
            strokeWidth="0.5"
            className="logo-inner-pulse"
          />

          {/* Main shield/crest shape */}
          <path
            d="M50 10 
               C68 10, 83 22, 88 40
               C93 58, 88 76, 75 86
               C62 96, 50 96, 50 96
               C50 96, 38 96, 25 86
               C12 76, 7 58, 12 40
               C17 22, 32 10, 50 10Z"
            fill={`url(#${gradientId})`}
            className="logo-shield"
          />

          {/* Aurora borealis waves inside shield */}
          <g className="logo-aurora" clipPath="url(#shield-clip)">
            <path
              d="M15 55 Q32 45, 50 52 T85 48"
              fill="none"
              stroke={`url(#${auroraId})`}
              strokeWidth="2"
              strokeOpacity="0.5"
              className="aurora-wave-1"
            />
            <path
              d="M15 50 Q35 40, 50 47 T85 43"
              fill="none"
              stroke={`url(#${auroraId})`}
              strokeWidth="1.5"
              strokeOpacity="0.4"
              className="aurora-wave-2"
            />
            <path
              d="M15 60 Q30 52, 50 58 T85 54"
              fill="none"
              stroke={`url(#${auroraId})`}
              strokeWidth="1"
              strokeOpacity="0.3"
              className="aurora-wave-3"
            />
          </g>

          {/* Denali-inspired mountain range */}
          <g className="logo-mountains">
            {/* Background range */}
            <path
              d="M18 78 L28 58 L36 65 L50 42 L64 62 L72 55 L82 78 Z"
              fill="hsl(var(--primary-foreground) / 0.25)"
            />
            {/* Foreground main peak (Denali) */}
            <path
              d="M22 78 L35 55 L42 62 L50 38 L58 58 L65 52 L78 78 Z"
              fill="hsl(var(--primary-foreground))"
              className="logo-mountain-main"
            />
            {/* Snow caps with shimmer effect */}
            <path
              d="M50 38 L45 50 L50 47 L55 50 Z"
              fill="hsl(var(--accent))"
              className="logo-snowcap-main"
            />
            <path
              d="M65 52 L62 58 L65 56 L68 58 Z"
              fill="hsl(var(--accent) / 0.7)"
              className="logo-snowcap-side"
            />
          </g>

          {/* North Star - pulsing with glow */}
          <g filter={`url(#${starGlowId})`} className="logo-north-star">
            <polygon
              points="50,12 52,18 58,18 53,22 55,28 50,24 45,28 47,22 42,18 48,18"
              fill="hsl(var(--accent))"
            />
            {/* Star rays */}
            <line x1="50" y1="10" x2="50" y2="6" stroke="hsl(var(--accent))" strokeWidth="1" strokeLinecap="round" className="star-ray" />
            <line x1="42" y1="14" x2="39" y2="11" stroke="hsl(var(--accent) / 0.6)" strokeWidth="0.75" strokeLinecap="round" className="star-ray-side" />
            <line x1="58" y1="14" x2="61" y2="11" stroke="hsl(var(--accent) / 0.6)" strokeWidth="0.75" strokeLinecap="round" className="star-ray-side" />
          </g>

          {/* "AC" Monogram with elegant styling */}
          <g className="logo-monogram">
            <text
              x="50"
              y="75"
              textAnchor="middle"
              fill="hsl(var(--primary-foreground))"
              fontSize="16"
              fontWeight="700"
              fontFamily="var(--font-display), Georgia, serif"
              className="logo-text"
            >
              AC
            </text>
            {/* Decorative underline */}
            <line
              x1="38"
              y1="79"
              x2="62"
              y2="79"
              stroke="hsl(var(--accent) / 0.6)"
              strokeWidth="0.75"
              className="logo-underline"
            />
          </g>

          {/* Emanating pulse rings */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--accent) / 0.4)" strokeWidth="1" className="pulse-ring-1" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--accent) / 0.2)" strokeWidth="0.5" className="pulse-ring-2" />
        </svg>

        {/* Ambient glow behind logo */}
        <div className="absolute inset-0 -z-10 logo-ambient-glow" />
      </div>

      {/* Text */}
      {showText && (
        <div className="min-w-0">
          <h1 className={`font-display ${sizeClasses[size].text} font-bold tracking-tight leading-none ${titleColorClass} transition-all duration-300`}>
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
              <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-accent logo-dot-pulse" />
              <span className="font-serif hidden sm:inline">Serving the Last Frontier</span>
            </p>
          )}
        </div>
      )}

      <style>{`
        /* Compass ring rotation */
        .logo-compass-ring {
          animation: compass-rotate 40s linear infinite;
          transform-origin: 50px 50px;
        }
        @keyframes compass-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Inner pulse ring */
        .logo-inner-pulse {
          animation: inner-pulse 3s ease-in-out infinite;
        }
        @keyframes inner-pulse {
          0%, 100% { r: 42; stroke-opacity: 0.2; }
          50% { r: 43; stroke-opacity: 0.4; }
        }

        /* Shield subtle pulse */
        .logo-shield {
          animation: shield-glow 4s ease-in-out infinite;
        }
        @keyframes shield-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.05); }
        }

        /* Aurora wave animations */
        .aurora-wave-1 {
          animation: aurora-flow-1 8s ease-in-out infinite;
        }
        .aurora-wave-2 {
          animation: aurora-flow-2 10s ease-in-out infinite;
        }
        .aurora-wave-3 {
          animation: aurora-flow-3 12s ease-in-out infinite;
        }
        @keyframes aurora-flow-1 {
          0%, 100% { d: path("M15 55 Q32 45, 50 52 T85 48"); stroke-opacity: 0.5; }
          50% { d: path("M15 53 Q35 48, 50 50 T85 50"); stroke-opacity: 0.7; }
        }
        @keyframes aurora-flow-2 {
          0%, 100% { d: path("M15 50 Q35 40, 50 47 T85 43"); stroke-opacity: 0.4; }
          50% { d: path("M15 48 Q38 43, 50 45 T85 45"); stroke-opacity: 0.6; }
        }
        @keyframes aurora-flow-3 {
          0%, 100% { d: path("M15 60 Q30 52, 50 58 T85 54"); stroke-opacity: 0.3; }
          50% { d: path("M15 58 Q33 55, 50 56 T85 56"); stroke-opacity: 0.5; }
        }

        /* Mountain shimmer */
        .logo-mountain-main {
          animation: mountain-shimmer 6s ease-in-out infinite;
        }
        @keyframes mountain-shimmer {
          0%, 100% { fill-opacity: 1; }
          50% { fill-opacity: 0.95; }
        }

        /* Snow cap sparkle */
        .logo-snowcap-main {
          animation: snowcap-sparkle 3s ease-in-out infinite;
        }
        .logo-snowcap-side {
          animation: snowcap-sparkle 3s ease-in-out infinite 0.5s;
        }
        @keyframes snowcap-sparkle {
          0%, 100% { fill-opacity: 0.85; }
          50% { fill-opacity: 1; filter: brightness(1.2); }
        }

        /* North Star pulsing */
        .logo-north-star {
          animation: star-pulse 2.5s ease-in-out infinite;
          transform-origin: 50px 20px;
        }
        @keyframes star-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        /* Star rays */
        .star-ray {
          animation: ray-pulse 2s ease-in-out infinite;
        }
        .star-ray-side {
          animation: ray-pulse 2s ease-in-out infinite 0.3s;
        }
        @keyframes ray-pulse {
          0%, 100% { stroke-opacity: 0.6; }
          50% { stroke-opacity: 1; }
        }

        /* Monogram text effect */
        .logo-text {
          animation: text-glow 4s ease-in-out infinite;
        }
        @keyframes text-glow {
          0%, 100% { fill-opacity: 1; }
          50% { fill-opacity: 0.9; }
        }

        /* Underline animation */
        .logo-underline {
          animation: underline-shimmer 3s ease-in-out infinite;
        }
        @keyframes underline-shimmer {
          0%, 100% { stroke-opacity: 0.6; }
          50% { stroke-opacity: 1; x1: 36; x2: 64; }
        }

        /* Pulse rings emanating outward */
        .pulse-ring-1 {
          animation: pulse-ring 3.5s ease-out infinite;
        }
        .pulse-ring-2 {
          animation: pulse-ring 3.5s ease-out infinite 1.75s;
        }
        @keyframes pulse-ring {
          0% { r: 44; stroke-opacity: 0.5; stroke-width: 1.5; }
          100% { r: 52; stroke-opacity: 0; stroke-width: 0.25; }
        }

        /* Ambient glow */
        .logo-ambient-glow {
          background: radial-gradient(circle, hsl(var(--accent) / 0.25) 0%, transparent 60%);
          filter: blur(12px);
          transform: scale(1.4);
          animation: ambient-pulse 5s ease-in-out infinite;
        }
        @keyframes ambient-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1.4); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }

        /* Dot pulse for tagline */
        .logo-dot-pulse {
          animation: dot-pulse 2s ease-in-out infinite;
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
