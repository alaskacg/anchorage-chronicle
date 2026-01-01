import logoIcon from '@/assets/logo-icon.png';

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
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
  };

  // Slightly larger type overall for legibility
  const textSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl md:text-6xl',
    xl: 'text-6xl md:text-7xl',
  };

  const subTextSizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm md:text-base',
    xl: 'text-base md:text-lg',
  };

  const gapClass = compact ? 'gap-2 md:gap-3' : 'gap-3 md:gap-4';

  const titleColorClass = variant === 'dark' ? 'text-primary-foreground' : 'text-primary';
  const subtitleColorClass =
    variant === 'dark' ? 'text-primary-foreground/80' : 'text-muted-foreground';

  return (
    <div className={`flex items-center ${gapClass}`}>
      {/* Logo Icon */}
      <div className="relative shrink-0">
        <img
          src={logoIcon}
          alt="The Anchorage Chronicle logo"
          className={`${sizeClasses[size]} w-auto relative z-10 motion-safe:animate-[pulse_6s_ease-in-out_infinite]`}
          style={{
            filter: 'none',
          }}
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Text */}
      {showText && (
        <div className="min-w-0">
          <h1 className={`font-display ${textSizes[size]} font-bold tracking-tight leading-none ${titleColorClass}`}>
            The Anchorage Chronicle
          </h1>
          {!compact && (
            <p className={`${subTextSizes[size]} mt-1 italic ${subtitleColorClass}`}>
              <span className="font-serif">Alaska's Voice Since 2026</span>
              <span className="mx-2">•</span>
              <span className="font-serif">Serving the Last Frontier</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
