import { useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import { MapPin, Minus, Plus, RotateCcw, Layers, Play, Pause, CloudRain, Snowflake, Wind, Thermometer, Radio } from 'lucide-react';
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
  precipitation?: number;
}

export const defaultAlaskaCities: CityWeather[] = [
  { name: 'Anchorage', lat: 61.2181, lng: -149.9003, temp: 28, condition: 'Partly Cloudy', precipitation: 10, wind_mph: 12, wind_direction: 'NW' },
  { name: 'Fairbanks', lat: 64.8378, lng: -147.7164, temp: -5, condition: 'Clear', precipitation: 0, wind_mph: 5, wind_direction: 'N' },
  { name: 'Juneau', lat: 58.3019, lng: -134.4197, temp: 35, condition: 'Rain', precipitation: 80, wind_mph: 18, wind_direction: 'SE' },
  { name: 'Barrow (Utqiaġvik)', lat: 71.2906, lng: -156.7886, temp: -25, condition: 'Snow', precipitation: 45, wind_mph: 22, wind_direction: 'NE' },
  { name: 'Kodiak', lat: 57.79, lng: -152.4072, temp: 38, condition: 'Cloudy', precipitation: 30, wind_mph: 15, wind_direction: 'SW' },
  { name: 'Bethel', lat: 60.7922, lng: -161.7558, temp: 15, condition: 'Snow', precipitation: 60, wind_mph: 10, wind_direction: 'W' },
  { name: 'Nome', lat: 64.5011, lng: -165.4064, temp: 5, condition: 'Partly Cloudy', precipitation: 15, wind_mph: 8, wind_direction: 'NW' },
  { name: 'Ketchikan', lat: 55.3422, lng: -131.6461, temp: 40, condition: 'Rain', precipitation: 90, wind_mph: 20, wind_direction: 'S' },
  { name: 'Sitka', lat: 57.0531, lng: -135.33, temp: 38, condition: 'Cloudy', precipitation: 40, wind_mph: 14, wind_direction: 'SE' },
  { name: 'Valdez', lat: 61.1309, lng: -146.3483, temp: 32, condition: 'Snow', precipitation: 70, wind_mph: 16, wind_direction: 'E' },
];

interface WeatherRadarMapProps {
  className?: string;
  selectedLocation?: string;
  onLocationSelect?: (location: string) => void;
  cities?: CityWeather[];
}

type LayerType = 'radar' | 'temperature' | 'wind' | 'precipitation';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

// Radar color scale (NWS style)
const getRadarColor = (intensity: number): string => {
  if (intensity < 10) return 'rgba(0, 0, 0, 0)';
  if (intensity < 20) return 'rgba(0, 236, 236, 0.6)';
  if (intensity < 30) return 'rgba(1, 160, 246, 0.65)';
  if (intensity < 40) return 'rgba(0, 255, 0, 0.7)';
  if (intensity < 50) return 'rgba(0, 200, 0, 0.7)';
  if (intensity < 60) return 'rgba(255, 255, 0, 0.75)';
  if (intensity < 70) return 'rgba(255, 171, 0, 0.8)';
  if (intensity < 80) return 'rgba(255, 0, 0, 0.8)';
  if (intensity < 90) return 'rgba(214, 0, 0, 0.85)';
  return 'rgba(192, 0, 192, 0.9)';
};

// Temperature color scale
const getTempColor = (temp: number): string => {
  if (temp < -20) return 'rgba(148, 0, 211, 0.7)';
  if (temp < -10) return 'rgba(75, 0, 130, 0.7)';
  if (temp < 0) return 'rgba(0, 0, 255, 0.65)';
  if (temp < 10) return 'rgba(0, 128, 255, 0.6)';
  if (temp < 20) return 'rgba(0, 200, 255, 0.55)';
  if (temp < 32) return 'rgba(0, 255, 200, 0.5)';
  if (temp < 40) return 'rgba(128, 255, 128, 0.5)';
  if (temp < 50) return 'rgba(255, 255, 0, 0.55)';
  if (temp < 60) return 'rgba(255, 200, 0, 0.6)';
  return 'rgba(255, 100, 0, 0.7)';
};

