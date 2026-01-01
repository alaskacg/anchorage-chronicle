import { useEffect, useState } from 'react';
import logoIcon from '@/assets/logo-icon.png';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export function AnimatedLogo({ size = 'md', showText = true, variant = 'dark' }: AnimatedLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl md:text-5xl lg:text-6xl',
    xl: 'text-5xl md:text-6xl lg:text-7xl',
  };

  const subTextSizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm md:text-base',
    xl: 'text-base md:text-lg',
  };

  return (
    <div
      className="flex items-center gap-3 md:gap-4 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Logo Icon */}
      <div className="relative">
        {/* Glow Effect */}
        <div
          className={`absolute inset-0 blur-xl transition-all duration-700 ${
            isHovered ? 'opacity-60 scale-125' : 'opacity-0 scale-100'
          }`}
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)',
          }}
        />
        
        {/* Aurora Shimmer Effect */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--secondary) / 0.3) 0%, hsl(var(--accent) / 0.5) 50%, hsl(var(--primary) / 0.3) 100%)',
              borderRadius: '50%',
              filter: 'blur(8px)',
            }}
          />
        </div>

        {/* Main Logo */}
        <img
          src={logoIcon}
          alt="The Anchorage Chronicle"
          className={`${sizeClasses[size]} w-auto relative z-10 transition-transform duration-200 ${
            mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          } ${isHovered ? 'scale-[1.03]' : 'scale-100'}`}
          style={{
            filter: variant === 'light' ? 'brightness(0) invert(1)' : 'none',
          }}
        />

        {/* Sparkle Effects */}
        {isHovered && (
          <>
            <div
              className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-ping"
              style={{ animationDuration: '1s' }}
            />
            <div
              className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-secondary rounded-full animate-ping"
              style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}
            />
            <div
              className="absolute top-1/2 -right-2 w-1 h-1 bg-accent rounded-full animate-ping"
              style={{ animationDuration: '2s', animationDelay: '0.5s' }}
            />
          </>
        )}
      </div>

      {/* Text */}
      {showText && (
        <div
          className={`transition-all duration-500 ${
            mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <h1
            className={`font-display ${textSizes[size]} font-bold tracking-tight ${
              variant === 'light' ? 'text-primary-foreground' : 'text-primary'
            }`}
          >
            <span className="relative">
              The
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${
                  isHovered ? 'w-full' : 'w-0'
                }`}
              />
            </span>{' '}
            <span className="relative inline-block">
              Anchorage
              {/* Gradient overlay on hover */}
              <span
                className={`absolute inset-0 bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text transition-opacity duration-500 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: isHovered ? 'transparent' : 'inherit',
                }}
              >
                Anchorage
              </span>
            </span>{' '}
            <span className="relative">
              Chronicle
              <span
                className={`absolute bottom-0 right-0 h-0.5 bg-accent transition-all duration-300 ${
                  isHovered ? 'w-full' : 'w-0'
                }`}
                style={{ transitionDelay: '100ms' }}
              />
            </span>
          </h1>
          <p
            className={`${subTextSizes[size]} mt-1 italic transition-all duration-300 ${
              variant === 'light' ? 'text-primary-foreground/80' : 'text-muted-foreground'
            } ${isHovered ? 'tracking-wider' : 'tracking-normal'}`}
          >
            <span className="font-serif">Alaska's Voice Since 2026</span>
            <span className="mx-2">•</span>
            <span className="font-serif">Serving the Last Frontier</span>
          </p>
        </div>
      )}
    </div>
  );
}
