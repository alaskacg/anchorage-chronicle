import { useState, useEffect, forwardRef } from 'react';
import { ExternalLink, MapPin, Anchor, Mountain, Briefcase, ChevronRight, Star, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
// Import background images
import akListingsBg from '@/assets/ad-aklistings-bg.jpg';
import consultingBg from '@/assets/ad-consulting-bg.jpg';
import boatsBg from '@/assets/ad-boats-bg.jpg';
import miningBg from '@/assets/ad-mining-bg.jpg';

interface AdConfig {
  id: string;
  name: string;
  slogan: string;
  description: string;
  features: string[];
  url: string;
  bgImage: string;
  accentColor: string;
  icon: React.ReactNode;
  stats?: { label: string; value: string }[];
}

const ads: AdConfig[] = [
  {
    id: 'aklistings',
    name: 'Alaska Listings',
    slogan: "Alaska's Premier Private Marketplace",
    description: 'Buy, sell, and trade across Alaska with verified sellers and a community built by Alaskans, for Alaskans.',
    features: ['13+ Specialized Sites', '8 Major Regions', 'Verified Sellers Only'],
    url: 'https://aklistings.com',
    bgImage: akListingsBg,
    accentColor: 'from-teal-500/90 to-emerald-600/90',
    icon: <MapPin className="h-8 w-8" />,
    stats: [
      { label: 'Regions', value: '8+' },
      { label: 'Sites', value: '13' },
      { label: 'Days Active', value: '60' },
    ],
  },
  {
    id: 'consulting',
    name: 'Alaska Consulting Group',
    slogan: "Navigate Alaska's New Frontier with Confidence",
    description: 'Strategic intelligence and research for those making consequential decisions in Alaska. Complete discretion guaranteed.',
    features: ['Strategic Research', 'Due Diligence', 'Resource Intelligence'],
    url: 'https://alaskaconsultinggroup.com',
    bgImage: consultingBg,
    accentColor: 'from-primary/95 to-slate-900/95',
    icon: <Briefcase className="h-8 w-8" />,
    stats: [
      { label: 'Expertise', value: 'Elite' },
      { label: 'Discretion', value: '100%' },
      { label: 'Success', value: 'Proven' },
    ],
  },
  {
    id: 'boats',
    name: 'Alaskan Boats',
    slogan: "Alaska's Premier Boat Marketplace",
    description: 'From commercial fishing vessels to recreational kayaks—find your perfect vessel for Alaska waters.',
    features: ['Commercial Vessels', 'Fishing Boats', 'Cabin Cruisers'],
    url: 'https://alaskanboats.com',
    bgImage: boatsBg,
    accentColor: 'from-sky-600/90 to-blue-800/90',
    icon: <Anchor className="h-8 w-8" />,
    stats: [
      { label: 'Boat Types', value: '8+' },
      { label: 'Locations', value: '30+' },
      { label: 'Listings', value: '100+' },
    ],
  },
  {
    id: 'mining',
    name: 'Alaska Mining Equipment',
    slogan: 'Gear Up for Gold',
    description: 'Professional mining and prospecting equipment for Alaska. Sluices, dredges, excavators, and everything you need to strike it rich.',
    features: ['Placer Equipment', 'Dredges & Sluices', 'Heavy Machinery'],
    url: 'https://alaskaminingequipment.com',
    bgImage: miningBg,
    accentColor: 'from-amber-600/90 to-yellow-700/90',
    icon: <Mountain className="h-8 w-8" />,
    stats: [
      { label: 'Categories', value: '12+' },
      { label: 'Sellers', value: '50+' },
      { label: 'Equipment', value: '200+' },
    ],
  },
];

interface AdBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'large' | 'medium' | 'small' | 'sidebar';
  adId?: string;
}

