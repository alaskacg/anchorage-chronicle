import { cn } from '@/lib/utils';

interface WindyMapEmbedProps {
  className?: string;
  height?: string;
  /** Compact mode for sidebar/widget use */
  compact?: boolean;
}

/**
 * Windy.com live weather radar embed focused on Alaska
 * Dark gray theme with cool-colored radar visualization
 */
export function WindyMapEmbed({ 
  className, 
  height = "500px",
  compact = false 
}: WindyMapEmbedProps) {
  // Alaska center coordinates
  const lat = 64.2;
  const lon = -152.5;
  const zoom = compact ? 3 : 4;

  // Windy embed URL with dark theme and radar overlay
  // overlay: rain, wind, clouds, waves, etc.
  // Using 'rain' for cool-colored radar
  const windyUrl = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=100%25&height=${compact ? 250 : 500}&zoom=${zoom}&level=surface&overlay=radar&product=radar&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=mph&metricTemp=%C2%B0F&radarRange=-1`;

  return (
    <div 
      className={cn(
        "relative w-full overflow-hidden bg-card",
        compact ? "rounded-lg border border-border" : "",
        className
      )}
      style={{ height }}
    >
      <iframe
        src={windyUrl}
        frameBorder="0"
        className="w-full h-full"
        title="Alaska Weather Radar - Windy.com"
        loading="lazy"
        allow="fullscreen"
      />
      
      {/* Overlay gradient for better integration */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card/50 to-transparent pointer-events-none" />
      
      {/* Attribution */}
      <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground/60 pointer-events-none">
        Powered by Windy.com
      </div>
    </div>
  );
}
