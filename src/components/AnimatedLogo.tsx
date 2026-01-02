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
    sm: { icon: 32, text: 'text-lg sm:text-xl', sub: 'text-[9px] sm:text-[10px]' },
    md: { icon: 44, text: 'text-xl sm:text-2xl md:text-3xl', sub: 'text-[10px] sm:text-xs' },
    lg: { icon: 64, text: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl', sub: 'text-xs sm:text-sm' },
    xl: { icon: 80, text: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl', sub: 'text-sm sm:text-base' },
  };

  const gapClass = compact ? 'gap-2 md:gap-3' : 'gap-3 sm:gap-4';
  const titleColorClass = variant === 'dark' ? 'text-primary-foreground' : 'text-primary';
  const subtitleColorClass = variant === 'dark' ? 'text-primary-foreground/70' : 'text-muted-foreground';
  const iconSize = sizeClasses[size].icon;

  return (
    <div className={`flex items-center ${gapClass} group`}>
      {/* Simple, elegant monogram-style logo */}
      <div 
        className="relative shrink-0 flex items-center justify-center rounded-sm bg-primary transition-transform duration-300 group-hover:scale-105"
        style={{ width: iconSize, height: iconSize }}
      >
        {/* The letter "A" in an elegant display font style */}
        <span 
          className="font-display font-bold text-primary-foreground leading-none select-none"
          style={{ fontSize: iconSize * 0.6 }}
        >
          A
        </span>
        
        {/* Subtle accent bar at bottom */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-accent"
          style={{ height: Math.max(2, iconSize * 0.04) }}
        />
      </div>

      {/* Text */}
      {showText && (
        <div className="min-w-0">
          <h1 className={`font-display ${sizeClasses[size].text} font-bold tracking-tight leading-none ${titleColorClass}`}>
            The Anchorage Chronicle
          </h1>
          {!compact && (
            <p className={`${sizeClasses[size].sub} mt-1 ${subtitleColorClass} font-sans tracking-wide uppercase`}>
              Alaska's Voice Since 2026
            </p>
          )}
        </div>
      )}
    </div>
  );
}
