import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  authorName?: string | null;
  publishedAt?: string | null;
  categoryName?: string;
  categorySlug?: string;
  variant?: 'default' | 'featured' | 'compact' | 'headline';
}

export function ArticleCard({
  slug,
  title,
  excerpt,
  imageUrl,
  authorName,
  publishedAt,
  categoryName,
  categorySlug,
  variant = 'default',
}: ArticleCardProps) {
  const timeAgo = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true })
    : null;

  if (variant === 'headline') {
    return (
      <article className="article-card group">
        <Link to={`/article/${slug}`}>
          {imageUrl && (
            <div className="relative overflow-hidden mb-4">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-64 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {categoryName && (
                  <span className="inline-block bg-accent text-accent-foreground px-3 py-1 text-xs font-sans font-bold uppercase tracking-wide mb-3">
                    {categoryName}
                  </span>
                )}
                <h2 className="font-display text-2xl md:text-4xl font-bold text-primary-foreground leading-tight mb-2">
                  {title}
                </h2>
                {excerpt && (
                  <p className="text-primary-foreground/90 font-serif text-base md:text-lg line-clamp-2">
                    {excerpt}
                  </p>
                )}
              </div>
            </div>
          )}
        </Link>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="article-card bg-card border border-border overflow-hidden group">
        <Link to={`/article/${slug}`}>
          {imageUrl && (
            <div className="overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <div className="p-5">
            {categoryName && (
              <Link
                to={`/section/${categorySlug}`}
                className="inline-block text-accent font-sans text-xs font-bold uppercase tracking-wide mb-2 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {categoryName}
              </Link>
            )}
            <h3 className="font-display text-xl font-bold text-foreground leading-tight mb-2 group-hover:text-accent transition-colors">
              {title}
            </h3>
            {excerpt && (
              <p className="text-muted-foreground font-serif text-sm line-clamp-3 mb-3">
                {excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-sans">
              {authorName && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {authorName}
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
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="article-card group py-3 border-b border-border last:border-b-0">
        <Link to={`/article/${slug}`} className="flex gap-4">
          {imageUrl && (
            <div className="shrink-0 overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                className="w-20 h-20 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {categoryName && (
              <span className="text-accent font-sans text-xs font-bold uppercase tracking-wide">
                {categoryName}
              </span>
            )}
            <h4 className="font-display text-sm font-bold text-foreground leading-tight group-hover:text-accent transition-colors line-clamp-2">
              {title}
            </h4>
            {timeAgo && (
              <span className="text-xs text-muted-foreground font-sans mt-1 block">
                {timeAgo}
              </span>
            )}
          </div>
        </Link>
      </article>
    );
  }

  // Default variant
  return (
    <article className="article-card bg-card border border-border p-5 group">
      <Link to={`/article/${slug}`}>
        {categoryName && (
          <span className="inline-block text-accent font-sans text-xs font-bold uppercase tracking-wide mb-2">
            {categoryName}
          </span>
        )}
        <h3 className="font-display text-lg font-bold text-foreground leading-tight mb-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        {excerpt && (
          <p className="text-muted-foreground font-serif text-sm line-clamp-2 mb-3">
            {excerpt}
          </p>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-sans">
          {authorName && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {authorName}
            </span>
          )}
          {timeAgo && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}
