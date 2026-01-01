import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Droplets, Thermometer, Eye, Sunrise, Sunset, MapPin, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { WeatherAlertTicker } from './WeatherAlertTicker';

interface WeatherData {
  location: string;
  temperature_f: number | null;
  condition: string | null;
  high_f: number | null;
  low_f: number | null;
  humidity: number | null;
  wind_mph: number | null;
  wind_direction: string | null;
  updated_at: string | null;
}

const WeatherIcon = ({ condition, className }: { condition?: string | null; className?: string }) => {
  const iconClass = className || 'h-10 w-10';
  switch (condition?.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return <Sun className={`${iconClass} text-accent`} />;
    case 'rain':
    case 'rainy':
      return <CloudRain className={`${iconClass} text-secondary`} />;
    case 'snow':
    case 'snowy':
      return <Snowflake className={`${iconClass} text-muted-foreground`} />;
    case 'partly cloudy':
      return <Cloud className={`${iconClass} text-muted-foreground`} />;
    default:
      return <Cloud className={`${iconClass} text-muted-foreground`} />;
  }
};

// Calculate approximate sunrise/sunset for Anchorage
const getSunTimes = () => {
  const now = new Date();
  const month = now.getMonth();
  // Rough approximation for Anchorage
  const sunriseHours = [10, 9, 7, 6, 5, 4, 4, 5, 6, 8, 9, 10];
  const sunsetHours = [16, 17, 19, 20, 22, 23, 23, 21, 20, 18, 16, 15];
  return {
    sunrise: `${sunriseHours[month]}:30 AM`,
    sunset: `${sunsetHours[month] > 12 ? sunsetHours[month] - 12 : sunsetHours[month]}:30 PM`
  };
};

export function WeatherInlay() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const fetchWeather = async () => {
      const { data, error } = await supabase
        .from('weather')
        .select('*')
        .eq('location', 'Anchorage')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setWeather(data);
        if (data.updated_at) {
          const updated = new Date(data.updated_at);
          setLastUpdate(updated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
        }
      }
      setLoading(false);
    };

    fetchWeather();

    const channel = supabase
      .channel('weather-inlay-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weather',
        },
        () => {
          fetchWeather();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sunTimes = getSunTimes();

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-primary to-primary/80 border-none overflow-hidden animate-pulse">
        <CardContent className="p-6">
          <div className="h-32 bg-primary-foreground/10 rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  // Calculate feels like temperature (simplified wind chill)
  const feelsLike = weather.temperature_f && weather.wind_mph 
    ? Math.round(weather.temperature_f - (weather.wind_mph * 0.7))
    : weather.temperature_f;

  return (
    <Card className="bg-gradient-to-br from-primary via-primary to-secondary/30 border-none overflow-hidden relative group">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent))_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary))_0%,transparent_50%)]" />
      </div>
      
      <CardContent className="p-0 relative">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-primary-foreground/10">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="font-display text-lg font-bold text-primary-foreground">{weather.location}</span>
            <span className="text-xs text-primary-foreground/50 font-sans">Alaska</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-primary-foreground/50 font-sans">
            <RefreshCw className="h-3 w-3" />
            {lastUpdate}
          </div>
        </div>

        {/* Main Weather Display */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-5">
          {/* Current Temp */}
          <div className="col-span-2 sm:col-span-2 flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <WeatherIcon condition={weather.condition} className="h-12 w-12 sm:h-16 sm:w-16" />
              <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-0.5 sm:p-1">
                <Thermometer className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-destructive" />
              </div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-display font-bold text-primary-foreground leading-none">
                {weather.temperature_f}°
              </div>
              <div className="text-xs sm:text-sm text-primary-foreground/70 font-serif mt-1">
                {weather.condition}
              </div>
              <div className="text-[10px] sm:text-xs text-primary-foreground/50 font-sans mt-0.5">
                Feels like {feelsLike}°F
              </div>
            </div>
          </div>

          {/* High/Low */}
          <div className="col-span-2 sm:col-span-1 flex sm:flex-col justify-center gap-3 sm:gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-primary-foreground/10">
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <Sun className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
              <span className="font-sans text-xs sm:text-sm font-medium">H: {weather.high_f}°</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <Snowflake className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
              <span className="font-sans text-xs sm:text-sm font-medium">L: {weather.low_f}°</span>
            </div>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-primary-foreground/10">
          <div className="bg-primary/50 p-2 sm:p-3 flex flex-col items-center justify-center group/stat hover:bg-primary/70 transition-colors">
            <Wind className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground/60 mb-1 group-hover/stat:text-accent transition-colors" />
            <span className="text-xs sm:text-sm font-sans font-medium text-primary-foreground">{weather.wind_mph} mph</span>
            <span className="text-[10px] sm:text-xs text-primary-foreground/50">{weather.wind_direction}</span>
          </div>
          <div className="bg-primary/50 p-2 sm:p-3 flex flex-col items-center justify-center group/stat hover:bg-primary/70 transition-colors">
            <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground/60 mb-1 group-hover/stat:text-secondary transition-colors" />
            <span className="text-xs sm:text-sm font-sans font-medium text-primary-foreground">{weather.humidity}%</span>
            <span className="text-[10px] sm:text-xs text-primary-foreground/50">Humidity</span>
          </div>
          <div className="bg-primary/50 p-2 sm:p-3 flex flex-col items-center justify-center group/stat hover:bg-primary/70 transition-colors">
            <Sunrise className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground/60 mb-1 group-hover/stat:text-accent transition-colors" />
            <span className="text-xs sm:text-sm font-sans font-medium text-primary-foreground">{sunTimes.sunrise}</span>
            <span className="text-[10px] sm:text-xs text-primary-foreground/50">Sunrise</span>
          </div>
          <div className="bg-primary/50 p-2 sm:p-3 flex flex-col items-center justify-center group/stat hover:bg-primary/70 transition-colors">
            <Sunset className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground/60 mb-1 group-hover/stat:text-accent transition-colors" />
            <span className="text-xs sm:text-sm font-sans font-medium text-primary-foreground">{sunTimes.sunset}</span>
            <span className="text-[10px] sm:text-xs text-primary-foreground/50">Sunset</span>
          </div>
        </div>

        {/* Weather Alert Ticker */}
        <WeatherAlertTicker />

        {/* Footer Link */}
        <Link 
          to="/weather" 
          className="block px-5 py-3 bg-primary-foreground/5 text-center text-sm font-sans text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/10 transition-all duration-200 group/link"
        >
          <span className="flex items-center justify-center gap-2">
            <Eye className="h-4 w-4" />
            View Full Forecast & Alaska Weather Map
            <span className="transform translate-x-0 group-hover/link:translate-x-1 transition-transform">→</span>
          </span>
        </Link>
      </CardContent>
    </Card>
  );
}
