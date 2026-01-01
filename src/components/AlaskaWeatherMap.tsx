import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Cloud, Snowflake, Sun, CloudRain, Wind, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Fix default marker icons for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Alaska city data with weather info
const alaskaCities = [
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
  { name: 'Palmer', lat: 61.5994, lng: -149.1127, temp: 26, condition: 'Partly Cloudy' },
  { name: 'Wasilla', lat: 61.5814, lng: -149.4394, temp: 27, condition: 'Cloudy' },
  { name: 'Seward', lat: 60.1042, lng: -149.4422, temp: 34, condition: 'Rain' },
  { name: 'Homer', lat: 59.6425, lng: -151.5483, temp: 36, condition: 'Cloudy' },
  { name: 'Kenai', lat: 60.5544, lng: -151.2583, temp: 30, condition: 'Partly Cloudy' },
  { name: 'Cordova', lat: 60.5431, lng: -145.7575, temp: 35, condition: 'Rain' },
  { name: 'Denali Park', lat: 63.7331, lng: -148.9142, temp: 5, condition: 'Snow' },
];

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
    case 'sunny':
      return <Sun className="h-4 w-4 text-accent" />;
    case 'rain':
    case 'rainy':
      return <CloudRain className="h-4 w-4 text-secondary" />;
    case 'snow':
    case 'snowy':
      return <Snowflake className="h-4 w-4 text-blue-300" />;
    case 'cloudy':
      return <Cloud className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Cloud className="h-4 w-4 text-muted-foreground" />;
  }
};

