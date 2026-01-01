import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Headline {
  id: string;
  slug: string;
  title: string;
  publishedAt?: string | null;
  categoryName?: string;
  categorySlug?: string;
}

interface QuickHeadlinesProps {
  headlines: Headline[];
  variant?: 'default' | 'compact' | 'numbered';
}

export function QuickHeadlines({ headlines, variant = 'default' }: QuickHeadlinesProps) {
  if (headlines.length === 0) return null;

  return (
    <div className="divide-y divide-border">
      {headlines.map((headline, index) => {
        const timeAgo = headline.publishedAt
          ? formatDistanceToNow(new Date(headline.publishedAt), { addSuffix: true })
          : null;

        return (
          <Link
            key={headline.id}
            to={`/article/${headline.slug}`}
            className="group flex items-start gap-3 py-3 px-4 hover:bg-muted/50 transition-colors first:pt-4 last:pb-4"
          >
            {variant === 'numbered' && (
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-sans font-bold group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                {index + 1}
              </span>
            )}
            
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {headline.title}
              </h4>
              
              <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground font-sans">
                {headline.categoryName && (
                  <span className="text-accent font-medium uppercase tracking-wide">
                    {headline.categoryName}
                  </span>
                )}
                {timeAgo && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timeAgo}
                  </span>
                )}
              </div>
            </div>
            
            <ChevronRight className="flex-shrink-0 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
          </Link>
        );
      })}
    </div>
  );
}
