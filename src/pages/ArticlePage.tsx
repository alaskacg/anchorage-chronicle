import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft, Clock, User, Share2, Bookmark, Facebook, Twitter, Mail } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdBanner } from '@/components/ads/AdBanner';
import { SectionHeader } from '@/components/SectionHeader';
import { ArticleCard } from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*, categories(*)')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: relatedArticles } = useQuery({
    queryKey: ['related-articles', article?.category_id],
    queryFn: async () => {
      if (!article?.category_id) return [];
      const { data } = await supabase
        .from('articles')
        .select('*, categories(*)')
        .eq('category_id', article.category_id)
        .eq('is_published', true)
        .neq('id', article.id)
        .order('published_at', { ascending: false })
        .limit(4);
      return data || [];
    },
    enabled: !!article?.category_id,
  });

  // Split content into paragraphs for ad insertion
  const contentParagraphs = article?.content?.split('\n\n') || [];
  const adInsertionPoints = [2, 5, 8]; // Insert ads after these paragraph indices

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          {article.categories && (
            <>
              <Link 
                to={`/section/${article.categories.slug}`} 
                className="hover:text-primary transition-colors"
              >
                {article.categories.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground truncate max-w-[200px]">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content */}
          <article className="lg:col-span-8">
            {/* Category Badge */}
            {article.categories && (
              <Link 
                to={`/section/${article.categories.slug}`}
                className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded mb-4 hover:bg-primary/90 transition-colors"
              >
                {article.categories.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-muted-foreground font-serif italic mb-6 border-l-4 border-accent pl-4">
                {article.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
              {article.author_name && (
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {article.author_name}
                </span>
              )}
              {article.published_at && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(new Date(article.published_at), 'MMMM d, yyyy • h:mm a')}
                </span>
              )}
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2 mb-8">
              <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 ml-auto">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Featured Image */}
            {article.image_url && (
              <figure className="mb-8">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full rounded-lg shadow-lg"
                />
                <figcaption className="text-sm text-muted-foreground mt-2 text-center italic">
                  Photo: The Anchorage Chronicle
                </figcaption>
              </figure>
            )}

            {/* Article Content with Inline Ads */}
            <div className="prose prose-lg max-w-none">
              {contentParagraphs.map((paragraph, index) => (
                <div key={index}>
                  <p className="font-serif text-foreground leading-relaxed mb-6">
                    {paragraph}
                  </p>
                  
                  {/* Insert ad after specific paragraphs */}
                  {adInsertionPoints.includes(index) && (
                    <div className="my-8 animate-fade-in">
                      <AdBanner 
                        variant="small" 
                        adId={index === 2 ? 'aklistings' : index === 5 ? 'boats' : 'mining'}
                        className="not-prose"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Article Ad */}
            <div className="mt-12 mb-8">
              <AdBanner variant="medium" adId="consulting" className="h-48" />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-border">
              <span className="text-sm font-medium text-muted-foreground">Topics:</span>
              <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full hover:bg-muted/80 cursor-pointer transition-colors">
                Alaska
              </span>
              <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full hover:bg-muted/80 cursor-pointer transition-colors">
                {article.categories?.name || 'News'}
              </span>
              <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full hover:bg-muted/80 cursor-pointer transition-colors">
                Local
              </span>
            </div>

            {/* Author Bio */}
            {article.author_name && (
              <div className="mt-8 p-6 bg-card rounded-lg border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-foreground">{article.author_name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">Staff Writer</p>
                    <p className="text-sm text-muted-foreground">
                      Covering Alaska's most important stories with dedication and integrity.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Sidebar with Ads */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Sticky Sidebar Container */}
            <div className="lg:sticky lg:top-4 space-y-6">
              {/* Primary Sidebar Ad */}
              <AdBanner variant="sidebar" adId="aklistings" />

              {/* Newsletter Signup */}
              <div className="p-6 bg-primary rounded-lg text-primary-foreground">
                <h4 className="font-display text-lg font-bold mb-2">Stay Informed</h4>
                <p className="text-sm text-primary-foreground/80 mb-4">
                  Get breaking news and top stories delivered to your inbox.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 mb-3 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Button className="w-full bg-accent text-primary hover:bg-accent/90">
                  Subscribe
                </Button>
              </div>

              {/* Second Sidebar Ad */}
              <AdBanner variant="sidebar" adId="consulting" />

              {/* Third Sidebar Ad */}
              <AdBanner variant="sidebar" adId="boats" />

              {/* Fourth Sidebar Ad */}
              <AdBanner variant="sidebar" adId="mining" />
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <section className="mt-16">
            <SectionHeader title="Related Stories" />
            
            {/* Ad Banner Above Related Articles */}
            <div className="mb-8">
              <AdBanner variant="large" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard
                  key={relatedArticle.id}
                  id={relatedArticle.id}
                  title={relatedArticle.title}
                  excerpt={relatedArticle.excerpt}
                  imageUrl={relatedArticle.image_url}
                  categoryName={relatedArticle.categories?.name}
                  categorySlug={relatedArticle.categories?.slug}
                  slug={relatedArticle.slug}
                  publishedAt={relatedArticle.published_at}
                  authorName={relatedArticle.author_name}
                  variant="featured"
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