export const AdBanner = forwardRef<HTMLDivElement, AdBannerProps>(({ variant = 'large', adId, className, ...props }, ref) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // If specific ad requested, find it
  const ad = adId 
    ? ads.find(a => a.id === adId) || ads[0]
    : ads[currentAdIndex];

  // Rotate ads if no specific ad requested
  useEffect(() => {
    if (adId) return;
    
    const interval = setInterval(() => {
      if (!isHovered) {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentAdIndex((prev) => (prev + 1) % ads.length);
          setIsVisible(true);
        }, 300);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [adId, isHovered]);

  // Initial visibility
  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (variant === 'sidebar') {
    return <SidebarAd ad={ad} isVisible={isVisible} />;
  }

  if (variant === 'small') {
    return <SmallAd ad={ad} isVisible={isVisible} className={className} />;
  }

  if (variant === 'medium') {
    return <MediumAd ad={ad} isVisible={isVisible} className={className} />;
  }

  return (
    <LargeAd 
      ad={ad} 
      isVisible={isVisible} 
      isHovered={isHovered}
      setIsHovered={setIsHovered}
      className={className}
    />
  );
});

AdBanner.displayName = 'AdBanner';

// Large Hero-style Ad
function LargeAd({ 
  ad, 
  isVisible, 
  isHovered, 
  setIsHovered,
  className 
}: { 
  ad: AdConfig; 
  isVisible: boolean; 
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
  className?: string;
}) {
  return (
    <a
      href={ad.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={cn(
        "group relative block w-full overflow-hidden rounded-lg transition-all duration-500",
        "hover:shadow-2xl hover:shadow-primary/20",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with Parallax Effect */}
      <div 
        className={cn(
          "absolute inset-0 bg-cover bg-center transition-transform duration-700",
          isHovered ? "scale-110" : "scale-100"
        )}
        style={{ backgroundImage: `url(${ad.bgImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r transition-opacity duration-500",
        ad.accentColor,
        isHovered ? "opacity-95" : "opacity-85"
      )} />

      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px] animate-pulse" />
      </div>

      {/* Content */}
      <div className={cn(
        "relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-9 text-white",
        "transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
          {/* Logo/Icon */}
          <div className={cn(
            "inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4",
            "bg-white/20 backdrop-blur-sm border border-white/30",
            "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          )}>
            {ad.icon}
          </div>

          {/* Brand Name */}
          <h3 className="font-display text-3xl md:text-4xl font-bold mb-2 tracking-tight">
            {ad.name}
          </h3>

          {/* Slogan with animated underline */}
          <p className="text-lg md:text-xl font-medium text-white/90 mb-4 relative inline-block">
            {ad.slogan}
            <span className={cn(
              "absolute bottom-0 left-0 h-0.5 bg-white/60 transition-all duration-500",
              isHovered ? "w-full" : "w-0"
            )} />
          </p>

          {/* Description */}
          <p className="text-white/80 max-w-xl mb-6 font-sans leading-relaxed">
            {ad.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
            {ad.features.map((feature, i) => (
              <span 
                key={i}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium",
                  "bg-white/20 backdrop-blur-sm border border-white/30",
                  "transition-all duration-300 hover:bg-white/30",
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Right Content - Stats & CTA */}
        <div className="flex flex-col items-center md:items-end gap-6">
          {/* Stats */}
          {ad.stats && (
            <div className="flex gap-6">
              {ad.stats.map((stat, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20",
                    "transition-all duration-300 hover:bg-white/20 hover:scale-105"
                  )}
                >
                  <div className="text-2xl font-bold font-display">{stat.value}</div>
                  <div className="text-xs text-white/70 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <button className={cn(
            "flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg",
            "bg-white text-gray-900 shadow-lg",
            "transition-all duration-300",
            "hover:shadow-xl hover:scale-105",
            "group-hover:bg-accent group-hover:text-primary"
          )}>
            Visit {ad.name}
            <ChevronRight className={cn(
              "h-5 w-5 transition-transform duration-300",
              "group-hover:translate-x-1"
            )} />
          </button>

          {/* Sponsored Label */}
          <span className="text-xs text-white/50 uppercase tracking-widest flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            Sponsored
          </span>
        </div>
      </div>

      {/* Shimmer Effect on Hover */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-500 pointer-events-none",
        "bg-gradient-to-r from-transparent via-white/10 to-transparent",
        "-translate-x-full group-hover:translate-x-full",
        "transition-transform duration-1000"
      )} />
    </a>
  );
}

// Medium Card-style Ad
function MediumAd({ ad, isVisible, className }: { ad: AdConfig; isVisible: boolean; className?: string }) {
  return (
    <a
      href={ad.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={cn(
        "group relative block overflow-hidden rounded-lg transition-all duration-500",
        "hover:shadow-xl hover:shadow-primary/10",
        className
      )}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${ad.bgImage})` }}
      />
      <div className={cn("absolute inset-0 bg-gradient-to-t", ad.accentColor)} />

      {/* Content */}
      <div className={cn(
        "relative z-10 p-6 text-white min-h-[200px] flex flex-col justify-end",
        "transition-all duration-500",
        isVisible ? "opacity-100" : "opacity-0"
      )}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
            {ad.icon}
          </div>
          <h4 className="font-display text-xl font-bold">{ad.name}</h4>
        </div>
        <p className="text-sm text-white/80 mb-3 line-clamp-2">{ad.slogan}</p>
        <div className="flex items-center gap-2 text-sm font-medium group-hover:text-accent transition-colors">
          Learn More <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </a>
  );
}

// Small Inline Ad
function SmallAd({ ad, isVisible, className }: { ad: AdConfig; isVisible: boolean; className?: string }) {
  return (
    <a
      href={ad.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={cn(
        "group flex items-center gap-4 p-4 rounded-lg transition-all duration-300",
        "bg-card border border-border hover:border-primary/30 hover:shadow-lg",
        className
      )}
    >
      {/* Thumbnail */}
      <div 
        className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0"
        style={{ backgroundImage: `url(${ad.bgImage})` }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h5 className="font-display font-bold text-foreground truncate">{ad.name}</h5>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider px-1.5 py-0.5 bg-muted rounded">Ad</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">{ad.slogan}</p>
      </div>

      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
    </a>
  );
}

// Sidebar Ad
function SidebarAd({ ad, isVisible }: { ad: AdConfig; isVisible: boolean }) {
  return (
    <a
      href={ad.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group block overflow-hidden rounded-lg border border-border bg-card hover:shadow-xl transition-all duration-500"
    >
      {/* Image Header */}
      <div 
        className="h-32 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${ad.bgImage})` }}
      />

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={cn(
            "p-1.5 rounded bg-gradient-to-br text-white",
            ad.id === 'aklistings' && "from-teal-500 to-emerald-600",
            ad.id === 'consulting' && "from-primary to-slate-700",
            ad.id === 'boats' && "from-sky-500 to-blue-700",
            ad.id === 'mining' && "from-amber-500 to-yellow-600"
          )}>
            {ad.icon}
          </div>
          <div>
            <h5 className="font-display font-bold text-sm text-foreground">{ad.name}</h5>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Sponsored</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{ad.description}</p>

        {/* Trust Indicators */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-forest" /> Verified
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-gold" /> Trusted
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3 text-primary" /> Local
          </span>
        </div>

        <div className={cn(
          "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300",
          "bg-primary text-primary-foreground group-hover:bg-accent group-hover:text-primary"
        )}>
          Visit Site <ExternalLink className="h-4 w-4" />
        </div>
      </div>
    </a>
  );
}

// Rotating Ad Carousel for multiple ads
export function AdCarousel({ className }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 12000); // Slowed down to 12 seconds per ad
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("relative", className)}>
      {ads.map((ad, index) => (
        <div
          key={ad.id}
          className={cn(
            "transition-all duration-700 absolute inset-0",
            index === currentIndex 
              ? "opacity-100 translate-x-0" 
              : index < currentIndex 
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
          )}
        >
          <AdBanner adId={ad.id} variant="medium" />
        </div>
      ))}

      {/* Dots Navigation */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {ads.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex 
                ? "bg-primary w-6" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
