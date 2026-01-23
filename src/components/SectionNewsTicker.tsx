import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TickerItem {
  id: string;
  text: string;
  isUrgent?: boolean;
}

interface SectionNewsTickerProps {
  section: 'local' | 'state' | 'outdoors';
  className?: string;
}

const getSectionData = (section: string): TickerItem[] => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  
  const data: Record<string, TickerItem[]> = {
    local: [
      { id: 'l1', text: `[${timeStr}] Magnitude 5.1 earthquake felt across Anchorage, no damage reported`, isUrgent: true },
      { id: 'l2', text: 'Anchorage Port receives $400M federal grant for modernization project' },
      { id: 'l3', text: 'Municipality declares cold weather emergency, opens additional warming shelters' },
      { id: 'l4', text: 'Ted Stevens Airport reports record January passenger numbers amid tourism surge' },
      { id: 'l5', text: `[${timeStr}] Providence Alaska ER wait times at 4+ hours due to cold-related injuries`, isUrgent: true },
      { id: 'l6', text: 'Anchorage School District delays start by 2 hours Friday due to extreme cold' },
      { id: 'l7', text: 'Downtown transit hub construction 60% complete, opening set for June' },
      { id: 'l8', text: 'APD reports vehicle theft ring arrests, 12 suspects in custody' },
      { id: 'l9', text: 'Midtown development: 200-unit housing project breaks ground on Northern Lights' },
      { id: 'l10', text: 'Sullivan Arena renovation bids due February 15, three finalists remain' },
    ],
    state: [
      { id: 's1', text: `[${timeStr}] Legislature approves $2,100 PFD for 2026, largest in five years`, isUrgent: true },
      { id: 's2', text: 'Governor declares emergency for Mat-Su Valley flooding, seeks federal aid' },
      { id: 's3', text: 'Trans-Alaska Pipeline celebrates 50-year milestone with statewide events' },
      { id: 's4', text: `[${timeStr}] Willow Project Phase 2 construction adds 1,200 new jobs this month`, isUrgent: true },
      { id: 's5', text: 'State ferry MV Tustumena returns to service after $18M overhaul' },
      { id: 's6', text: 'Alaska Railroad announces summer service expansion to Seward' },
      { id: 's7', text: 'Fish & Game: Copper River salmon returns projected strong for 2026' },
      { id: 's8', text: 'Rural broadband expansion reaches 15 new villages this month' },
      { id: 's9', text: 'State troopers increase patrols on Parks Highway after fatal crashes' },
      { id: 's10', text: 'Alaska Permanent Fund reports 9.2% returns for Q4 2025' },
    ],
    outdoors: [
      { id: 'o1', text: `[${timeStr}] Avalanche Warning: HIGH danger in Chugach backcountry through weekend`, isUrgent: true },
      { id: 'o2', text: 'Aurora forecast upgraded to G3 storm, excellent viewing tonight' },
      { id: 'o3', text: `[${timeStr}] Extreme cold: Frostbite possible in 10 minutes at -55°F wind chill`, isUrgent: true },
      { id: 'o4', text: 'Iditarod 2026: Record 57 mushers registered for March 1st ceremonial start' },
      { id: 'o5', text: 'Kenai River king salmon forecast 40% above average for 2026 season' },
      { id: 'o6', text: 'Alyeska reports 14" fresh powder, all lifts operating through Sunday' },
      { id: 'o7', text: 'Ice fishing: Nancy Lake conditions excellent, Big Lake closed sections' },
      { id: 'o8', text: 'Denali climbing permits for 2026 season now available, May 1 start' },
      { id: 'o9', text: 'Hatcher Pass road closed beyond Independence Mine due to avalanche risk' },
      { id: 'o10', text: 'Eagle River Nature Center trails groomed for cross-country skiing' },
    ],
  };
  
  return data[section] || [];
};

export function SectionNewsTicker({ section, className }: SectionNewsTickerProps) {
  const [items, setItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    // Initial load
    setItems(getSectionData(section));
    
    // Refresh every 5 minutes to update timestamps
    const interval = setInterval(() => {
      setItems(getSectionData(section));
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [section]);
  
  if (items.length === 0) return null;

  // Double the items for seamless loop
  const allItems = [...items, ...items];

  return (
    <div className={cn("overflow-hidden bg-muted/50 border-b border-border", className)}>
      <div className="flex items-center">
        <div className="flex-1 overflow-hidden relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-muted/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-muted/50 to-transparent z-10 pointer-events-none" />
          
          <div className="ticker-section-fast flex whitespace-nowrap py-1.5">
            {allItems.map((item, index) => (
              <span
                key={`${item.id}-${index}`}
                className={cn(
                  "inline-flex items-center px-4 text-xs font-sans",
                  item.isUrgent ? "text-destructive font-semibold" : "text-foreground"
                )}
              >
                {item.isUrgent && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive mr-2 animate-pulse" />
                )}
                {item.text}
                <span className="mx-4 text-muted-foreground/40">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
