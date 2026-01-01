import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import heroImage from '@/assets/aurora-alaska.jpg';

interface FeaturedArticleProps {
  slug: string;
  title: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  authorName?: string | null;
  publishedAt?: string | null;
  categoryName?: string;
  categorySlug?: string;
}

export function FeaturedArticle({
  slug,
  title,
  excerpt,
  imageUrl,
  authorName,
  publishedAt,
  categoryName,
  categorySlug,
}: FeaturedArticleProps) {
  const timeAgo = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true })
    : null;

  const displayImage = imageUrl || heroImage;

  return (
    <article className="relative overflow-hidden group">
      <Link to={`/article/${slug}`}>
        <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
          <img
            src={displayImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
            <div className="container mx-auto">
              {categoryName && (
                <Link
                  to={`/section/${categorySlug}`}
                  className="inline-block bg-accent text-accent-foreground px-4 py-1.5 text-xs font-sans font-bold uppercase tracking-wider mb-4 hover:bg-accent/90 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {categoryName}
                </Link>
              )}
              
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight mb-4 max-w-4xl">
                {title}
              </h2>
              
              {excerpt && (
                <p className="text-primary-foreground/90 font-serif text-lg md:text-xl line-clamp-2 max-w-3xl mb-4">
                  {excerpt}
                </p>
              )}
              
              <div className="flex items-center gap-6 text-sm text-primary-foreground/80 font-sans">
                {authorName && (
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {authorName}
                  </span>
                )}
                {timeAgo && (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {timeAgo}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
