import { TrendingUp, DollarSign, Factory, Fuel, Building, Landmark } from 'lucide-react';

interface BusinessItem {
  id: string;
  category: 'mining' | 'lng' | 'federal' | 'foreign' | 'investment';
  headline: string;
  indicator?: 'up' | 'down' | 'neutral';
}

const businessNews: BusinessItem[] = [
  {
    id: '1',
    category: 'lng',
    headline: 'Alaska LNG Project secures $1.2B in new financing commitments',
    indicator: 'up',
  },
  {
    id: '2',
    category: 'mining',
    headline: 'Donlin Gold advances permitting for expanded operations in Yukon-Kuskokwim region',
    indicator: 'up',
  },
  {
    id: '3',
    category: 'federal',
    headline: 'USDA announces $340M rural infrastructure investment for Alaska communities',
    indicator: 'up',
  },
  {
    id: '4',
    category: 'foreign',
    headline: 'South Korean consortium signs MOU for Alaska natural gas exports',
    indicator: 'up',
  },
  {
    id: '5',
    category: 'mining',
    headline: 'Pebble Mine appeal hearing scheduled for February 2026 federal review',
    indicator: 'neutral',
  },
  {
    id: '6',
    category: 'investment',
    headline: 'Alaska Permanent Fund reports 8.2% returns for Q4 2025',
    indicator: 'up',
  },
  {
    id: '7',
    category: 'federal',
    headline: 'DOE approves $180M for Alaska clean energy grid modernization',
    indicator: 'up',
  },
  {
    id: '8',
    category: 'lng',
    headline: 'Hilcorp advances Cook Inlet gas development with new drilling permits',
    indicator: 'up',
  },
  {
    id: '9',
    category: 'foreign',
    headline: 'Japanese investors commit $500M to Alaska seafood processing facilities',
    indicator: 'up',
  },
  {
    id: '10',
    category: 'mining',
    headline: 'Graphite One secures critical minerals designation, unlocks federal support',
    indicator: 'up',
  },
];

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
  return (
    <div className="bg-primary/5 border-t border-b border-border overflow-hidden">
      <div className="flex items-center py-2">
        <div className="flex items-center gap-1.5 px-3 border-r border-border shrink-0">
          <TrendingUp className="h-3 w-3 text-secondary" />
          <span className="font-sans font-bold text-[10px] uppercase tracking-wide text-secondary hidden sm:inline">
            Markets
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
