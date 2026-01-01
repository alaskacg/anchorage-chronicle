import { useEffect, useState } from 'react';
import { X, AlertTriangle, Info, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface Alert {
  id: string;
  title: string;
  message: string;
  alert_type: string;
  severity: string;
  link: string | null;
}

const severityStyles = {
  info: 'bg-secondary text-secondary-foreground',
  warning: 'bg-accent text-accent-foreground',
  critical: 'bg-destructive text-destructive-foreground',
};

const SeverityIcon = ({ severity }: { severity: string }) => {
  switch (severity) {
    case 'critical':
      return <AlertTriangle className="h-5 w-5" />;
    case 'warning':
      return <Bell className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
  }
};

export function AlertBanner() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('is_active', true)
        .order('severity', { ascending: false });

      if (!error && data) {
        setAlerts(data);
      }
    };

    fetchAlerts();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('alerts-changes')
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

  const visibleAlerts = alerts.filter((alert) => !dismissedIds.has(alert.id));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-0">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`${severityStyles[alert.severity as keyof typeof severityStyles] || severityStyles.info} ${
            alert.severity === 'critical' ? 'animate-pulse-alert' : ''
          }`}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <SeverityIcon severity={alert.severity} />
              <div className="flex-1">
                <span className="font-sans font-bold">{alert.title}: </span>
                <span className="font-serif">{alert.message}</span>
                {alert.link && (
                  <a href={alert.link} className="ml-2 underline hover:no-underline font-sans text-sm">
                    Learn more →
                  </a>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 hover:bg-transparent hover:opacity-70"
                onClick={() => setDismissedIds((prev) => new Set([...prev, alert.id]))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