// Custom weather marker icon
const createWeatherIcon = (temp: number, condition: string) => {
  const color = temp < 0 ? '#60a5fa' : temp < 32 ? '#94a3b8' : temp < 50 ? '#22c55e' : '#f59e0b';
  const conditionIcon = condition.toLowerCase().includes('snow') ? '❄️' : 
                        condition.toLowerCase().includes('rain') ? '🌧️' :
                        condition.toLowerCase().includes('clear') ? '☀️' : '☁️';
  
  return L.divIcon({
    className: 'custom-weather-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, hsl(220 35% 12%), hsl(220 35% 18%));
        border: 2px solid ${color};
        border-radius: 8px;
        padding: 4px 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 50px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      ">
        <span style="font-size: 12px; font-weight: bold; color: ${color};">${temp}°F</span>
        <span style="font-size: 14px;">${conditionIcon}</span>
      </div>
    `,
    iconSize: [50, 40],
    iconAnchor: [25, 40],
    popupAnchor: [0, -40],
  });
};

type MapLayerType = 'standard' | 'satellite' | 'terrain' | 'dark';
type OverlayType = 'precipitation' | 'temperature' | 'wind' | 'snow' | 'clouds' | 'none';

interface MapControllerProps {
  center: [number, number];
  zoom: number;
}

function MapController({ center, zoom }: MapControllerProps) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

interface AlaskaWeatherMapProps {
  className?: string;
  selectedLocation?: string;
  onLocationSelect?: (location: string) => void;
}

export const AlaskaWeatherMap = forwardRef<any, AlaskaWeatherMapProps>(({ 
  className, 
  selectedLocation,
  onLocationSelect 
}, ref) => {
  const mapRef = useRef<L.Map | null>(null);
  const [mapLayer, setMapLayer] = useState<MapLayerType>('dark');
  const [overlay, setOverlay] = useState<OverlayType>('none');
  const [center, setCenter] = useState<[number, number]>([64.2008, -152.4937]);
  const [zoom, setZoom] = useState(4);

  useImperativeHandle(ref, () => ({
    setZoom: (level: number) => setZoom(level),
    setCenter: (lat: number, lng: number) => setCenter([lat, lng]),
    flyTo: (lat: number, lng: number, zoomLevel: number) => {
      mapRef.current?.flyTo([lat, lng], zoomLevel, { duration: 1.5 });
    }
  }));

  const tileLayers: Record<MapLayerType, { url: string; attribution: string }> = {
    standard: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '© Esri'
    },
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '© OpenTopoMap'
    },
    dark: {
      url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
      attribution: '© Stadia Maps'
    }
  };

  const handleZoomLevel = (level: 'state' | 'regional' | 'local') => {
    switch (level) {
      case 'state':
        setCenter([64.2008, -152.4937]);
        setZoom(4);
        break;
      case 'regional':
        setCenter([61.2181, -149.9003]);
        setZoom(6);
        break;
      case 'local':
        setCenter([61.2181, -149.9003]);
        setZoom(9);
        break;
    }
  };

  const selectedCity = alaskaCities.find(c => c.name === selectedLocation);

  useEffect(() => {
    if (selectedCity) {
      setCenter([selectedCity.lat, selectedCity.lng]);
      setZoom(8);
    }
  }, [selectedLocation]);

  return (
    <div className={cn("relative rounded-lg overflow-hidden", className)}>
      {/* Map Controls - Top */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap gap-2">
        <div className="bg-card/95 backdrop-blur-sm p-1.5 rounded-lg shadow-lg border border-border flex gap-1">
          {(['dark', 'standard', 'satellite', 'terrain'] as MapLayerType[]).map((layer) => (
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

      {/* Weather Overlay Controls */}
      <div className="absolute top-3 right-12 z-[1000]">
        <div className="bg-card/95 backdrop-blur-sm p-1.5 rounded-lg shadow-lg border border-border flex flex-wrap gap-1">
          {[
            { id: 'none', icon: Cloud, label: 'Off' },
            { id: 'precipitation', icon: CloudRain, label: 'Rain' },
            { id: 'snow', icon: Snowflake, label: 'Snow' },
            { id: 'temperature', icon: Thermometer, label: 'Temp' },
            { id: 'wind', icon: Wind, label: 'Wind' },
          ].map((item) => (
            <Button
              key={item.id}
              variant={overlay === item.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setOverlay(item.id as OverlayType)}
              className="h-7 px-2 gap-1"
              title={item.label}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span className="text-xs hidden sm:inline">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Zoom Level Controls */}
      <div className="absolute bottom-3 left-3 z-[1000]">
        <div className="bg-card/95 backdrop-blur-sm p-1.5 rounded-lg shadow-lg border border-border flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleZoomLevel('state')}
            className="text-xs h-7 px-3"
          >
            State
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleZoomLevel('regional')}
            className="text-xs h-7 px-3"
          >
            Regional
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleZoomLevel('local')}
            className="text-xs h-7 px-3"
          >
            Local
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={zoom}
        className="h-[500px] w-full"
        zoomControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
      >
        <MapController center={center} zoom={zoom} />
        <ZoomControl position="bottomright" />
        
        <TileLayer
          url={tileLayers[mapLayer].url}
          attribution={tileLayers[mapLayer].attribution}
        />

        {/* Weather overlay layer */}
        {overlay !== 'none' && (
          <TileLayer
            url={`https://tile.openweathermap.org/map/${overlay}_new/{z}/{x}/{y}.png?appid=demo`}
            opacity={0.6}
          />
        )}

        {/* City markers with weather */}
        {alaskaCities.map((city) => (
          <Marker
            key={city.name}
            position={[city.lat, city.lng]}
            icon={createWeatherIcon(city.temp, city.condition)}
            eventHandlers={{
              click: () => {
                onLocationSelect?.(city.name);
              }
            }}
          >
            <Popup className="weather-popup">
              <div className="p-2 min-w-[150px]">
                <h3 className="font-bold text-foreground text-sm mb-1">{city.name}</h3>
                <div className="flex items-center gap-2">
                  {getWeatherIcon(city.condition)}
                  <span className="text-lg font-bold">{city.temp}°F</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{city.condition}</p>
                {onLocationSelect && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-2 text-xs h-7"
                    onClick={() => onLocationSelect(city.name)}
                  >
                    View Forecast
                  </Button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-card/95 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-border">
        <div className="text-[10px] font-semibold text-muted-foreground mb-1">Temperature</div>
        <div className="flex gap-1 items-center text-[10px]">
          <div className="w-3 h-3 rounded bg-blue-400" /> &lt;0°
          <div className="w-3 h-3 rounded bg-slate-400 ml-1" /> 0-32°
          <div className="w-3 h-3 rounded bg-green-500 ml-1" /> 32-50°
          <div className="w-3 h-3 rounded bg-amber-500 ml-1" /> &gt;50°
        </div>
      </div>

      {/* Data source attribution */}
      <div className="absolute bottom-12 right-3 z-[1000] text-[9px] text-muted-foreground bg-card/80 px-2 py-1 rounded">
        Data: National Weather Service Alaska
      </div>
    </div>
  );
});

AlaskaWeatherMap.displayName = 'AlaskaWeatherMap';
