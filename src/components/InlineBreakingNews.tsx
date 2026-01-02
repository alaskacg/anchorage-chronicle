import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BreakingNewsItem {
  id: string;
  message: string;
  link: string | null;
}

export function InlineBreakingNews() {
  const [newsItems, setNewsItems] = useState<BreakingNewsItem[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const fetchBreakingNews = async () => {
      const { data, error } = await supabase
        .from('breaking_news')
        .select('id, message, link')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .limit(5);

      if (!error && data) {
        setNewsItems(data);
        setLastUpdate(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
      }
    };

    fetchBreakingNews();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('inline-breaking-news')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'breaking_news',
        },
        () => {
          fetchBreakingNews();
        }
      )
      .subscribe();

    // Also refresh every 2 minutes
    const interval = setInterval(fetchBreakingNews, 2 * 60 * 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  if (newsItems.length === 0) return null;

  return (
    <div className="border-b border-border bg-destructive/5">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-destructive/20">
        <AlertCircle className="h-3.5 w-3.5 text-destructive animate-pulse" />
        <span className="font-sans font-bold text-xs uppercase tracking-wide text-destructive">
          Breaking News
        </span>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
          <RefreshCw className="h-2.5 w-2.5" />
          Updated {lastUpdate}
        </span>
      </div>
      <div className="divide-y divide-border">
        {newsItems.map((item) => (
          <div key={item.id} className="px-4 py-2.5 hover:bg-destructive/5 transition-colors">
            {item.link ? (
              <a href={item.link} className="text-sm font-serif text-foreground hover:text-destructive transition-colors">
                {item.message}
              </a>
            ) : (
              <span className="text-sm font-serif text-foreground">{item.message}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
