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
  const inkGradient = `ink-gradient-${id}`;
  const auroraGradient = `aurora-grad-${id}`;
  const paperGlow = `paper-glow-${id}`;

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
      {/* Elegant Quill & Ink Chronicle Logo */}
      <div className="relative shrink-0">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 100 100"
          className="transition-transform duration-500 group-hover:scale-105"
        >
          <defs>
            {/* Deep ink gradient */}
            <linearGradient id={inkGradient} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="50%" stopColor="hsl(var(--primary) / 0.9)" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.7)" />
            </linearGradient>

            {/* Aurora accent gradient */}
            <linearGradient id={auroraGradient} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--secondary))" />
              <stop offset="50%" stopColor="hsl(var(--accent))" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </linearGradient>

            {/* Soft glow filter */}
            <filter id={paperGlow} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer circle - thin elegant border */}
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="hsl(var(--primary) / 0.15)"
            strokeWidth="1"
            className="logo-outer-ring"
          />

          {/* Inner circle with subtle fill */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="hsl(var(--primary) / 0.03)"
            stroke="hsl(var(--primary) / 0.1)"
            strokeWidth="0.5"
          />

          {/* Elegant quill pen - the main element */}
          <g className="logo-quill" filter={`url(#${paperGlow})`}>
            {/* Quill body - sweeping curve */}
            <path
              d="M25 75 
                 Q30 65, 35 55 
                 Q40 45, 50 35 
                 Q60 25, 75 18"
              fill="none"
              stroke={`url(#${inkGradient})`}
              strokeWidth="3"
              strokeLinecap="round"
              className="quill-stroke"
            />
            
            {/* Quill feather detail */}
            <path
              d="M75 18 
                 Q72 22, 68 24
                 Q73 20, 75 18
                 Q77 16, 82 14
                 Q78 17, 75 18"
              fill="hsl(var(--primary))"
              className="quill-feather"
            />
            
            {/* Feather barbs */}
            <path
              d="M70 22 Q74 20, 78 17"
              fill="none"
              stroke="hsl(var(--primary) / 0.5)"
              strokeWidth="0.75"
            />
            <path
              d="M68 25 Q73 22, 77 18"
              fill="none"
              stroke="hsl(var(--primary) / 0.4)"
              strokeWidth="0.5"
            />
          </g>

          {/* Ink drop with ripple effect */}
          <g className="logo-ink-drop">
            <circle
              cx="25"
              cy="75"
              r="4"
              fill="hsl(var(--primary))"
              className="ink-drop-main"
            />
            {/* Ripple rings */}
            <circle
              cx="25"
              cy="75"
              r="6"
              fill="none"
              stroke="hsl(var(--primary) / 0.3)"
              strokeWidth="0.75"
              className="ink-ripple-1"
            />
            <circle
              cx="25"
              cy="75"
              r="10"
              fill="none"
              stroke="hsl(var(--primary) / 0.15)"
              strokeWidth="0.5"
              className="ink-ripple-2"
            />
          </g>

          {/* Stylized "A" letterform - representing Alaska/Anchorage */}
          <g className="logo-letter-a">
            <path
              d="M50 30 L40 60 M50 30 L60 60 M44 50 L56 50"
              fill="none"
              stroke={`url(#${inkGradient})`}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="letter-a-stroke"
            />
          </g>

          {/* Aurora accent line - flowing underneath */}
          <path
            d="M20 82 Q35 78, 50 80 Q65 82, 80 78"
            fill="none"
            stroke={`url(#${auroraGradient})`}
            strokeWidth="2"
            strokeLinecap="round"
            className="aurora-accent"
          />

          {/* Small decorative dots */}
          <circle cx="15" cy="50" r="1.5" fill="hsl(var(--accent) / 0.6)" className="deco-dot-1" />
          <circle cx="85" cy="50" r="1.5" fill="hsl(var(--accent) / 0.6)" className="deco-dot-2" />
          <circle cx="50" cy="90" r="1" fill="hsl(var(--accent) / 0.4)" className="deco-dot-3" />
        </svg>

        {/* Subtle ambient glow */}
        <div className="absolute inset-0 -z-10 logo-glow-ambient" />
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
              <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-accent logo-tagline-dot" />
              <span className="font-serif hidden sm:inline">Serving the Last Frontier</span>
            </p>
          )}
        </div>
      )}

      <style>{`
        /* Outer ring slow rotation */
        .logo-outer-ring {
          animation: ring-rotate 60s linear infinite;
          transform-origin: 50px 50px;
        }
        @keyframes ring-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Quill writing motion */
        .logo-quill {
          animation: quill-write 4s ease-in-out infinite;
          transform-origin: 25px 75px;
        }
        @keyframes quill-write {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          25% { transform: rotate(-2deg) translateY(-1px); }
          50% { transform: rotate(1deg) translateY(1px); }
          75% { transform: rotate(-1deg) translateY(0); }
        }

        /* Quill stroke dash animation */
        .quill-stroke {
          stroke-dasharray: 100;
          stroke-dashoffset: 0;
          animation: quill-flow 8s ease-in-out infinite;
        }
        @keyframes quill-flow {
          0%, 100% { stroke-dashoffset: 0; opacity: 1; }
          50% { stroke-dashoffset: -10; opacity: 0.9; }
        }

        /* Feather shimmer */
        .quill-feather {
          animation: feather-shimmer 3s ease-in-out infinite;
        }
        @keyframes feather-shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        /* Ink drop pulse */
        .ink-drop-main {
          animation: ink-pulse 2.5s ease-in-out infinite;
          transform-origin: 25px 75px;
        }
        @keyframes ink-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        /* Ink ripple animations */
        .ink-ripple-1 {
          animation: ripple-expand 3s ease-out infinite;
        }
        .ink-ripple-2 {
          animation: ripple-expand 3s ease-out infinite 1s;
        }
        @keyframes ripple-expand {
          0% { r: 4; opacity: 0.5; }
          100% { r: 14; opacity: 0; }
        }

        /* Letter A subtle pulse */
        .letter-a-stroke {
          animation: letter-glow 4s ease-in-out infinite;
        }
        @keyframes letter-glow {
          0%, 100% { stroke-opacity: 1; filter: brightness(1); }
          50% { stroke-opacity: 0.9; filter: brightness(1.1); }
        }

        /* Aurora wave flow */
        .aurora-accent {
          animation: aurora-flow 6s ease-in-out infinite;
        }
        @keyframes aurora-flow {
          0%, 100% { 
            d: path("M20 82 Q35 78, 50 80 Q65 82, 80 78"); 
            stroke-opacity: 0.8;
          }
          50% { 
            d: path("M20 80 Q35 84, 50 80 Q65 76, 80 80"); 
            stroke-opacity: 1;
          }
        }

        /* Decorative dots twinkling */
        .deco-dot-1 {
          animation: dot-twinkle 3s ease-in-out infinite;
        }
        .deco-dot-2 {
          animation: dot-twinkle 3s ease-in-out infinite 1s;
        }
        .deco-dot-3 {
          animation: dot-twinkle 3s ease-in-out infinite 2s;
        }
        @keyframes dot-twinkle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }

        /* Ambient glow */
        .logo-glow-ambient {
          background: radial-gradient(circle, hsl(var(--accent) / 0.15) 0%, transparent 70%);
          filter: blur(8px);
          transform: scale(1.2);
          animation: glow-breathe 5s ease-in-out infinite;
        }
        @keyframes glow-breathe {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        /* Tagline dot */
        .logo-tagline-dot {
          animation: tagline-dot-pulse 2s ease-in-out infinite;
        }
        @keyframes tagline-dot-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
