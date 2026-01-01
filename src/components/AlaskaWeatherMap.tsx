import { useState, forwardRef } from 'react';
import { Cloud, Snowflake, Sun, CloudRain, Wind, Thermometer, ZoomIn, ZoomOut, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Alaska city data with weather info
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
  { name: 'Kodiak', lat: 57.7900, lng: -152.4072, temp: 38, condition: 'Cloudy' },
  { name: 'Bethel', lat: 60.7922, lng: -161.7558, temp: 15, condition: 'Snow' },
  { name: 'Nome', lat: 64.5011, lng: -165.4064, temp: 5, condition: 'Partly Cloudy' },
  { name: 'Ketchikan', lat: 55.3422, lng: -131.6461, temp: 40, condition: 'Rain' },
  { name: 'Sitka', lat: 57.0531, lng: -135.3300, temp: 38, condition: 'Cloudy' },
  { name: 'Valdez', lat: 61.1309, lng: -146.3483, temp: 32, condition: 'Snow' },
];

const getWeatherIcon = (condition: string, size = 'h-4 w-4') => {
  switch (condition?.toLowerCase()) {
    case 'clear':
    case 'sunny':
      return <Sun className={`${size} text-amber-400`} />;
    case 'rain':
    case 'rainy':
      return <CloudRain className={`${size} text-blue-400`} />;
    case 'snow':
    case 'snowy':
      return <Snowflake className={`${size} text-cyan-300`} />;
    case 'cloudy':
      return <Cloud className={`${size} text-slate-400`} />;
    default:
      return <Cloud className={`${size} text-slate-400`} />;
  }
};

const getConditionEmoji = (condition: string) => {
  switch (condition?.toLowerCase()) {
    case 'clear':
    case 'sunny':
      return '☀️';
    case 'rain':
    case 'rainy':
      return '🌧️';
    case 'snow':
    case 'snowy':
      return '❄️';
    case 'partly cloudy':
      return '⛅';
    default:
      return '☁️';
  }
};

interface AlaskaWeatherMapProps {
  className?: string;
  selectedLocation?: string;
  onLocationSelect?: (location: string) => void;
  cities?: CityWeather[];
}

type MapLayerType = 'dark' | 'satellite' | 'terrain' | 'standard';

