import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, Cloud, Sun, CloudRain, Snowflake, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { label: 'Local', href: '/section/local' },
  { label: 'State', href: '/section/state' },
  { label: 'Politics', href: '/section/politics' },
  { label: 'Business', href: '/section/business' },
  { label: 'Sports', href: '/section/sports' },
  { label: 'Outdoors', href: '/section/outdoors' },
  { label: 'Community', href: '/section/community' },
  { label: 'Weather', href: '/weather' },
  { label: 'About', href: '/about' },
];

interface HeaderProps {
  currentTemp?: number;
  weatherCondition?: string;
  /** Use a smaller masthead for pages like the homepage */
  compact?: boolean;
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

export function Header({ currentTemp = 28, weatherCondition = 'Partly Cloudy', compact = false }: HeaderProps) {
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
          <Link
            to="/weather"
            className="flex items-center gap-2 font-sans transition-colors hover:text-primary-foreground/90"
          >
            <WeatherIcon condition={weatherCondition} />
            <span>Anchorage: {currentTemp}°F</span>
            <span className="hidden sm:inline">• {weatherCondition}</span>
          </Link>
        </div>
      </div>

      {/* Masthead */}
      <div className="container mx-auto px-4">
        <div
          className={"relative border-b border-border " + (compact ? "py-2" : "py-5")}
          aria-label="Site masthead"
        >
          <Link to="/" className="inline-flex w-full justify-center" aria-label="Home">
            <AnimatedLogo size={compact ? 'md' : 'lg'} showText={true} variant="light" compact={compact} />
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center py-3 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="px-4 py-2 text-sm font-sans font-medium text-foreground transition-colors hover:text-foreground/90"
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-4 flex items-center gap-2">
            <ThemeToggle />
            <Link to="/admin">
              <Button variant="ghost" size="icon" title="Admin Dashboard">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center justify-between py-3">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="px-4 py-3 text-sm font-sans font-medium text-foreground transition-colors hover:bg-muted"
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

