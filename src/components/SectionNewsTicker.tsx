import { MapPin, Building2, Mountain } from 'lucide-react';
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

const sectionData: Record<string, { icon: React.ReactNode; label: string; items: TickerItem[] }> = {
  local: {
    icon: <MapPin className="h-3 w-3" />,
    label: 'Local Updates',
    items: [
      { id: 'l1', text: 'Anchorage Assembly approves $1.2B municipal budget with increased public safety funding', isUrgent: true },
      { id: 'l2', text: 'New transit routes connecting Muldoon to downtown begin service next week' },
      { id: 'l3', text: 'Anchorage School District announces 3 new magnet programs for fall 2026' },
      { id: 'l4', text: 'Port of Alaska modernization enters Phase 3: new cargo terminal breaking ground' },
      { id: 'l5', text: 'Downtown parking reforms under consideration as business owners voice concerns' },
      { id: 'l6', text: 'Providence Alaska expanding emergency department capacity by 40%', isUrgent: true },
      { id: 'l7', text: 'Sullivan Arena redevelopment: mixed-use proposals narrowed to 3 finalists' },
      { id: 'l8', text: 'Anchorage Fire Department receives 6 new brush trucks ahead of wildfire season' },
      { id: 'l9', text: 'Ted Stevens International Airport passenger traffic up 12% year-over-year' },
      { id: 'l10', text: 'Municipality launches new pothole reporting app with 48-hour response guarantee' },
    ],
  },
  state: {
    icon: <Building2 className="h-3 w-3" />,
    label: 'State Updates',
    items: [
      { id: 's1', text: 'Legislature debates Permanent Fund dividend amount: $2,200 vs $1,800 proposals', isUrgent: true },
      { id: 's2', text: 'Governor signs executive order expanding rural broadband infrastructure' },
      { id: 's3', text: 'State ferry system secures federal grant for 2 new vessels' },
      { id: 's4', text: 'Alaska Department of Fish & Game announces new subsistence fishing regulations' },
      { id: 's5', text: 'Willow Oil Project employment reaches 3,500 workers as Phase 2 construction begins', isUrgent: true },
      { id: 's6', text: 'State pension reform bill advances to Senate floor for final vote' },
      { id: 's7', text: 'Alaska Railroad expansion: Fairbanks-Delta Junction corridor study approved' },
      { id: 's8', text: 'Department of Education proposes increased village school funding formula' },
      { id: 's9', text: 'Commercial fishing season outlook: Bristol Bay sockeye forecast at 67 million' },
      { id: 's10', text: 'State emergency declared in Western Alaska due to coastal erosion affecting 4 villages' },
    ],
  },
  outdoors: {
    icon: <Mountain className="h-3 w-3" />,
    label: 'Outdoor Updates',
    items: [
      { id: 'o1', text: 'Avalanche danger HIGH in Chugach Mountains: backcountry travel not recommended', isUrgent: true },
      { id: 'o2', text: 'King salmon returns looking strong: Kenai River early forecasts optimistic' },
      { id: 'o3', text: 'Denali National Park road cleared to Mile 43 ahead of schedule' },
      { id: 'o4', text: 'Aurora viewing forecast EXCELLENT for next 5 nights: Kp index expected 6-7', isUrgent: true },
      { id: 'o5', text: 'Iditarod Trail conditions favorable as mushers approach Unalakleet' },
      { id: 'o6', text: 'Bear encounters reported near Eagle River: hikers advised to carry spray' },
      { id: 'o7', text: 'Ice fishing remains good on Finger Lake, Big Lake showing thin ice patches' },
      { id: 'o8', text: 'Moose hunting permit application deadline extended to January 15' },
      { id: 'o9', text: 'Ski conditions: Alyeska reports 8" fresh powder, Hilltop opens new terrain' },
      { id: 'o10', text: 'Whale migration: early arrivals spotted in Kachemak Bay this week' },
    ],
  },
};

export function SectionNewsTicker({ section, className }: SectionNewsTickerProps) {
  const data = sectionData[section];
  
  if (!data) return null;

  // Double the items for seamless loop
  const allItems = [...data.items, ...data.items];

  return (
    <div className={cn("overflow-hidden bg-muted/50 border-b border-border", className)}>
      <div className="flex items-center">
        {/* Section label */}
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
          {data.icon}
          <span className="hidden sm:inline">{data.label}</span>
        </div>

        {/* Ticker content */}
        <div className="flex-1 overflow-hidden relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-muted/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-muted/50 to-transparent z-10 pointer-events-none" />
          
          <div className="ticker-section-animate flex whitespace-nowrap py-1.5">
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