export const WeatherRadarMap = forwardRef<HTMLDivElement, WeatherRadarMapProps>(
  ({ className, selectedLocation, onLocationSelect, cities = defaultAlaskaCities }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number>(0);
    
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [activeLayer, setActiveLayer] = useState<LayerType>('radar');
    const [isAnimating, setIsAnimating] = useState(true);
    const [radarFrame, setRadarFrame] = useState(0);
    const dragStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

    // Animate radar sweep
    useEffect(() => {
      if (!isAnimating) return;
      
      const animate = () => {
        setRadarFrame(prev => (prev + 1) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationRef.current);
    }, [isAnimating]);

    // Draw radar canvas
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Create radar gradient based on active layer
      if (activeLayer === 'radar' || activeLayer === 'precipitation') {
        // Draw precipitation zones around cities
        cities.forEach(city => {
          const x = ((city.lng + 172) / 42) * width;
          const y = ((72 - city.lat) / 18) * height;
          const precip = city.precipitation || 0;
          
          if (precip > 10) {
            const radius = 30 + precip * 0.5;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            
            if (city.condition.toLowerCase().includes('snow')) {
              gradient.addColorStop(0, getRadarColor(precip));
              gradient.addColorStop(0.5, getRadarColor(precip * 0.6));
              gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else {
              gradient.addColorStop(0, getRadarColor(precip));
              gradient.addColorStop(0.4, getRadarColor(precip * 0.7));
              gradient.addColorStop(0.7, getRadarColor(precip * 0.4));
              gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            }
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        
        // Draw animated radar sweep
        if (activeLayer === 'radar') {
          const centerX = width * 0.55;
          const centerY = height * 0.45;
          const sweepAngle = (radarFrame * Math.PI) / 180;
          
          const sweepGradient = ctx.createConicGradient(sweepAngle, centerX, centerY);
          sweepGradient.addColorStop(0, 'rgba(0, 255, 128, 0.15)');
          sweepGradient.addColorStop(0.02, 'rgba(0, 255, 128, 0.08)');
          sweepGradient.addColorStop(0.08, 'rgba(0, 255, 128, 0)');
          sweepGradient.addColorStop(1, 'rgba(0, 255, 128, 0)');
          
          ctx.fillStyle = sweepGradient;
          ctx.beginPath();
          ctx.arc(centerX, centerY, Math.max(width, height), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      if (activeLayer === 'temperature') {
        // Draw temperature zones
        cities.forEach(city => {
          const x = ((city.lng + 172) / 42) * width;
          const y = ((72 - city.lat) / 18) * height;
          const radius = 50;
          
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, getTempColor(city.temp));
          gradient.addColorStop(0.6, getTempColor(city.temp).replace(/[\d.]+\)$/, '0.3)'));
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      
      if (activeLayer === 'wind') {
        // Draw wind flow lines
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.4)';
        ctx.lineWidth = 1.5;
        
        cities.forEach(city => {
          const x = ((city.lng + 172) / 42) * width;
          const y = ((72 - city.lat) / 18) * height;
          const windSpeed = city.wind_mph || 10;
          const windDir = city.wind_direction || 'N';
          
          // Convert direction to angle
          const dirAngles: Record<string, number> = {
            'N': -90, 'NE': -45, 'E': 0, 'SE': 45, 'S': 90, 'SW': 135, 'W': 180, 'NW': -135
          };
          const angle = ((dirAngles[windDir] || 0) + radarFrame * 0.5) * Math.PI / 180;
          
          // Draw wind arrows
          for (let i = 0; i < 3; i++) {
            const offset = (i - 1) * 15;
            const startX = x + Math.cos(angle + Math.PI) * 20 + offset * Math.sin(angle);
            const startY = y + Math.sin(angle + Math.PI) * 20 - offset * Math.cos(angle);
            const length = 15 + windSpeed * 0.5;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + Math.cos(angle) * length, startY + Math.sin(angle) * length);
            ctx.stroke();
            
            // Arrow head
            const endX = startX + Math.cos(angle) * length;
            const endY = startY + Math.sin(angle) * length;
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - Math.cos(angle - 0.4) * 6, endY - Math.sin(angle - 0.4) * 6);
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - Math.cos(angle + 0.4) * 6, endY - Math.sin(angle + 0.4) * 6);
            ctx.stroke();
          }
        });
      }
    }, [cities, activeLayer, radarFrame]);

    const fitPanToBounds = (nextPan: { x: number; y: number }) => {
      const el = containerRef.current;
      if (!el) return nextPan;
      const w = el.clientWidth;
      const h = el.clientHeight;
      const maxX = ((w * zoom) - w) / 2;
      const maxY = ((h * zoom) - h) / 2;
      return {
        x: clamp(nextPan.x, -maxX, maxX),
        y: clamp(nextPan.y, -maxY, maxY),
      };
    };

    const setPanSafe = (next: { x: number; y: number }) => setPan(fitPanToBounds(next));

    useEffect(() => {
      setPanSafe(pan);
    }, [zoom]);

    const resetView = () => {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };

    const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
      if (zoom <= 1) return;
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
      } catch {}
      setIsDragging(false);
      dragStart.current = null;
    };

    const getCityPosition = (lat: number, lng: number) => {
      const x = ((lng + 172) / 42) * 100;
      const y = ((72 - lat) / 18) * 100;
      return { x: clamp(x, 5, 95), y: clamp(y, 5, 95) };
    };

    const transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;

    const layerIcons: Record<LayerType, React.ReactNode> = {
      radar: <Radio className="h-4 w-4" />,
      temperature: <Thermometer className="h-4 w-4" />,
      wind: <Wind className="h-4 w-4" />,
      precipitation: <CloudRain className="h-4 w-4" />,
    };

    return (
      <div ref={ref} className={cn('relative rounded-lg overflow-hidden bg-card border border-border', className)}>
        {/* Layer Controls */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
          <div className="bg-card/95 backdrop-blur-sm p-1.5 rounded-lg shadow-lg border border-border flex gap-1">
            {(['radar', 'temperature', 'wind', 'precipitation'] as LayerType[]).map((layer) => (
              <Button
                key={layer}
                variant={activeLayer === layer ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveLayer(layer)}
                className="text-xs h-8 px-3 gap-1.5"
              >
                {layerIcons[layer]}
                <span className="hidden sm:inline capitalize">{layer}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Zoom & Animation Controls */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border overflow-hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsAnimating(!isAnimating)} 
              className="h-9 w-9 p-0" 
              title={isAnimating ? 'Pause animation' : 'Play animation'}
            >
              {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
          <div className="bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border overflow-hidden">
            <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.min(z + 0.5, 3))} className="h-9 w-9 p-0" title="Zoom in">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.max(z - 0.5, 1))} className="h-9 w-9 p-0" title="Zoom out">
              <Minus className="h-4 w-4" />
            </Button>
          </div>
          <div className="bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border overflow-hidden">
            <Button variant="ghost" size="sm" onClick={resetView} className="h-9 w-9 p-0" title="Reset view">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Map Canvas */}
        <div
          ref={containerRef}
          className={cn(
            'relative h-[520px] w-full select-none touch-none',
            zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
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
            {/* Base map with dark theme */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Alaska_topographic_map.png/1024px-Alaska_topographic_map.png')",
                filter: 'saturate(0.6) brightness(0.7) contrast(1.1)',
              }}
            />
            
            {/* Dark overlay for radar visibility */}
            <div className="absolute inset-0 bg-background/40" />
            
            {/* Radar canvas overlay */}
            <canvas 
              ref={canvasRef}
              width={800}
              height={520}
              className="absolute inset-0 w-full h-full"
            />
            
            {/* Grid overlay */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-20">
              {/* Latitude lines */}
              {[55, 60, 65, 70].map((lat) => {
                const y = ((72 - lat) / 18) * 100;
                return (
                  <g key={`lat-${lat}`}>
                    <line x1="0" y1={y} x2="100" y2={y} stroke="hsl(var(--accent))" strokeWidth="0.15" strokeDasharray="1,1" />
                    <text x="98" y={y - 0.5} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize="1.8">{lat}°N</text>
                  </g>
                );
              })}
              {/* Longitude lines */}
              {[-170, -160, -150, -140].map((lng) => {
                const x = ((lng + 172) / 42) * 100;
                return (
                  <g key={`lng-${lng}`}>
                    <line x1={x} y1="0" x2={x} y2="100" stroke="hsl(var(--accent))" strokeWidth="0.15" strokeDasharray="1,1" />
                    <text x={x} y="98" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="1.8">{Math.abs(lng)}°W</text>
                  </g>
                );
              })}
            </svg>

            {/* City markers */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              {cities.map((city) => {
                const pos = getCityPosition(city.lat, city.lng);
                const isSelected = selectedLocation === city.name;
                
                return (
                  <g
                    key={city.name}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => onLocationSelect?.(city.name)}
                    className="cursor-pointer"
                  >
                    {/* Pulse ring for selected */}
                    {isSelected && (
                      <>
                        <circle r="6" fill="none" stroke="hsl(var(--accent))" strokeWidth="0.3" opacity="0.5">
                          <animate attributeName="r" from="3" to="8" dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                        <circle r="4" fill="none" stroke="hsl(var(--accent))" strokeWidth="0.4" />
                      </>
                    )}
                    
                    {/* City marker */}
                    <circle 
                      r={isSelected ? 2.5 : 2} 
                      fill={isSelected ? 'hsl(var(--accent))' : 'hsl(var(--foreground))'} 
                      stroke="hsl(var(--background))" 
                      strokeWidth="0.4"
                      className="transition-all duration-200"
                    />
                    
                    {/* Temperature badge */}
                    <g transform="translate(0, -5)">
                      <rect 
                        x="-4" 
                        y="-2.5" 
                        width="8" 
                        height="5" 
                        rx="1" 
                        fill={city.temp < 0 ? 'hsl(var(--secondary))' : city.temp < 32 ? 'hsl(var(--muted))' : 'hsl(var(--accent))'}
                        stroke="hsl(var(--background))"
                        strokeWidth="0.2"
                      />
                      <text 
                        textAnchor="middle" 
                        dominantBaseline="central"
                        fill="hsl(var(--foreground))"
                        fontSize="2.5"
                        fontWeight="bold"
                      >
                        {city.temp}°
                      </text>
                    </g>
                    
                    {/* City name */}
                    {(zoom > 1.3 || isSelected) && (
                      <g transform="translate(0, 5)">
                        <rect 
                          x="-12" 
                          y="-2" 
                          width="24" 
                          height="4" 
                          rx="0.5" 
                          fill="hsl(var(--card))" 
                          fillOpacity="0.9"
                          stroke="hsl(var(--border))"
                          strokeWidth="0.1"
                        />
                        <text 
                          textAnchor="middle" 
                          dominantBaseline="central"
                          fill="hsl(var(--foreground))"
                          fontSize="2"
                        >
                          {city.name.length > 12 ? city.name.slice(0, 10) + '...' : city.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Radar Color Legend */}
        <div className="absolute bottom-3 right-3 z-20 bg-card/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border">
          <div className="text-xs font-semibold text-muted-foreground mb-2">
            {activeLayer === 'radar' || activeLayer === 'precipitation' ? 'Precipitation Intensity' : 
             activeLayer === 'temperature' ? 'Temperature (°F)' : 'Wind Speed'}
          </div>
          {(activeLayer === 'radar' || activeLayer === 'precipitation') && (
            <div className="flex gap-0.5">
              {[0, 20, 30, 40, 50, 60, 70, 80, 90].map((intensity) => (
                <div 
                  key={intensity}
                  className="w-4 h-4 rounded-sm border border-border/50"
                  style={{ backgroundColor: getRadarColor(intensity + 5) }}
                  title={`${intensity}-${intensity + 10}%`}
                />
              ))}
            </div>
          )}
          {activeLayer === 'temperature' && (
            <div className="flex gap-0.5">
              {[-20, -10, 0, 10, 20, 32, 40, 50].map((temp) => (
                <div 
                  key={temp}
                  className="w-4 h-4 rounded-sm border border-border/50"
                  style={{ backgroundColor: getTempColor(temp) }}
                  title={`${temp}°F`}
                />
              ))}
            </div>
          )}
          {activeLayer === 'wind' && (
            <div className="text-xs text-muted-foreground">Arrow direction indicates wind flow</div>
          )}
        </div>

        {/* Map info */}
        <div className="absolute bottom-3 left-3 z-20 bg-card/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border max-w-[200px]">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Layers className="h-4 w-4 text-accent" />
            <span>Interactive Radar</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {zoom > 1 ? 'Drag to pan • Click city for details' : 'Zoom to see city names'}
          </div>
        </div>

        {/* Selected city info panel */}
        {selectedLocation && (
          <div className="absolute top-16 left-3 z-20 bg-card/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-border min-w-[220px]">
            {(() => {
              const city = cities.find((c) => c.name === selectedLocation);
              if (!city) return null;
              return (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-accent" />
                    <span className="font-semibold">{city.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-3xl font-bold">{city.temp}°F</div>
                      <div className="text-xs text-muted-foreground">{city.condition}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs">
                        <CloudRain className="h-3 w-3 text-secondary" />
                        <span>{city.precipitation || 0}% precip</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Wind className="h-3 w-3 text-muted-foreground" />
                        <span>{city.wind_mph} mph {city.wind_direction}</span>
                      </div>
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

WeatherRadarMap.displayName = 'WeatherRadarMap';
