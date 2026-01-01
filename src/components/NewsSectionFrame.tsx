import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface NewsSectionFrameProps {
  title: string;
  href?: string;
  icon?: ReactNode;
  variant?: 'default' | 'accent' | 'secondary' | 'featured';
  children: ReactNode;
  className?: string;
}

export function NewsSectionFrame({
  title,
  href,
  icon,
  variant = 'default',
  children,
  className = '',
}: NewsSectionFrameProps) {
  const variantStyles = {
    default: {
      header: 'bg-primary text-primary-foreground',
      accent: 'bg-accent',
      border: 'border-primary',
    },
    accent: {
      header: 'bg-accent text-accent-foreground',
      accent: 'bg-primary',
      border: 'border-accent',
    },
    secondary: {
      header: 'bg-secondary text-secondary-foreground',
      accent: 'bg-accent',
      border: 'border-secondary',
    },
    featured: {
      header: 'bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground',
      accent: 'bg-accent',
      border: 'border-primary',
    },
  };

  const styles = variantStyles[variant];

  return (
    <section className={`group ${className}`}>
      {/* Header Bar */}
      <div className={`relative ${styles.header} px-4 py-2.5 flex items-center justify-between overflow-hidden`}>
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        
        <div className="flex items-center gap-2 relative z-10">
          {icon && <span className="opacity-80">{icon}</span>}
          <h2 className="font-display text-lg font-bold uppercase tracking-wide">{title}</h2>
        </div>
        
        {href && (
          <Link 
            to={href} 
            className="flex items-center gap-1 text-xs font-sans uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity relative z-10 group/link"
          >
            View All
            <ChevronRight className="h-3 w-3 transform group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        )}
        
        {/* Accent underline */}
        <div className={`absolute bottom-0 left-0 h-0.5 ${styles.accent} w-16 group-hover:w-full transition-all duration-500 ease-out`} />
      </div>
      
      {/* Content Area */}
      <div className={`border-x border-b ${styles.border} bg-card`}>
        {children}
      </div>
    </section>
  );
}
