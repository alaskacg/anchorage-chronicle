import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Factory, Fuel, Building, Landmark, RefreshCw } from 'lucide-react';

interface BusinessItem {
  id: string;
  category: 'mining' | 'lng' | 'federal' | 'foreign' | 'investment';
  headline: string;
  indicator?: 'up' | 'down' | 'neutral';
}

const getBusinessNews = (): BusinessItem[] => {
  return [
    {
      id: '1',
      category: 'federal',
      headline: 'Anchorage Port receives $400M federal infrastructure grant for modernization',
      indicator: 'up',
    },
    {
      id: '2',
      category: 'lng',
      headline: 'Alaska LNG Project reaches final investment decision, construction to begin Q2 2026',
      indicator: 'up',
    },
    {
      id: '3',
      category: 'investment',
      headline: 'Alaska Permanent Fund reports 9.2% returns for Q4 2025, total assets exceed $80B',
      indicator: 'up',
    },
    {
      id: '4',
      category: 'mining',
      headline: 'Willow Project Phase 2 adds 1,200 jobs, North Slope employment hits record high',
      indicator: 'up',
    },
    {
      id: '5',
      category: 'foreign',
      headline: 'Japanese consortium commits $600M to Alaska seafood processing expansion',
      indicator: 'up',
    },
    {
      id: '6',
      category: 'lng',
      headline: 'Cook Inlet gas production up 15% as Hilcorp brings new wells online',
      indicator: 'up',
    },
    {
      id: '7',
      category: 'federal',
      headline: 'DOE awards $220M for Alaska rural energy modernization program',
      indicator: 'up',
    },
    {
      id: '8',
      category: 'mining',
      headline: 'Graphite One receives $50M DOD grant for critical minerals processing',
      indicator: 'up',
    },
    {
      id: '9',
      category: 'foreign',
      headline: 'South Korea signs 20-year LNG purchase agreement with Alaska Gas Development',
      indicator: 'up',
    },
    {
      id: '10',
      category: 'investment',
      headline: 'Anchorage real estate: Commercial vacancy rates drop to 8-year low',
      indicator: 'up',
    },
  ];
};

const categoryIcons = {
  mining: Factory,
  lng: Fuel,
  federal: Landmark,
  foreign: DollarSign,
  investment: Building,
};

const categoryLabels = {
  mining: 'Mining',
  lng: 'LNG',
  federal: 'Federal',
  foreign: 'Foreign',
  investment: 'Investment',
};

export function BusinessEconomyTicker() {
  const [businessNews, setBusinessNews] = useState<BusinessItem[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const updateNews = () => {
      setBusinessNews(getBusinessNews());
      setLastUpdate(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    };
    
    updateNews();
    
    // Refresh every 10 minutes
    const interval = setInterval(updateNews, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (businessNews.length === 0) return null;

  return (
    <div className="bg-primary/5 border-t border-b border-border overflow-hidden">
      <div className="flex items-center py-2">
        <div className="flex items-center gap-1.5 px-3 border-r border-border shrink-0">
          <TrendingUp className="h-3 w-3 text-secondary" />
          <span className="font-sans font-bold text-[10px] uppercase tracking-wide text-secondary hidden sm:inline">
            Markets
          </span>
          <span className="text-[9px] text-muted-foreground hidden md:flex items-center gap-1 ml-1">
            <RefreshCw className="h-2 w-2" />
            {lastUpdate}
          </span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="ticker-animate-business whitespace-nowrap inline-flex gap-6 sm:gap-8">
            {[...businessNews, ...businessNews].map((item, index) => {
              const Icon = categoryIcons[item.category];
              return (
                <span 
                  key={`${item.id}-${index}`} 
                  className="inline-flex items-center gap-1.5 sm:gap-2 text-xs font-sans group cursor-pointer"
                >
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.category === 'mining' ? 'bg-accent/20 text-accent' :
                    item.category === 'lng' ? 'bg-secondary/20 text-secondary' :
                    item.category === 'federal' ? 'bg-primary/20 text-primary' :
                    item.category === 'foreign' ? 'bg-destructive/20 text-destructive' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="h-2.5 w-2.5" />
                    <span className="hidden sm:inline">{categoryLabels[item.category]}</span>
                  </span>
                  <span className="text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {item.headline}
                  </span>
                  {item.indicator === 'up' && (
                    <span className="text-secondary text-[10px]">▲</span>
                  )}
                  {item.indicator === 'down' && (
                    <span className="text-destructive text-[10px]">▼</span>
                  )}
                  <span className="text-muted-foreground/30 mx-2 sm:mx-4">│</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
