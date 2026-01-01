import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SectionHero } from '@/components/SectionHero';
import { SectionHeader } from '@/components/SectionHeader';
import { RandomAlaskaQuote } from '@/components/AlaskaQuote';
import { AdBanner } from '@/components/ads/AdBanner';
import { BreakingNewsTicker } from '@/components/BreakingNewsTicker';
import { AlertBanner } from '@/components/AlertBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, Sun, CloudRain, Snowflake, Wind, Droplets, Thermometer, 
  Eye, Compass, AlertTriangle, MapPin, Calendar, Clock, 
  Mountain, Waves, Plane, Ship, TrendingUp, TrendingDown,
  CloudSnow, CloudLightning, Sunrise, Sunset, Moon, Navigation
} from 'lucide-react';

import weatherImage from '@/assets/section-weather.jpg';

interface WeatherData {
  location: string;
  temperature_f: number | null;
  condition: string | null;
  high_f: number | null;
  low_f: number | null;
  humidity: number | null;
  wind_mph: number | null;
  wind_direction: string | null;
}

interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
  wind: number;
}

// Mock data for demonstration - in production, these would come from weather APIs
const mockForecasts: ForecastDay[] = [
  { date: '2026-01-01', high: 28, low: 15, condition: 'Partly Cloudy', precipitation: 10, wind: 8 },
  { date: '2026-01-02', high: 25, low: 12, condition: 'Snow', precipitation: 80, wind: 15 },
  { date: '2026-01-03', high: 22, low: 8, condition: 'Snow', precipitation: 90, wind: 20 },
  { date: '2026-01-04', high: 18, low: 5, condition: 'Clear', precipitation: 5, wind: 10 },
  { date: '2026-01-05', high: 20, low: 10, condition: 'Cloudy', precipitation: 20, wind: 12 },
  { date: '2026-01-06', high: 24, low: 14, condition: 'Partly Cloudy', precipitation: 15, wind: 8 },
  { date: '2026-01-07', high: 26, low: 16, condition: 'Clear', precipitation: 0, wind: 5 },
];

const alaskaLocations = [
  { name: 'Anchorage', lat: 61.2181, lng: -149.9003 },
  { name: 'Fairbanks', lat: 64.8378, lng: -147.7164 },
  { name: 'Juneau', lat: 58.3019, lng: -134.4197 },
  { name: 'Barrow (Utqiaġvik)', lat: 71.2906, lng: -156.7886 },
  { name: 'Kodiak', lat: 57.7900, lng: -152.4072 },
  { name: 'Bethel', lat: 60.7922, lng: -161.7558 },
  { name: 'Nome', lat: 64.5011, lng: -165.4064 },
  { name: 'Ketchikan', lat: 55.3422, lng: -131.6461 },
  { name: 'Sitka', lat: 57.0531, lng: -135.3300 },
  { name: 'Valdez', lat: 61.1309, lng: -146.3483 },
];

const radarOptions = [
  { id: 'precipitation', label: 'Precipitation', icon: CloudRain },
  { id: 'snow', label: 'Snow Depth', icon: Snowflake },
  { id: 'temperature', label: 'Temperature', icon: Thermometer },
  { id: 'wind', label: 'Wind Speed', icon: Wind },
  { id: 'visibility', label: 'Visibility', icon: Eye },
  { id: 'satellite', label: 'Satellite', icon: Cloud },
];

const WeatherIcon = ({ condition, className = 'h-8 w-8' }: { condition?: string | null; className?: string }) => {
  const iconClass = className;
  switch (condition?.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return <Sun className={`${iconClass} text-accent`} />;
    case 'rain':
    case 'rainy':
      return <CloudRain className={`${iconClass} text-secondary`} />;
    case 'snow':
    case 'snowy':
      return <Snowflake className={`${iconClass} text-blue-300`} />;
    case 'partly cloudy':
      return <Cloud className={`${iconClass} text-muted-foreground`} />;
    case 'cloudy':
      return <Cloud className={`${iconClass} text-muted-foreground`} />;
    case 'thunderstorm':
      return <CloudLightning className={`${iconClass} text-yellow-500`} />;
    default:
      return <Cloud className={`${iconClass} text-muted-foreground`} />;
  }
};

