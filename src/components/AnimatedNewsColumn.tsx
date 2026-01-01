import { ReactNode, useEffect, useState, useRef } from 'react';

interface AnimatedNewsColumnProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedNewsColumn({ children, delay = 0, className = '' }: AnimatedNewsColumnProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface StaggeredColumnGridProps {
  children: ReactNode[];
  columns?: number;
  staggerDelay?: number;
  className?: string;
}

export function StaggeredColumnGrid({ 
  children, 
  columns = 3, 
  staggerDelay = 100,
  className = '' 
}: StaggeredColumnGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols] || gridCols[3]} gap-6 ${className}`}>
      {children.map((child, index) => (
        <AnimatedNewsColumn key={index} delay={index * staggerDelay}>
          {child}
        </AnimatedNewsColumn>
      ))}
    </div>
  );
}
