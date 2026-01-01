import { useEffect, useState } from 'react';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  /**
   * Color context for the lockup.
   * - light: placed on light backgrounds (use dark/primary text)
   * - dark: placed on dark backgrounds (use primary-foreground text)
   */
  variant?: 'light' | 'dark';
  /** When true, use a tighter lockup for compact headers (homepage). */
  compact?: boolean;
}

export function AnimatedLogo({
  size = 'md',
  showText = true,
  variant = 'light',
  compact = false,
}: AnimatedLogoProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger initial animation
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const sizeClasses = {
    sm: { icon: 'h-10 w-10', text: 'text-xl', sub: 'text-[10px]' },
    md: { icon: 'h-14 w-14', text: 'text-2xl md:text-3xl', sub: 'text-xs' },
    lg: { icon: 'h-18 w-18', text: 'text-3xl md:text-4xl lg:text-5xl', sub: 'text-sm' },
    xl: { icon: 'h-24 w-24', text: 'text-4xl md:text-5xl lg:text-6xl', sub: 'text-base' },
  };

  const iconSizes = {
    sm: 40,
    md: 56,
    lg: 72,
    xl: 96,
  };

  const gapClass = compact ? 'gap-2 md:gap-3' : 'gap-3 md:gap-4';

  const titleColorClass = variant === 'dark' ? 'text-primary-foreground' : 'text-primary';
  const subtitleColorClass =
    variant === 'dark' ? 'text-primary-foreground/80' : 'text-muted-foreground';

  const iconSize = iconSizes[size];

  return (
    <div 
      className={`flex items-center ${gapClass} group cursor-pointer`}
      onMouseEnter={() => setIsAnimating(true)}
      onMouseLeave={() => setIsAnimating(false)}
    >
      {/* Animated Logo Icon */}
      <div className="relative shrink-0">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 100 100"
          className={`transition-transform duration-500 ${isAnimating ? 'scale-110' : 'scale-100'}`}
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="46"
            className="fill-primary stroke-primary"
            strokeWidth="2"
          />
          
          {/* Inner ring */}
          <circle
            cx="50"
            cy="50"
            r="38"
            className="fill-none stroke-accent"
            strokeWidth="2"
            strokeDasharray="4 2"
            style={{
              animation: isAnimating ? 'spin 8s linear infinite' : 'none',
            }}
          />
          
          {/* Mountain silhouette */}
          <path
            d="M20 70 L35 45 L45 55 L60 30 L80 70 Z"
            className="fill-primary-foreground"
            style={{
              transform: isAnimating ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'transform 0.5s ease-out',
            }}
          />
          
          {/* Star/North Star */}
          <g 
            className="origin-center"
            style={{
              transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s ease-out',
            }}
          >
            <polygon
              points="50,15 52,22 60,22 54,27 56,35 50,30 44,35 46,27 40,22 48,22"
              className="fill-accent"
            />
          </g>
          
          {/* Animated pulse ring */}
          <circle
            cx="50"
            cy="50"
            r="44"
            className="fill-none stroke-accent/30"
            strokeWidth="1"
            style={{
              animation: isAnimating ? 'pulse-ring 2s ease-out infinite' : 'none',
            }}
          />
        </svg>
        
        {/* Glow effect */}
        <div 
          className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
            isAnimating ? 'opacity-30' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)',
            filter: 'blur(8px)',
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
              <span className="inline-block w-1 h-1 rounded-full bg-accent animate-pulse" />
              <span className="font-serif">Serving the Last Frontier</span>
            </p>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0% { r: 44; opacity: 0.5; }
          100% { r: 50; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