const WeatherPage = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('Anchorage');
  const [selectedRadar, setSelectedRadar] = useState('precipitation');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Current time for Alaska
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      const { data, error } = await supabase
        .from('weather')
        .select('*')
        .eq('location', selectedLocation)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setWeather(data);
        setLastUpdate(new Date());
      } else {
        // Fallback mock data if no data for this location
        setWeather({
          location: selectedLocation,
          temperature_f: Math.floor(Math.random() * 30) - 10,
          condition: ['Clear', 'Partly Cloudy', 'Snow', 'Cloudy'][Math.floor(Math.random() * 4)],
          high_f: Math.floor(Math.random() * 20) + 10,
          low_f: Math.floor(Math.random() * 20) - 15,
          humidity: Math.floor(Math.random() * 50) + 30,
          wind_mph: Math.floor(Math.random() * 25) + 5,
          wind_direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        });
        setLastUpdate(new Date());
      }
    };

    fetchWeather();

    // Subscribe to realtime weather updates
    const channel = supabase
      .channel('weather-page-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'weather' }, () => {
        fetchWeather();
      })
      .subscribe();

    // Auto refresh every 5 minutes
    const refreshInterval = setInterval(fetchWeather, 5 * 60 * 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(refreshInterval);
    };
  }, [selectedLocation]);

  // Calculate sunrise/sunset times (approximate for Alaska)
  const sunTimes = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    // Simplified calculation - in production use a proper library
    const isWinter = month >= 10 || month <= 2;
    return {
      sunrise: isWinter ? '10:15 AM' : '5:30 AM',
      sunset: isWinter ? '3:45 PM' : '11:30 PM',
      daylight: isWinter ? '5h 30m' : '18h 00m',
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AlertBanner />
      <BreakingNewsTicker />
      <Header />

      <main className="flex-1">
        <SectionHero
          title="Alaska Weather Center"
          description="Comprehensive weather forecasting, radar, and conditions for the Last Frontier"
          imageUrl={weatherImage}
          breadcrumbs={[{ label: 'Weather', href: '/weather' }]}
        />

        <div className="container mx-auto px-4 py-10">
          {/* Weather Alert Banner */}
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-bold text-destructive">Winter Storm Warning</h3>
                <p className="text-sm text-foreground mt-1">
                  Heavy snow expected across Southcentral Alaska. 8-14 inches possible in mountain passes. 
                  Travel may become difficult. Updated: {currentTime.toLocaleTimeString('en-US', { timeZone: 'America/Anchorage' })} AKST
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Weather Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Location Selector & Current Conditions */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-primary text-primary-foreground">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <CardTitle className="font-display">Current Conditions</CardTitle>
                    </div>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="bg-primary-foreground/10 border border-primary-foreground/30 text-primary-foreground px-3 py-1.5 text-sm rounded focus:outline-none focus:border-accent"
                    >
                      {alaskaLocations.map((loc) => (
                        <option key={loc.name} value={loc.name} className="text-foreground bg-background">
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {weather ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Main Temperature */}
                      <div className="flex items-center gap-6">
                        <WeatherIcon condition={weather.condition} className="h-24 w-24" />
                        <div>
                          <div className="text-6xl font-display font-bold text-foreground">
                            {weather.temperature_f}°<span className="text-2xl">F</span>
                          </div>
                          <div className="text-lg font-serif text-muted-foreground">
                            {weather.condition}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1 text-destructive">
                              <TrendingUp className="h-4 w-4" /> H: {weather.high_f}°
                            </span>
                            <span className="flex items-center gap-1 text-secondary">
                              <TrendingDown className="h-4 w-4" /> L: {weather.low_f}°
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Weather Details Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Wind className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-wider">Wind</span>
                          </div>
                          <div className="font-display text-xl font-bold">
                            {weather.wind_mph} mph
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {weather.wind_direction}
                          </div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Droplets className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-wider">Humidity</span>
                          </div>
                          <div className="font-display text-xl font-bold">
                            {weather.humidity}%
                          </div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Sunrise className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-wider">Sunrise</span>
                          </div>
                          <div className="font-display text-xl font-bold">{sunTimes.sunrise}</div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Sunset className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-wider">Sunset</span>
                          </div>
                          <div className="font-display text-xl font-bold">{sunTimes.sunset}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48">
                      <div className="animate-pulse text-muted-foreground">Loading weather data...</div>
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
                    <span>Daylight: {sunTimes.daylight}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Radar Map */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <CardTitle className="font-display flex items-center gap-2">
                      <Navigation className="h-5 w-5 text-accent" />
                      Alaska Weather Radar
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 inline mr-1" />
                      {currentTime.toLocaleTimeString('en-US', { timeZone: 'America/Anchorage' })} AKST
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Radar Type Selector */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {radarOptions.map((option) => (
                      <Button
                        key={option.id}
                        variant={selectedRadar === option.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedRadar(option.id)}
                        className="flex items-center gap-2"
                      >
                        <option.icon className="h-4 w-4" />
                        {option.label}
                      </Button>
                    ))}
                  </div>

                  {/* Radar Map Placeholder - Using NOAA/NWS embeds */}
                  <div className="relative bg-muted rounded-lg overflow-hidden" style={{ height: '500px' }}>
                    <iframe
                      src="https://radar.weather.gov/ridge/standard/PACG_loop.gif"
                      title="Alaska Weather Radar"
                      className="absolute inset-0 w-full h-full border-0"
                      style={{ 
                        filter: selectedRadar === 'temperature' ? 'hue-rotate(180deg)' : 'none',
                        background: 'linear-gradient(180deg, hsl(var(--primary) / 0.1), hsl(var(--secondary) / 0.1))'
                      }}
                    />
                    {/* Fallback overlay with Alaska map */}
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/5 pointer-events-none">
                      <div className="text-center">
                        <Cloud className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
                        <p className="text-muted-foreground font-sans text-sm">
                          Loading {radarOptions.find(r => r.id === selectedRadar)?.label} radar...
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Data from National Weather Service Alaska Region
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Map Controls */}
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">Zoom:</span>
                      <Button variant="outline" size="sm">State</Button>
                      <Button variant="outline" size="sm">Regional</Button>
                      <Button variant="outline" size="sm">Local</Button>
                    </div>
                    <a 
                      href="https://www.weather.gov/afc/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      NWS Alaska →
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* 7-Day Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    7-Day Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {mockForecasts.map((day, index) => {
                      const date = new Date(day.date);
                      return (
                        <div
                          key={day.date}
                          className={`text-center p-3 rounded-lg transition-all hover:bg-accent/10 ${
                            index === 0 ? 'bg-accent/5 ring-1 ring-accent' : 'bg-muted/50'
                          }`}
                        >
                          <div className="text-xs font-sans font-medium text-muted-foreground mb-2">
                            {index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <WeatherIcon condition={day.condition} className="h-8 w-8 mx-auto mb-2" />
                          <div className="font-display font-bold text-foreground">{day.high}°</div>
                          <div className="text-sm text-muted-foreground">{day.low}°</div>
                          <div className="mt-2 text-xs text-secondary flex items-center justify-center gap-1">
                            <Droplets className="h-3 w-3" />
                            {day.precipitation}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Ad */}
              <AdBanner variant="large" />

              {/* Extended Forecast & Details */}
              <Tabs defaultValue="hourly" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="hourly">Hourly</TabsTrigger>
                  <TabsTrigger value="aviation">Aviation</TabsTrigger>
                  <TabsTrigger value="marine">Marine</TabsTrigger>
                  <TabsTrigger value="mountain">Mountain</TabsTrigger>
                </TabsList>
                
                <TabsContent value="hourly" className="mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex overflow-x-auto gap-4 pb-2">
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = (new Date().getHours() + i) % 24;
                          const temp = weather?.temperature_f 
                            ? weather.temperature_f + Math.floor(Math.sin(i / 3) * 5)
                            : 25;
                          return (
                            <div key={i} className="flex-shrink-0 text-center p-3 min-w-[60px] rounded bg-muted/30">
                              <div className="text-xs text-muted-foreground mb-2">
                                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                              </div>
                              <WeatherIcon 
                                condition={i < 6 || i > 18 ? 'Clear' : 'Partly Cloudy'} 
                                className="h-6 w-6 mx-auto mb-1" 
                              />
                              <div className="font-display font-bold text-sm">{temp}°</div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="aviation" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Plane className="h-8 w-8 text-accent flex-shrink-0" />
                        <div>
                          <h3 className="font-display font-bold text-lg">Aviation Weather</h3>
                          <p className="text-muted-foreground text-sm">
                            Current conditions for pilots and flight planning
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted/50 p-4 rounded">
                          <div className="text-xs text-muted-foreground uppercase mb-1">Ceiling</div>
                          <div className="font-display font-bold">5,000 ft</div>
                          <div className="text-xs text-secondary">VFR</div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded">
                          <div className="text-xs text-muted-foreground uppercase mb-1">Visibility</div>
                          <div className="font-display font-bold">10 SM</div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded">
                          <div className="text-xs text-muted-foreground uppercase mb-1">Winds Aloft</div>
                          <div className="font-display font-bold">NW 25 kt</div>
                          <div className="text-xs text-muted-foreground">at 6,000 ft</div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded">
                          <div className="text-xs text-muted-foreground uppercase mb-1">Icing</div>
                          <div className="font-display font-bold text-destructive">MODERATE</div>
                          <div className="text-xs text-muted-foreground">3,000-8,000 ft</div>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-primary/5 rounded border-l-4 border-accent">
                        <p className="text-sm font-mono">
                          METAR PANC 011756Z 32012KT 10SM FEW040 BKN060 M05/M12 A3021
                        </p>
                      </div>
                      <a 
                        href="https://aviationweather.gov/gfa/#area=ak" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-block mt-4 text-accent hover:underline text-sm"
                      >
                        View full aviation forecast →
                      </a>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="marine" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Ship className="h-8 w-8 text-accent flex-shrink-0" />
                        <div>
                          <h3 className="font-display font-bold text-lg">Marine Forecast</h3>
                          <p className="text-muted-foreground text-sm">
                            Conditions for Cook Inlet and Prince William Sound
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted/50 p-4 rounded">
                          <div className="text-xs text-muted-foreground uppercase mb-1">Wave Height</div>
                          <div className="font-display font-bold">3-5 ft</div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded">
                          <div className="text-xs text-muted-foreground uppercase mb-1">Sea Temp</div>
                          <div className="font-display font-bold">38°F</div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded">
                          <div className="text-xs text-muted-foreground uppercase mb-1">Wind</div>
                          <div className="font-display font-bold">NW 15-20 kt</div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded">
                          <div className="text-xs text-muted-foreground uppercase mb-1">Tide</div>
                          <div className="font-display font-bold">High 2:34 PM</div>
                          <div className="text-xs text-muted-foreground">+28.4 ft</div>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-destructive/10 rounded border-l-4 border-destructive">
                        <p className="text-sm font-bold text-destructive">SMALL CRAFT ADVISORY</p>
                        <p className="text-sm mt-1">Seas 5-7 feet expected this evening. Exercise caution.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="mountain" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Mountain className="h-8 w-8 text-accent flex-shrink-0" />
                        <div>
                          <h3 className="font-display font-bold text-lg">Mountain Weather</h3>
                          <p className="text-muted-foreground text-sm">
                            Backcountry conditions for Chugach and Alaska Range
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted/50 p-4 rounded">
                          <div className="text-xs text-muted-foreground uppercase mb-1">Avalanche Danger</div>
                          <div className="font-display font-bold text-accent">CONSIDERABLE</div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded">
                          <div className="text-xs text-muted-foreground uppercase mb-1">Snowpack</div>
                          <div className="font-display font-bold">48"</div>
                          <div className="text-xs text-muted-foreground">at 3,000 ft</div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded">
                          <div className="text-xs text-muted-foreground uppercase mb-1">Freezing Level</div>
                          <div className="font-display font-bold">1,500 ft</div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded">
                          <div className="text-xs text-muted-foreground uppercase mb-1">New Snow</div>
                          <div className="font-display font-bold">8-12"</div>
                          <div className="text-xs text-muted-foreground">expected</div>
                        </div>
                      </div>
                      <a 
                        href="https://www.cnfaic.org/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-block mt-4 text-accent hover:underline text-sm"
                      >
                        Chugach Avalanche Center →
                      </a>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Alaska Quote */}
              <RandomAlaskaQuote variant="featured" />
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* All Alaska Locations */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">Alaska Conditions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {alaskaLocations.map((loc) => (
                      <button
                        key={loc.name}
                        onClick={() => setSelectedLocation(loc.name)}
                        className={`w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left ${
                          selectedLocation === loc.name ? 'bg-accent/10' : ''
                        }`}
                      >
                        <span className="font-sans text-sm">{loc.name}</span>
                        <div className="flex items-center gap-2">
                          <Snowflake className="h-4 w-4 text-muted-foreground" />
                          <span className="font-display font-bold">
                            {Math.floor(Math.random() * 30) - 10}°
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <AdBanner variant="sidebar" adId="consulting" />

              {/* Weather Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">Weather Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a href="https://www.weather.gov/afc/" target="_blank" rel="noopener noreferrer" className="block p-3 bg-muted/50 hover:bg-accent/10 transition-colors rounded">
                    <div className="font-sans font-medium text-sm">NWS Anchorage</div>
                    <div className="text-xs text-muted-foreground">Official forecasts</div>
                  </a>
                  <a href="https://www.weather.gov/afg/" target="_blank" rel="noopener noreferrer" className="block p-3 bg-muted/50 hover:bg-accent/10 transition-colors rounded">
                    <div className="font-sans font-medium text-sm">NWS Fairbanks</div>
                    <div className="text-xs text-muted-foreground">Interior Alaska</div>
                  </a>
                  <a href="https://www.weather.gov/aawu/" target="_blank" rel="noopener noreferrer" className="block p-3 bg-muted/50 hover:bg-accent/10 transition-colors rounded">
                    <div className="font-sans font-medium text-sm">Alaska Aviation</div>
                    <div className="text-xs text-muted-foreground">Aviation weather</div>
                  </a>
                  <a href="https://www.cnfaic.org/" target="_blank" rel="noopener noreferrer" className="block p-3 bg-muted/50 hover:bg-accent/10 transition-colors rounded">
                    <div className="font-sans font-medium text-sm">Avalanche Center</div>
                    <div className="text-xs text-muted-foreground">Chugach forecast</div>
                  </a>
                </CardContent>
              </Card>

              <RandomAlaskaQuote variant="sidebar" />

              <AdBanner variant="sidebar" adId="boats" />

              {/* Aurora Forecast */}
              <Card className="bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 border-accent/30">
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Moon className="h-5 w-5 text-accent" />
                    Aurora Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="font-display text-4xl font-bold text-accent mb-2">Kp 4</div>
                    <div className="text-sm text-muted-foreground mb-4">MODERATE ACTIVITY</div>
                    <p className="text-xs text-muted-foreground">
                      Good chance of aurora viewing tonight if skies clear. Best viewing after midnight.
                    </p>
                  </div>
                  <a 
                    href="https://www.gi.alaska.edu/monitors/aurora-forecast" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-center text-accent hover:underline text-sm mt-4"
                  >
                    Full Aurora Forecast →
                  </a>
                </CardContent>
              </Card>

              <AdBanner variant="sidebar" adId="mining" />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WeatherPage;
