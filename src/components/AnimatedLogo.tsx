import { useEffect, useState } from 'react';
import logoIcon from '@/assets/logo-icon.png';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export function AnimatedLogo({ size = 'md', showText = true, variant = 'dark' }: AnimatedLogoProps) {
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
    <div className="flex items-center gap-3 md:gap-4">
      {/* Logo Icon */}
      <div className="relative">
        <img
          src={logoIcon}
          alt="The Anchorage Chronicle"
          className={`${sizeClasses[size]} w-auto relative z-10 transition-opacity duration-300 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            filter: variant === 'light' ? 'brightness(0) invert(1)' : 'none',
          }}
        />
      </div>

      {/* Text */}
      {showText && (
        <div
          className={`transition-opacity duration-300 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h1
            className={`font-display ${textSizes[size]} font-bold tracking-tight ${
              variant === 'light' ? 'text-primary-foreground' : 'text-primary'
            }`}
          >
            The Anchorage Chronicle
          </h1>
          <p
            className={`${subTextSizes[size]} mt-1 italic ${
              variant === 'light' ? 'text-primary-foreground/80' : 'text-muted-foreground'
            }`}
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
