import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BreakingNewsTicker } from '@/components/BreakingNewsTicker';
import { AlertBanner } from '@/components/AlertBanner';
import { WeatherWidget } from '@/components/WeatherWidget';
import { FeaturedArticle } from '@/components/FeaturedArticle';
import { ArticleCard } from '@/components/ArticleCard';
import { SectionHeader } from '@/components/SectionHeader';
import { AdBanner } from '@/components/ads/AdBanner';
import { RandomAlaskaQuote } from '@/components/AlaskaQuote';
import heroImage from '@/assets/hero-denali.jpg';
import auroraImage from '@/assets/aurora-alaska.jpg';
import capitolImage from '@/assets/capitol-juneau.jpg';
import iditarodImage from '@/assets/iditarod-race.jpg';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  author_name: string | null;
  published_at: string | null;
  categories: { name: string; slug: string } | null;
}

const articleImages: Record<string, string> = {
  'northern-lights-spectacular-expected': auroraImage,
  'legislature-convenes-new-session': capitolImage,
  'iditarod-mushers-prepare-2026': iditarodImage,
};

const Index = () => {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      // Fetch featured article
      const { data: featured } = await supabase
        .from('articles')
        .select('*, categories(name, slug)')
        .eq('is_featured', true)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(1)
        .single();

      if (featured) {
        setFeaturedArticle(featured);
      }

      // Fetch latest articles
      const { data: latest } = await supabase
        .from('articles')
        .select('*, categories(name, slug)')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(6);

      if (latest) {
        setLatestArticles(latest.filter(a => a.id !== featured?.id));
      }

      setLoading(false);
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AlertBanner />
      <BreakingNewsTicker />
      <Header />

      <main className="flex-1">
        {/* Featured Story */}
        {featuredArticle && (
          <FeaturedArticle
            slug={featuredArticle.slug}
            title={featuredArticle.title}
            excerpt={featuredArticle.excerpt}
            imageUrl={articleImages[featuredArticle.slug] || featuredArticle.image_url || heroImage}
            authorName={featuredArticle.author_name}
            publishedAt={featuredArticle.published_at}
            categoryName={featuredArticle.categories?.name}
            categorySlug={featuredArticle.categories?.slug}
          />
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Latest News - Left Column */}
            <div className="lg:col-span-2">
              <SectionHeader title="Latest News" href="/section/local" />
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-card border border-border p-5 animate-pulse">
                      <div className="h-4 bg-muted rounded w-20 mb-3" />
                      <div className="h-6 bg-muted rounded w-full mb-2" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {latestArticles.slice(0, 4).map((article, index) => (
                    <ArticleCard
                      key={article.id}
                      id={article.id}
                      slug={article.slug}
                      title={article.title}
                      excerpt={article.excerpt}
                      imageUrl={articleImages[article.slug] || article.image_url}
                      authorName={article.author_name}
                      publishedAt={article.published_at}
                      categoryName={article.categories?.name}
                      categorySlug={article.categories?.slug}
                      variant={index < 2 ? 'featured' : 'default'}
                    />
                  ))}
                </div>
              )}

              {/* Ad Banner - Rotating Large */}
              <div className="my-8">
                <AdBanner variant="large" />
              </div>

              {/* Decorative Divider */}
              <div className="newspaper-divider" />

              {/* More Stories */}
              <SectionHeader title="More Stories" showViewAll={false} />
              <div className="bg-card border border-border">
                {latestArticles.slice(4).map((article) => (
                  <ArticleCard
                    key={article.id}
                    id={article.id}
                    slug={article.slug}
                    title={article.title}
                    excerpt={article.excerpt}
                    imageUrl={articleImages[article.slug] || article.image_url}
                    authorName={article.author_name}
                    publishedAt={article.published_at}
                    categoryName={article.categories?.name}
                    variant="compact"
                  />
                ))}
              </div>
            </div>

            {/* Sidebar - Right Column */}
            <aside className="space-y-6">
              <WeatherWidget />

              {/* Sidebar Ad - Alaska Consulting Group */}
              <AdBanner variant="sidebar" adId="consulting" />

              {/* Quick Links */}
              <div className="bg-card border border-border p-5">
                <h3 className="font-display text-lg font-bold text-primary mb-4">Sections</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Local', 'State', 'Politics', 'Sports', 'Outdoors', 'Business'].map((section) => (
                    <a
                      key={section}
                      href={`/section/${section.toLowerCase()}`}
                      className="px-3 py-2 text-sm font-sans bg-muted hover:bg-accent hover:text-accent-foreground text-center transition-colors"
                    >
                      {section}
                    </a>
                  ))}
                </div>
              </div>

              {/* One quote per page */}
              <RandomAlaskaQuote variant="sidebar" />

              {/* Sidebar Ad - Alaska Mining */}
              <AdBanner variant="sidebar" adId="mining" />

              {/* Newsletter Signup */}
              <div className="bg-primary text-primary-foreground p-5">
                <h3 className="font-display text-lg font-bold mb-2">Stay Informed</h3>
                <p className="font-serif text-sm text-primary-foreground/80 mb-4">
                  Get the latest Alaska news delivered to your inbox.
                </p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-3 py-2 text-sm bg-primary-foreground/10 border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-accent mb-2"
                />
                <button className="w-full bg-accent text-accent-foreground px-4 py-2 text-sm font-sans font-bold hover:bg-accent/90 transition-colors">
                  Subscribe
                </button>
              </div>

              {/* Sidebar Ad - Alaska Mining */}
              <AdBanner variant="sidebar" adId="mining" />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
