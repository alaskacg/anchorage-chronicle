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
  const sizeClasses = {
    sm: { height: 28, text: 'text-lg sm:text-xl', sub: 'text-[9px] sm:text-[10px]' },
    md: { height: 36, text: 'text-xl sm:text-2xl md:text-3xl', sub: 'text-[10px] sm:text-xs' },
    lg: { height: 48, text: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl', sub: 'text-xs sm:text-sm' },
    xl: { height: 56, text: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl', sub: 'text-sm sm:text-base' },
  };

  const gapClass = compact ? 'gap-2' : 'gap-3 sm:gap-4';
  const titleColorClass = variant === 'dark' ? 'text-primary-foreground' : 'text-foreground';
  const subtitleColorClass = variant === 'dark' ? 'text-primary-foreground/60' : 'text-muted-foreground';
  const height = sizeClasses[size].height;

  return (
    <div className={`flex items-center ${gapClass}`}>
      {/* Clean typographic wordmark with accent line */}
      <div className="flex items-center gap-1">
        {/* Accent vertical bar */}
        <div 
          className="bg-accent rounded-sm"
          style={{ width: Math.max(3, height * 0.08), height: height }}
        />
        
        {/* THE text */}
        <span 
          className={`font-display font-black uppercase tracking-tighter leading-none ${titleColorClass}`}
          style={{ fontSize: height * 0.35 }}
        >
          THE
        </span>
      </div>

      {/* Main title */}
      {showText && (
        <div className="min-w-0 flex flex-col justify-center" style={{ height }}>
          <h1 
            className={`font-display font-bold tracking-tight leading-none ${titleColorClass}`}
            style={{ fontSize: height * 0.55 }}
          >
            ANCHORAGE CHRONICLE
          </h1>
          {!compact && (
            <p 
              className={`${subtitleColorClass} font-sans tracking-widest uppercase mt-0.5`}
              style={{ fontSize: height * 0.2 }}
            >
              Alaska's Voice Since 2026
            </p>
          )}
        </div>
      )}
    </div>
  );
}
