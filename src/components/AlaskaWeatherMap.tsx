import { useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import { MapPin, Minus, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CityWeather {
  name: string;
  lat: number;
  lng: number;
  temp: number;
  condition: string;
  humidity?: number;
  wind_mph?: number;
  wind_direction?: string;
  high?: number;
  low?: number;
}

export const defaultAlaskaCities: CityWeather[] = [
  { name: 'Anchorage', lat: 61.2181, lng: -149.9003, temp: 28, condition: 'Partly Cloudy' },
  { name: 'Fairbanks', lat: 64.8378, lng: -147.7164, temp: -5, condition: 'Clear' },
  { name: 'Juneau', lat: 58.3019, lng: -134.4197, temp: 35, condition: 'Rain' },
  { name: 'Barrow (Utqiaġvik)', lat: 71.2906, lng: -156.7886, temp: -25, condition: 'Snow' },
  { name: 'Kodiak', lat: 57.79, lng: -152.4072, temp: 38, condition: 'Cloudy' },
  { name: 'Bethel', lat: 60.7922, lng: -161.7558, temp: 15, condition: 'Snow' },
  { name: 'Nome', lat: 64.5011, lng: -165.4064, temp: 5, condition: 'Partly Cloudy' },
  { name: 'Ketchikan', lat: 55.3422, lng: -131.6461, temp: 40, condition: 'Rain' },
  { name: 'Sitka', lat: 57.0531, lng: -135.33, temp: 38, condition: 'Cloudy' },
  { name: 'Valdez', lat: 61.1309, lng: -146.3483, temp: 32, condition: 'Snow' },
];

interface AlaskaWeatherMapProps {
  className?: string;
  selectedLocation?: string;
  onLocationSelect?: (location: string) => void;
  cities?: CityWeather[];
}

type ZoomMode = 'state' | 'regional' | 'local';

type TempBand = 'arctic' | 'freezing' | 'mild' | 'warm';

const tempBand = (temp: number): TempBand => {
  if (temp < 0) return 'arctic';
  if (temp < 32) return 'freezing';
  if (temp < 50) return 'mild';
  return 'warm';
};

const bandColor = (band: TempBand) => {
  // Use semantic tokens only.
  switch (band) {
    case 'arctic':
      return 'hsl(var(--secondary))';
    case 'freezing':
      return 'hsl(var(--muted-foreground))';
    case 'mild':
      return 'hsl(var(--accent))';
    case 'warm':
      return 'hsl(var(--primary))';
  }
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export const AlaskaWeatherMap = forwardRef<HTMLDivElement, AlaskaWeatherMapProps>(
  ({ className, selectedLocation, onLocationSelect, cities = defaultAlaskaCities }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [zoomMode, setZoomMode] = useState<ZoomMode>('state');

    // pan in pixels (relative to container)
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

    const scale = useMemo(() => {
      switch (zoomMode) {
        case 'local':
          return 3;
        case 'regional':
          return 1.8;
        default:
          return 1;
      }
    }, [zoomMode]);

    const resetView = () => {
      setZoomMode('state');
      setPan({ x: 0, y: 0 });
    };

    const fitPanToBounds = (nextPan: { x: number; y: number }) => {
      const el = containerRef.current;
      if (!el) return nextPan;

      // when scaled, allow panning but constrain to keep map in view
      const w = el.clientWidth;
      const h = el.clientHeight;

      // max pan is half of the extra scaled size
      const maxX = ((w * scale) - w) / 2;
      const maxY = ((h * scale) - h) / 2;

      return {
        x: clamp(nextPan.x, -maxX, maxX),
        y: clamp(nextPan.y, -maxY, maxY),
      };
    };

    const setPanSafe = (next: { x: number; y: number }) => setPan(fitPanToBounds(next));

    // keep pan clamped when zoom changes
    useEffect(() => {
      setPanSafe(pan);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scale]);

    const zoomIn = () => {
      setZoomMode((z) => (z === 'state' ? 'regional' : z === 'regional' ? 'local' : 'local'));
    };

    const zoomOut = () => {
      setZoomMode((z) => (z === 'local' ? 'regional' : z === 'regional' ? 'state' : 'state'));
      if (zoomMode === 'regional') setPan({ x: 0, y: 0 });
    };

    const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
      if (scale <= 1) return;
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    };

    const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
      if (!isDragging || !dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPanSafe({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
    };

    const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
      if (!isDragging) return;
      try {
        (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      setIsDragging(false);
      dragStart.current = null;
    };

    const getCityPosition = (lat: number, lng: number) => {
      // Alaska approx spans lat 54-72, lng -172 to -130
      const x = ((lng + 172) / 42) * 100;
      const y = ((72 - lat) / 18) * 100;
      return { x: clamp(x, 5, 95), y: clamp(y, 5, 95) };
    };

    const transform = `translate(${pan.x}px, ${pan.y}px) scale(${scale})`;

    return (
      <div ref={ref} className={cn('relative rounded-lg overflow-hidden bg-card border border-border', className)}>
        {/* Controls */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
          <div className="bg-card/95 backdrop-blur-sm p-1.5 rounded-lg shadow-lg border border-border flex gap-1">
            <Button
              variant={zoomMode === 'state' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setZoomMode('state');
                setPan({ x: 0, y: 0 });
              }}
              className="text-xs h-7 px-3"
            >
              State
            </Button>
            <Button
              variant={zoomMode === 'regional' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setZoomMode('regional')}
              className="text-xs h-7 px-3"
            >
              Regional
            </Button>
            <Button
              variant={zoomMode === 'local' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setZoomMode('local')}
              className="text-xs h-7 px-3"
            >
              Local
            </Button>
          </div>
        </div>

        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border overflow-hidden">
            <Button variant="ghost" size="sm" onClick={zoomIn} className="h-9 w-9 p-0" title="Zoom in">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={zoomOut} className="h-9 w-9 p-0" title="Zoom out">
              <Minus className="h-4 w-4" />
            </Button>
          </div>
          <div className="bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border overflow-hidden">
            <Button variant="ghost" size="sm" onClick={resetView} className="h-9 w-9 p-0" title="Reset view">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Map canvas */}
        <div
          ref={containerRef}
          className={cn(
            'relative h-[520px] w-full select-none touch-none',
            scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            className={cn('absolute inset-0 origin-center transition-transform duration-200', isDragging && 'transition-none')}
            style={{ transform }}
          >
            {/* Background map (detailed) */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Alaska_topographic_map.png/1024px-Alaska_topographic_map.png')",
                filter: 'contrast(1.05) saturate(0.95)',
                opacity: 0.85,
              }}
            />

            {/* Labels + markers layer */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              {/* Regional labels */}
              <g opacity="0.9">
                <text x="50" y="18" textAnchor="middle" className="fill-current" style={{ fill: 'hsl(var(--foreground))' }}>
                  <tspan className="text-[4px] font-semibold">ALASKA</tspan>
                </text>
                <text x="18" y="50" textAnchor="middle" className="fill-current" style={{ fill: 'hsl(var(--muted-foreground))' }}>
                  <tspan className="text-[2.6px]">Bering Sea</tspan>
                </text>
                <text x="78" y="72" textAnchor="middle" className="fill-current" style={{ fill: 'hsl(var(--muted-foreground))' }}>
                  <tspan className="text-[2.6px]">Gulf of Alaska</tspan>
                </text>
                <text x="62" y="36" textAnchor="middle" className="fill-current" style={{ fill: 'hsl(var(--muted-foreground))' }}>
                  <tspan className="text-[2.4px]">Interior</tspan>
                </text>
                <text x="70" y="52" textAnchor="middle" className="fill-current" style={{ fill: 'hsl(var(--muted-foreground))' }}>
                  <tspan className="text-[2.4px]">Southcentral</tspan>
                </text>
                <text x="84" y="58" textAnchor="middle" className="fill-current" style={{ fill: 'hsl(var(--muted-foreground))' }}>
                  <tspan className="text-[2.4px]">Southeast</tspan>
                </text>
              </g>

              {/* City markers */}
              {cities.map((city) => {
                const pos = getCityPosition(city.lat, city.lng);
                const isSelected = selectedLocation === city.name;
                const color = bandColor(tempBand(city.temp));

                return (
                  <g
                    key={city.name}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => onLocationSelect?.(city.name)}
                    className="cursor-pointer"
                  >
                    {isSelected && (
                      <circle r="4" fill="none" stroke={color} strokeWidth="0.4" className="animate-ping" />
                    )}
                    <circle r={isSelected ? 3 : 2.2} fill={color} stroke="hsl(var(--background))" strokeWidth="0.35" />
                    <text y="-4" textAnchor="middle" className="text-[2.6px] font-bold" style={{ fill: color }}>
                      {city.temp}°
                    </text>
                    {(scale > 1.2 || isSelected) && (
                      <g>
                        <rect
                          x="-9"
                          y="2"
                          width="18"
                          height="4.6"
                          rx="0.8"
                          fill="hsl(var(--card))"
                          stroke="hsl(var(--border))"
                          strokeWidth="0.2"
                          opacity="0.95"
                        />
                        <text y="5.4" textAnchor="middle" className="text-[2.2px]" style={{ fill: 'hsl(var(--foreground))' }}>
                          {city.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Legend + help */}
        <div className="absolute bottom-3 left-3 z-20 bg-card/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border max-w-[260px]">
          <div className="text-xs font-semibold text-muted-foreground">Map</div>
          <div className="text-xs text-muted-foreground mt-1">
            {scale > 1 ? 'Drag to pan • Use +/− to zoom' : 'Use Regional/Local to zoom'}
          </div>
        </div>

        <div className="absolute bottom-3 right-3 z-20 bg-card/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border">
          <div className="text-xs font-semibold text-muted-foreground mb-2">Temperature</div>
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded" style={{ background: bandColor('arctic') }} />
              <span>&lt; 0°F</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded" style={{ background: bandColor('freezing') }} />
              <span>0–32°F</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded" style={{ background: bandColor('mild') }} />
              <span>32–50°F</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded" style={{ background: bandColor('warm') }} />
              <span>&gt; 50°F</span>
            </div>
          </div>
        </div>

        {selectedLocation && (
          <div className="absolute top-16 left-3 z-20 bg-card/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border min-w-[200px]">
            {(() => {
              const city = cities.find((c) => c.name === selectedLocation);
              if (!city) return null;
              const color = bandColor(tempBand(city.temp));
              return (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" style={{ color }} />
                    <span className="font-semibold text-sm">{city.name}</span>
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="text-2xl font-bold">{city.temp}°F</div>
                      <div className="text-xs text-muted-foreground">{city.condition}</div>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      <div className="font-medium">Zoom: {zoomMode}</div>
                      <div>{Math.round(scale * 100)}%</div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    );
  }
);

AlaskaWeatherMap.displayName = 'AlaskaWeatherMap';

