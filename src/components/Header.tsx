import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, Cloud, Sun, CloudRain, Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedLogo } from '@/components/AnimatedLogo';

const navItems = [
  { label: 'Local', href: '/section/local' },
  { label: 'State', href: '/section/state' },
  { label: 'Politics', href: '/section/politics' },
  { label: 'Business', href: '/section/business' },
  { label: 'Sports', href: '/section/sports' },
  { label: 'Outdoors', href: '/section/outdoors' },
  { label: 'Community', href: '/section/community' },
  { label: 'Weather', href: '/weather' },
];

interface HeaderProps {
  currentTemp?: number;
  weatherCondition?: string;
}

const WeatherIcon = ({ condition }: { condition?: string }) => {
  switch (condition?.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return <Sun className="h-4 w-4" />;
    case 'rain':
    case 'rainy':
      return <CloudRain className="h-4 w-4" />;
    case 'snow':
    case 'snowy':
      return <Snowflake className="h-4 w-4" />;
    default:
      return <Cloud className="h-4 w-4" />;
  }
};

export function Header({ currentTemp = 28, weatherCondition = 'Partly Cloudy' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-card border-b border-border">
      {/* Top bar with date and weather */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <span className="font-sans">{dateString}</span>
          <Link to="/weather" className="flex items-center gap-2 font-sans hover:text-accent transition-colors">
            <WeatherIcon condition={weatherCondition} />
            <span>Anchorage: {currentTemp}°F</span>
            <span className="hidden sm:inline">• {weatherCondition}</span>
          </Link>
        </div>
      </div>

      {/* Masthead */}
      <div className="container mx-auto px-4 py-6 text-center border-b border-border">
        <Link to="/" className="inline-block">
          <AnimatedLogo size="lg" showText={true} variant="dark" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center py-3 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="px-4 py-2 text-sm font-sans font-medium text-foreground hover:text-accent transition-colors relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent transition-all group-hover:w-3/4" />
            </Link>
          ))}
          <Button variant="ghost" size="icon" className="ml-4">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center justify-between py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="px-4 py-3 text-sm font-sans font-medium text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
