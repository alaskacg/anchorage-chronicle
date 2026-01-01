import { Link } from 'react-router-dom';
import { Clock, User, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import heroImage from '@/assets/hero-denali.jpg';

interface CompactFeaturedArticleProps {
  slug: string;
  title: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  authorName?: string | null;
  publishedAt?: string | null;
  categoryName?: string;
  categorySlug?: string;
}

export function CompactFeaturedArticle({
  slug,
  title,
  excerpt,
  imageUrl,
  authorName,
  publishedAt,
  categoryName,
  categorySlug,
}: CompactFeaturedArticleProps) {
  const timeAgo = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true })
    : null;

  const displayImage = imageUrl || heroImage;

  return (
    <article className="relative overflow-hidden group">
      <Link to={`/article/${slug}`} className="block">
        <div className="relative h-[180px] md:h-[220px] lg:h-[280px]">
          <img
            src={displayImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />
          
          {/* Animated accent line */}
          <div className="absolute bottom-0 left-0 h-1 bg-accent w-0 group-hover:w-full transition-all duration-500 ease-out" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
            <div className="container mx-auto">
              {categoryName && (
                <Link
                  to={`/section/${categorySlug}`}
                  className="inline-block bg-accent text-accent-foreground px-3 py-1 text-xs font-sans font-bold uppercase tracking-wider mb-2 hover:bg-accent/90 transition-all duration-200 transform hover:scale-105"
                  onClick={(e) => e.stopPropagation()}
                >
                  {categoryName}
                </Link>
              )}
              
              <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-primary-foreground leading-tight mb-2 max-w-3xl group-hover:text-accent transition-colors duration-300">
                {title}
              </h2>
              
              {excerpt && (
                <p className="text-primary-foreground/80 font-serif text-sm md:text-base line-clamp-2 max-w-2xl mb-2 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  {excerpt}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-primary-foreground/70 font-sans">
                {authorName && (
                  <span className="flex items-center gap-1.5">
                    <User className="h-3 w-3" />
                    {authorName}
                  </span>
                )}
                {timeAgo && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {timeAgo}
                  </span>
                )}
                <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-accent">
                  Read More <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
