import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BreakingNewsItem {
  id: string;
  message: string;
  link: string | null;
}

export function InlineBreakingNews() {
  const [newsItems, setNewsItems] = useState<BreakingNewsItem[]>([]);

  useEffect(() => {
    const fetchBreakingNews = async () => {
      const { data, error } = await supabase
        .from('breaking_news')
        .select('id, message, link')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (!error && data) {
        setNewsItems(data);
      }
    };

    fetchBreakingNews();

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

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (newsItems.length === 0) return null;

  return (
    <div className="bg-destructive/10 border-b border-destructive/20 overflow-hidden">
      <div className="flex items-center py-1.5 px-3">
        <div className="flex items-center gap-1.5 pr-3 border-r border-destructive/30 shrink-0">
          <AlertCircle className="h-3 w-3 text-destructive animate-pulse" />
          <span className="font-sans font-bold text-xs uppercase tracking-wide text-destructive">
            Breaking
          </span>
        </div>
        <div className="overflow-hidden ml-3 flex-1">
          <div className="ticker-animate-slow whitespace-nowrap inline-flex gap-12">
            {[...newsItems, ...newsItems].map((item, index) => (
              <span key={`${item.id}-${index}`} className="font-serif text-xs text-foreground">
                {item.link ? (
                  <a href={item.link} className="hover:underline hover:text-destructive transition-colors">
                    {item.message}
                  </a>
                ) : (
                  item.message
                )}
                <span className="mx-6 text-muted-foreground/50">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
