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
  const id = useId();
  const gradientId = `logo-grad-${id}`;
  const glowId = `logo-glow-${id}`;
  const maskId = `logo-mask-${id}`;

  const sizeClasses = {
    sm: { icon: 36, text: 'text-lg sm:text-xl', sub: 'text-[9px] sm:text-[10px]' },
    md: { icon: 48, text: 'text-xl sm:text-2xl md:text-3xl', sub: 'text-[10px] sm:text-xs' },
    lg: { icon: 72, text: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl', sub: 'text-xs sm:text-sm' },
    xl: { icon: 90, text: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl', sub: 'text-sm sm:text-base' },
  };

  const gapClass = compact ? 'gap-2 md:gap-3' : 'gap-2 sm:gap-3 md:gap-4';
  const titleColorClass = variant === 'dark' ? 'text-primary-foreground' : 'text-primary';
  const subtitleColorClass = variant === 'dark' ? 'text-primary-foreground/80' : 'text-muted-foreground';
  const iconSize = sizeClasses[size].icon;

  return (
    <div className={`flex items-center ${gapClass} group cursor-pointer`}>
      {/* Modern Geometric Mountain & Northern Star Logo */}
      <div className="relative shrink-0">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 80 80"
          className="transition-transform duration-500 group-hover:scale-105"
        >
          <defs>
            {/* Primary gradient */}
            <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="1" />
            </linearGradient>

            {/* Glow filter */}
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Clip mask for snow cap */}
            <clipPath id={maskId}>
              <polygon points="40,12 20,52 60,52" />
            </clipPath>
          </defs>

          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r="38"
            fill="hsl(var(--primary) / 0.04)"
            stroke="hsl(var(--primary) / 0.12)"
            strokeWidth="1"
            className="logo-bg-circle"
          />

          {/* Main mountain peak */}
          <polygon
            points="40,12 18,56 62,56"
            fill={`url(#${gradientId})`}
            className="logo-mountain"
          />

          {/* Secondary peak (left) */}
          <polygon
            points="24,32 10,56 38,56"
            fill="hsl(var(--primary) / 0.5)"
            className="logo-peak-left"
          />

          {/* Secondary peak (right) */}
          <polygon
            points="56,28 72,56 42,56"
            fill="hsl(var(--primary) / 0.4)"
            className="logo-peak-right"
          />

          {/* Snow cap on main peak */}
          <polygon
            points="40,12 32,28 48,28"
            fill="hsl(var(--card))"
            stroke="hsl(var(--primary) / 0.2)"
            strokeWidth="0.5"
            className="logo-snow"
          />

          {/* Northern star / Polaris */}
          <g className="logo-star" filter={`url(#${glowId})`}>
            {/* Star burst */}
            <line x1="40" y1="2" x2="40" y2="10" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="35" y1="6" x2="45" y2="6" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="36" y1="3" x2="44" y2="9" stroke="hsl(var(--accent))" strokeWidth="0.75" strokeLinecap="round" />
            <line x1="44" y1="3" x2="36" y2="9" stroke="hsl(var(--accent))" strokeWidth="0.75" strokeLinecap="round" />
            {/* Center glow */}
            <circle cx="40" cy="6" r="2" fill="hsl(var(--accent))" className="star-core" />
          </g>

          {/* Reflection line at base */}
          <line
            x1="12"
            y1="60"
            x2="68"
            y2="60"
            stroke="hsl(var(--primary) / 0.25)"
            strokeWidth="1"
            strokeLinecap="round"
            className="logo-baseline"
          />

          {/* Aurora streaks above mountains */}
          <g className="logo-aurora">
            <path
              d="M8 20 Q25 15, 40 18 Q55 21, 72 16"
              fill="none"
              stroke="hsl(var(--secondary) / 0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="aurora-1"
            />
            <path
              d="M10 26 Q28 22, 45 25 Q62 28, 70 23"
              fill="none"
              stroke="hsl(var(--accent) / 0.3)"
              strokeWidth="1"
              strokeLinecap="round"
              className="aurora-2"
            />
          </g>

          {/* Small accent dots */}
          <circle cx="16" cy="64" r="1" fill="hsl(var(--accent) / 0.5)" className="accent-dot" />
          <circle cx="64" cy="64" r="1" fill="hsl(var(--accent) / 0.5)" className="accent-dot" />
        </svg>

        {/* Ambient glow behind logo */}
        <div className="absolute inset-0 -z-10 logo-ambient-glow" />
      </div>

      {/* Text */}
      {showText && (
        <div className="min-w-0">
          <h1 className={`font-display ${sizeClasses[size].text} font-bold tracking-tight leading-none ${titleColorClass} transition-all duration-300`}>
            <span className="inline-block hover-lift">The</span>{' '}
            <span className="inline-block hover-lift delay-1">Anchorage</span>{' '}
            <span className="inline-block hover-lift delay-2">Chronicle</span>
          </h1>
          {!compact && (
            <p className={`${sizeClasses[size].sub} mt-1 sm:mt-1.5 ${subtitleColorClass} flex items-center gap-1 sm:gap-2 flex-wrap font-sans tracking-widest uppercase`}>
              <span>Alaska's Voice Since 2026</span>
              <span className="inline-block w-1 h-1 rounded-full bg-accent tagline-dot" />
              <span className="hidden sm:inline">Serving the Last Frontier</span>
            </p>
          )}
        </div>
      )}

      <style>{`
        /* Background circle subtle pulse */
        .logo-bg-circle {
          animation: bg-pulse 6s ease-in-out infinite;
        }
        @keyframes bg-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Mountain entrance and hover */
        .logo-mountain {
          transform-origin: 40px 56px;
          animation: mountain-breathe 8s ease-in-out infinite;
        }
        @keyframes mountain-breathe {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.02); }
        }

        .logo-peak-left, .logo-peak-right {
          animation: peak-sway 10s ease-in-out infinite;
        }
        .logo-peak-right {
          animation-delay: -5s;
        }
        @keyframes peak-sway {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.4; }
        }

        /* Snow cap shimmer */
        .logo-snow {
          animation: snow-shimmer 4s ease-in-out infinite;
        }
        @keyframes snow-shimmer {
          0%, 100% { opacity: 0.95; }
          50% { opacity: 1; }
        }

        /* Northern star twinkle */
        .logo-star {
          animation: star-twinkle 2s ease-in-out infinite;
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
        .star-core {
          animation: star-glow 1.5s ease-in-out infinite;
        }
        @keyframes star-glow {
          0%, 100% { r: 2; opacity: 1; }
          50% { r: 2.5; opacity: 0.8; }
        }

        /* Aurora wave animations */
        .aurora-1 {
          animation: aurora-wave-1 6s ease-in-out infinite;
        }
        .aurora-2 {
          animation: aurora-wave-2 7s ease-in-out infinite;
        }
        @keyframes aurora-wave-1 {
          0%, 100% { 
            d: path("M8 20 Q25 15, 40 18 Q55 21, 72 16");
            opacity: 0.4;
          }
          50% { 
            d: path("M8 18 Q25 22, 40 16 Q55 20, 72 18");
            opacity: 0.6;
          }
        }
        @keyframes aurora-wave-2 {
          0%, 100% { 
            d: path("M10 26 Q28 22, 45 25 Q62 28, 70 23");
            opacity: 0.3;
          }
          50% { 
            d: path("M10 24 Q28 28, 45 23 Q62 26, 70 25");
            opacity: 0.5;
          }
        }

        /* Baseline subtle animation */
        .logo-baseline {
          animation: baseline-glow 5s ease-in-out infinite;
        }
        @keyframes baseline-glow {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.4; }
        }

        /* Accent dots */
        .accent-dot {
          animation: dot-fade 3s ease-in-out infinite;
        }
        .accent-dot:last-of-type {
          animation-delay: 1.5s;
        }
        @keyframes dot-fade {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        /* Ambient glow */
        .logo-ambient-glow {
          background: radial-gradient(circle, hsl(var(--accent) / 0.1) 0%, transparent 60%);
          filter: blur(6px);
          transform: scale(1.3);
          animation: ambient-breathe 5s ease-in-out infinite;
        }
        @keyframes ambient-breathe {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }

        /* Text hover effects */
        .hover-lift {
          transition: transform 0.3s ease, color 0.3s ease;
        }
        .group:hover .hover-lift {
          transform: translateY(-1px);
        }
        .group:hover .hover-lift.delay-1 {
          transition-delay: 0.05s;
        }
        .group:hover .hover-lift.delay-2 {
          transition-delay: 0.1s;
        }

        /* Tagline dot pulse */
        .tagline-dot {
          animation: tagline-pulse 2.5s ease-in-out infinite;
        }
        @keyframes tagline-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
