import { useEffect, useState } from 'react';
import { Waves, ArrowUp, ArrowDown, Clock, Anchor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TidePoint {
  time: string;
  height: number;
  type: 'high' | 'low';
}

interface TideData {
  current: {
    height: number;
    trend: 'rising' | 'falling' | 'slack';
    nextEvent: TidePoint;
  };
  tides: TidePoint[];
  conditions: {
    waterTemp: number;
    visibility: string;
    currentSpeed: string;
  };
}

// Generate realistic tide data for Anchorage/Cook Inlet
function generateTideData(): TideData {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Cook Inlet has some of the largest tidal ranges in North America (up to 40 feet)
  // Semi-diurnal tides - roughly 2 high and 2 low tides per day
  const baseHighTide = 28 + Math.sin(Date.now() / 86400000) * 4;
  const baseLowTide = 2 + Math.sin(Date.now() / 86400000) * 2;
  
  // Calculate tide times based on lunar cycle approximation
  const tidePhase = ((hours * 60 + minutes) / 372) * Math.PI * 2;
  const currentHeight = ((baseHighTide - baseLowTide) / 2) * Math.sin(tidePhase) + ((baseHighTide + baseLowTide) / 2);
  
  const tides: TidePoint[] = [];
  let nextTideHour = (Math.floor(hours / 6) * 6 + 6) % 24;
  
  for (let i = 0; i < 4; i++) {
    const tideHour = (nextTideHour + i * 6) % 24;
    const isHigh = i % 2 === 0;
    tides.push({
      time: `${tideHour.toString().padStart(2, '0')}:${(Math.floor(Math.random() * 60)).toString().padStart(2, '0')}`,
      height: isHigh ? baseHighTide - Math.random() * 3 : baseLowTide + Math.random() * 2,
      type: isHigh ? 'high' : 'low',
    });
  }
  
  const trend = Math.cos(tidePhase) > 0 ? 'rising' : 'falling';
  
  return {
    current: {
      height: Math.round(currentHeight * 10) / 10,
      trend: Math.abs(Math.cos(tidePhase)) < 0.1 ? 'slack' : trend,
      nextEvent: tides[0],
    },
    tides,
    conditions: {
      waterTemp: 38 + Math.floor(Math.random() * 5),
      visibility: ['Good', 'Moderate', 'Limited'][Math.floor(Math.random() * 3)],
      currentSpeed: `${(1 + Math.random() * 3).toFixed(1)} knots`,
    },
  };
}

export function TideChart() {
  const [tideData, setTideData] = useState<TideData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setTideData(generateTideData());
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setTideData(generateTideData());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  if (!tideData) return null;

  const TrendIcon = tideData.current.trend === 'rising' ? ArrowUp : 
                    tideData.current.trend === 'falling' ? ArrowDown : Waves;

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="pb-2 border-b border-border px-3 sm:px-6 py-3">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-display">
          <Anchor className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
          <span>Cook Inlet Tides</span>
          <span className="ml-auto text-[10px] sm:text-xs font-sans text-muted-foreground font-normal">
            Anchorage Harbor
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Current Tide Status */}
        <div className="p-3 sm:p-4 bg-secondary/5 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground font-sans mb-1">
                Current Tide
              </p>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  {tideData.current.height}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground">ft</span>
                <div className={`flex items-center gap-1 ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-sans ${
                  tideData.current.trend === 'rising' 
                    ? 'bg-secondary/20 text-secondary' 
                    : tideData.current.trend === 'falling'
                    ? 'bg-accent/20 text-accent'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <TrendIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span className="capitalize">{tideData.current.trend}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground font-sans mb-1">
                Next {tideData.current.nextEvent.type === 'high' ? 'High' : 'Low'}
              </p>
              <div className="flex items-center gap-1 text-foreground">
                <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />
                <span className="font-display font-semibold text-sm sm:text-base">{tideData.current.nextEvent.time}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {tideData.current.nextEvent.height.toFixed(1)} ft
              </p>
            </div>
          </div>
        </div>
        
        {/* Tide Timeline */}
        <div className="p-4 border-b border-border">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-sans mb-3">
            Today's Tides
          </p>
          <div className="flex justify-between items-end h-16 px-2">
            {tideData.tides.map((tide, index) => (
              <div 
                key={index}
                className="flex flex-col items-center gap-1"
              >
                <div 
                  className={`w-8 rounded-t transition-all duration-300 ${
                    tide.type === 'high' 
                      ? 'bg-secondary/60 h-12' 
                      : 'bg-accent/40 h-4'
                  }`}
                  style={{ height: `${(tide.height / 32) * 48 + 8}px` }}
                />
                <div className={`w-2 h-2 rounded-full ${
                  tide.type === 'high' ? 'bg-secondary' : 'bg-accent'
                }`} />
                <span className="text-[10px] text-muted-foreground font-mono">{tide.time}</span>
                <span className="text-[10px] text-foreground font-semibold">
                  {tide.height.toFixed(1)}ft
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Water Conditions */}
        <div className="p-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-sans">
              Water Temp
            </p>
            <p className="text-sm font-display font-semibold text-foreground">
              {tideData.conditions.waterTemp}°F
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-sans">
              Visibility
            </p>
            <p className="text-sm font-display font-semibold text-foreground">
              {tideData.conditions.visibility}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-sans">
              Current
            </p>
            <p className="text-sm font-display font-semibold text-foreground">
              {tideData.conditions.currentSpeed}
            </p>
          </div>
        </div>
        
        {/* Caution Note */}
        <div className="px-4 pb-3">
          <p className="text-[10px] text-muted-foreground italic text-center font-sans">
            ⚠️ Cook Inlet has extreme tidal ranges. Always check official NOAA predictions before marine activities.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
