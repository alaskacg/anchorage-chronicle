import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Droplets } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

const WeatherIcon = ({ condition, className }: { condition?: string | null; className?: string }) => {
  const iconClass = className || 'h-12 w-12';
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
    default:
      return <Cloud className={`${iconClass} text-muted-foreground`} />;
  }
};

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

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
      }
    };

    fetchWeather();

    // Subscribe to realtime weather updates
    const channel = supabase
      .channel('weather-changes')
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

  if (!weather) return null;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-lg text-primary flex items-center gap-2">
          Weather
          <span className="text-sm font-sans font-normal text-muted-foreground">
            {weather.location}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <WeatherIcon condition={weather.condition} />
          <div>
            <div className="text-4xl font-display font-bold text-foreground">
              {weather.temperature_f}°F
            </div>
            <div className="text-sm text-muted-foreground font-serif">
              {weather.condition}
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sun className="h-4 w-4 text-accent" />
            <span className="font-sans">H: {weather.high_f}°</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Snowflake className="h-4 w-4 text-secondary" />
            <span className="font-sans">L: {weather.low_f}°</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Droplets className="h-4 w-4" />
            <span className="font-sans">{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wind className="h-4 w-4" />
            <span className="font-sans">{weather.wind_mph} mph {weather.wind_direction}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
