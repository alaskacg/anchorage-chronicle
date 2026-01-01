import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface SectionHeroProps {
  title: string;
  description: string;
  imageUrl: string;
  breadcrumbs?: { label: string; href: string }[];
}

export function SectionHero({ title, description, imageUrl, breadcrumbs }: SectionHeroProps) {
  return (
    <section className="relative h-[40vh] md:h-[50vh] min-h-[300px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="container mx-auto px-4 pb-8 md:pb-12">
          {/* Breadcrumbs */}
          {breadcrumbs && (
            <nav className="flex items-center gap-2 text-sm text-primary-foreground/80 mb-4">
              <Link to="/" className="flex items-center gap-1 transition-opacity hover:opacity-80">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.href} className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-accent font-medium">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.href} className="transition-opacity hover:opacity-80">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          )}

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-3 drop-shadow-lg">
            {title}
          </h1>
          <p className="font-serif text-lg md:text-xl text-primary-foreground/90 max-w-2xl drop-shadow-md">
            {description}
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
    </section>
  );
}
