import { useEffect, useState } from 'react';
import { AlertTriangle, Info, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Alert {
  id: string;
  title: string;
  message: string;
  alert_type: string;
  severity: string;
  link: string | null;
}

export function WeatherAlertTicker() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('is_active', true)
        .order('severity', { ascending: false });

      if (!error && data) {
        // Filter to weather-related alerts
        const weatherAlerts = data.filter(
          (a) => a.alert_type === 'weather' || a.alert_type === 'advisory'
        );
        setAlerts(weatherAlerts.length > 0 ? weatherAlerts : data.slice(0, 2));
      }
    };

    fetchAlerts();

    const channel = supabase
      .channel('weather-alerts-ticker')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts',
        },
        () => {
          fetchAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (alerts.length === 0) return null;

  const SeverityIcon = ({ severity }: { severity: string }) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-3 w-3" />;
      case 'warning':
        return <Bell className="h-3 w-3" />;
      default:
        return <Info className="h-3 w-3" />;
    }
  };

  const severityColors = {
    info: 'text-destructive bg-destructive/10',
    warning: 'text-destructive bg-destructive/10',
    critical: 'text-destructive bg-destructive/10',
  };

  return (
    <div className="bg-primary-foreground/5 border-t border-primary-foreground/10">
      <div className="overflow-hidden">
        <div className="ticker-animate-slow whitespace-nowrap inline-flex items-center py-2 gap-8">
          {[...alerts, ...alerts].map((alert, index) => (
            <span
              key={`${alert.id}-${index}`}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-sans ${
                severityColors[alert.severity as keyof typeof severityColors] || severityColors.info
              }`}
            >
              <SeverityIcon severity={alert.severity} />
              <span className="font-bold">{alert.title}:</span>
              <span className="opacity-90">{alert.message}</span>
              {alert.link && (
                <a
                  href={alert.link}
                  className="underline hover:no-underline ml-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  More →
                </a>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
