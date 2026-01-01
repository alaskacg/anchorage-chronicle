import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BreakingNewsItem {
  id: string;
  message: string;
  link: string | null;
}

export function BreakingNewsTicker() {
  const [newsItems, setNewsItems] = useState<BreakingNewsItem[]>([]);

  useEffect(() => {
    // Fetch initial breaking news
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

    // Subscribe to realtime updates
    const channel = supabase
      .channel('breaking-news-changes')
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
    <div className="bg-destructive text-destructive-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center py-2">
          <div className="flex items-center gap-2 pr-4 border-r border-destructive-foreground/30 shrink-0">
            <AlertCircle className="h-4 w-4 animate-pulse-alert" />
            <span className="font-sans font-bold text-sm uppercase tracking-wide">Breaking</span>
          </div>
          <div className="overflow-hidden ml-4 flex-1">
            <div className="ticker-animate whitespace-nowrap inline-flex gap-16">
              {/* Duplicate items for seamless loop */}
              {[...newsItems, ...newsItems].map((item, index) => (
                <span key={`${item.id}-${index}`} className="font-serif text-sm">
                  {item.link ? (
                    <a href={item.link} className="hover:underline">
                      {item.message}
                    </a>
                  ) : (
                    item.message
                  )}
                  <span className="mx-8 text-destructive-foreground/50">◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
