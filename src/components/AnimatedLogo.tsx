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
  const sizeConfig = {
    sm: { iconSize: 24, titleSize: 14, subSize: 8 },
    md: { iconSize: 32, titleSize: 18, subSize: 10 },
    lg: { iconSize: 44, titleSize: 26, subSize: 12 },
    xl: { iconSize: 56, titleSize: 32, subSize: 14 },
  };

  const config = sizeConfig[size];
  const gapClass = compact ? 'gap-2' : 'gap-3';
  const titleColorClass = variant === 'dark' ? 'text-primary-foreground' : 'text-foreground';
  const subtitleColorClass = variant === 'dark' ? 'text-primary-foreground/70' : 'text-muted-foreground';
  const accentClass = variant === 'dark' ? 'text-accent' : 'text-accent';
  const borderClass = variant === 'dark' ? 'border-primary-foreground/30' : 'border-foreground/20';

  return (
    <div className={`flex items-center ${gapClass}`}>
      {/* Iconic mountain peak mark */}
      <div 
        className={`relative flex items-center justify-center border-2 ${borderClass}`}
        style={{ 
          width: config.iconSize, 
          height: config.iconSize,
        }}
      >
        {/* Stylized "A" as mountain peak */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={`${accentClass}`}
          style={{ width: config.iconSize * 0.7, height: config.iconSize * 0.7 }}
        >
          <path 
            d="M12 3L3 21H9L12 15L15 21H21L12 3Z" 
            fill="currentColor"
          />
          <path 
            d="M12 9L9.5 14H14.5L12 9Z" 
            fill={variant === 'dark' ? 'hsl(var(--primary))' : 'hsl(var(--background))'}
          />
        </svg>
      </div>

      {/* Text content */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1.5">
            <span 
              className={`font-display font-light tracking-wider uppercase ${subtitleColorClass}`}
              style={{ fontSize: config.subSize + 2 }}
            >
              The
            </span>
            <h1 
              className={`font-display font-bold tracking-tight uppercase leading-none ${titleColorClass}`}
              style={{ fontSize: config.titleSize }}
            >
              Anchorage Chronicle
            </h1>
          </div>
          {!compact && (
            <p 
              className={`${subtitleColorClass} font-sans tracking-[0.25em] uppercase`}
              style={{ fontSize: config.subSize }}
            >
              Alaska's Independent Voice
            </p>
          )}
        </div>
      )}
    </div>
  );
}