export const AlaskaWeatherMap = forwardRef<HTMLDivElement, AlaskaWeatherMapProps>(({ 
  className, 
  selectedLocation,
  onLocationSelect,
  cities = defaultAlaskaCities
}, ref) => {
  const [mapLayer, setMapLayer] = useState<MapLayerType>('dark');
  const [zoom, setZoom] = useState<'state' | 'regional' | 'local'>('state');
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  // Map tile URLs
  const mapUrls: Record<MapLayerType, string> = {
    dark: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/4/4/1',
    terrain: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/4/4/1',
    standard: 'https://tile.openstreetmap.org/4/4/1.png'
  };

  // Get zoom-specific styling
  const getZoomStyles = () => {
    switch (zoom) {
      case 'local':
        return { transform: 'scale(2.5)', transformOrigin: 'center' };
      case 'regional':
        return { transform: 'scale(1.5)', transformOrigin: 'center' };
      default:
        return { transform: 'scale(1)' };
    }
  };

  // Calculate city position on SVG map
  const getCityPosition = (lat: number, lng: number) => {
    // Convert lat/lng to approximate x,y positions for Alaska
    // Alaska roughly spans lat 54-72, lng -172 to -130
    const x = ((lng + 172) / 42) * 100; // percentage across
    const y = ((72 - lat) / 18) * 100; // percentage down
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <div ref={ref} className={cn("relative rounded-lg overflow-hidden bg-slate-900", className)}>
      {/* Map Controls - Top Left */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
        <div className="bg-card/95 backdrop-blur-sm p-1.5 rounded-lg shadow-lg border border-border flex gap-1">
          {(['dark', 'satellite', 'terrain', 'standard'] as MapLayerType[]).map((layer) => (
            <Button
              key={layer}
              variant={mapLayer === layer ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMapLayer(layer)}
              className="text-xs capitalize h-7 px-2"
            >
              {layer}
            </Button>
          ))}
        </div>
      </div>

      {/* Zoom Controls - Top Right */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1">
        <div className="bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(zoom === 'local' ? 'regional' : zoom === 'regional' ? 'state' : 'local')}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(zoom === 'local' ? 'regional' : zoom === 'regional' ? 'state' : 'state')}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Interactive SVG Map of Alaska */}
      <div 
        className="relative h-[500px] w-full transition-transform duration-500"
        style={getZoomStyles()}
      >
        {/* Background Map Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Alaska_in_United_States_%28US50%29.svg/800px-Alaska_in_United_States_%28US50%29.svg.png')`,
            filter: mapLayer === 'dark' ? 'invert(1) hue-rotate(180deg)' : 
                   mapLayer === 'satellite' ? 'saturate(1.2)' : 'none'
          }}
        />

        {/* Alaska Shape Overlay */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          {/* Alaska outline - simplified path */}
          <path
            d="M15,30 L25,20 L45,15 L65,20 L80,30 L85,45 L90,55 L85,70 L70,80 L50,85 L30,80 L20,70 L15,55 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-accent/30"
          />

          {/* City Markers */}
          {cities.map((city) => {
            const pos = getCityPosition(city.lat, city.lng);
            const isSelected = selectedLocation === city.name;
            const isHovered = hoveredCity === city.name;
            const tempColor = city.temp < 0 ? '#60a5fa' : city.temp < 32 ? '#94a3b8' : city.temp < 50 ? '#22c55e' : '#f59e0b';
            
            return (
              <g
                key={city.name}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => onLocationSelect?.(city.name)}
                onMouseEnter={() => setHoveredCity(city.name)}
                onMouseLeave={() => setHoveredCity(null)}
                className="cursor-pointer"
              >
                {/* Pulse animation for selected */}
                {isSelected && (
                  <circle
                    r="4"
                    fill="none"
                    stroke={tempColor}
                    strokeWidth="0.3"
                    className="animate-ping"
                  />
                )}
                
                {/* Marker background */}
                <circle
                  r={isSelected || isHovered ? "3" : "2"}
                  fill={tempColor}
                  stroke="white"
                  strokeWidth="0.3"
                  className="transition-all duration-200"
                />
                
                {/* Temperature label */}
                <text
                  y="-4"
                  textAnchor="middle"
                  className="text-[2.5px] font-bold fill-current"
                  style={{ fill: tempColor }}
                >
                  {city.temp}°
                </text>

                {/* City name (show on hover or selection) */}
                {(isHovered || isSelected) && (
                  <g>
                    <rect
                      x="-8"
                      y="2"
                      width="16"
                      height="4"
                      rx="0.5"
                      fill="hsl(var(--card))"
                      stroke="hsl(var(--border))"
                      strokeWidth="0.1"
                    />
                    <text
                      y="4.8"
                      textAnchor="middle"
                      className="text-[2px] fill-current"
                      style={{ fill: 'hsl(var(--foreground))' }}
                    >
                      {city.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-3 left-3 z-20">
        <div className="bg-card/95 backdrop-blur-sm p-1.5 rounded-lg shadow-lg border border-border flex gap-1">
          <Button
            variant={zoom === 'state' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setZoom('state')}
            className="text-xs h-7 px-3"
          >
            State
          </Button>
          <Button
            variant={zoom === 'regional' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setZoom('regional')}
            className="text-xs h-7 px-3"
          >
            Regional
          </Button>
          <Button
            variant={zoom === 'local' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setZoom('local')}
            className="text-xs h-7 px-3"
          >
            Local
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 z-20 bg-card/95 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-border">
        <div className="text-[10px] font-semibold text-muted-foreground mb-1">Temperature</div>
        <div className="flex gap-1 items-center text-[10px]">
          <div className="w-3 h-3 rounded bg-blue-400" /> &lt;0°
          <div className="w-3 h-3 rounded bg-slate-400 ml-1" /> 0-32°
          <div className="w-3 h-3 rounded bg-green-500 ml-1" /> 32-50°
          <div className="w-3 h-3 rounded bg-amber-500 ml-1" /> &gt;50°
        </div>
      </div>

      {/* Selected City Detail Card */}
      {selectedLocation && (
        <div className="absolute top-16 left-3 z-20 bg-card/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border min-w-[180px]">
          {(() => {
            const city = cities.find(c => c.name === selectedLocation);
            if (!city) return null;
            return (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="font-semibold text-sm">{city.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {getWeatherIcon(city.condition, 'h-8 w-8')}
                  <div>
                    <div className="text-2xl font-bold">{city.temp}°F</div>
                    <div className="text-xs text-muted-foreground">{city.condition}</div>
                  </div>
                </div>
                {city.high !== undefined && city.low !== undefined && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    H: {city.high}° / L: {city.low}°
                  </div>
                )}
                {city.humidity !== undefined && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Humidity: {city.humidity}%
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* Data source attribution */}
      <div className="absolute bottom-12 right-3 z-20 text-[9px] text-muted-foreground bg-card/80 px-2 py-1 rounded">
        Data: National Weather Service Alaska
      </div>
    </div>
  );
});

AlaskaWeatherMap.displayName = 'AlaskaWeatherMap';
