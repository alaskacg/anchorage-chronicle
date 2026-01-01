import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WeatherInlay } from '@/components/WeatherInlay';
import { TideChart } from '@/components/TideChart';
import { CompactFeaturedArticle } from '@/components/CompactFeaturedArticle';
import { ArticleCard } from '@/components/ArticleCard';
import { NewsSectionFrame } from '@/components/NewsSectionFrame';
import { AnimatedNewsColumn, StaggeredColumnGrid } from '@/components/AnimatedNewsColumn';
import { QuickHeadlines } from '@/components/QuickHeadlines';
import { InlineBreakingNews } from '@/components/InlineBreakingNews';
import { AdBanner } from '@/components/ads/AdBanner';
import { RandomAlaskaQuote } from '@/components/AlaskaQuote';
import { Newspaper, MapPin, Building2, Mountain, TrendingUp } from 'lucide-react';
import featuredImage from '@/assets/featured-anchorage-launch.jpg';

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
  'alaska-news-corporation-launches-anchorage-chronicle': featuredImage,
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
        .limit(10);

      if (latest) {
        const cleaned = latest.filter((a) => a.id !== featured?.id);
        setLatestArticles(cleaned);
      }

      setLoading(false);
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header compact />

      <main className="flex-1">
        {/* Featured Story - Compact with Animation */}
        {featuredArticle && (
          <AnimatedNewsColumn delay={0}>
            <CompactFeaturedArticle
              slug={featuredArticle.slug}
              title={featuredArticle.title}
              excerpt={featuredArticle.excerpt}
              imageUrl={articleImages[featuredArticle.slug] || featuredArticle.image_url || featuredImage}
              authorName={featuredArticle.author_name}
              publishedAt={featuredArticle.published_at}
              categoryName={featuredArticle.categories?.name}
              categorySlug={featuredArticle.categories?.slug}
            />
          </AnimatedNewsColumn>
        )}

        {/* Main Content - Complex Column Layout */}
        <div className="container mx-auto px-4 py-8">
          
          {/* Top Row: Weather + Quick Headlines */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Weather Inlay + Tide Chart */}
            <div className="lg:col-span-5 space-y-4">
              <AnimatedNewsColumn delay={100}>
                <WeatherInlay />
              </AnimatedNewsColumn>
              <AnimatedNewsColumn delay={150}>
                <TideChart />
              </AnimatedNewsColumn>
            </div>

            {/* Top Headlines */}
            <div className="lg:col-span-7">
              <AnimatedNewsColumn delay={200}>
                <NewsSectionFrame 
                  title="Top Stories" 
                  icon={<Newspaper className="h-4 w-4" />}
                  variant="featured"
                  href="/section/local"
                >
                  {/* Breaking News Ticker inside Top Stories */}
                  <InlineBreakingNews />
                  
                  {loading ? (
                    <div className="p-4 space-y-3 animate-pulse">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-muted rounded" />
                      ))}
                    </div>
                  ) : (
                    <QuickHeadlines 
                      headlines={latestArticles.slice(0, 4).map(a => ({
                        id: a.id,
                        slug: a.slug,
                        title: a.title,
                        publishedAt: a.published_at,
                        categoryName: a.categories?.name,
                        categorySlug: a.categories?.slug,
                      }))}
                      variant="numbered"
                    />
                  )}
                </NewsSectionFrame>
              </AnimatedNewsColumn>
            </div>
          </div>

          {/* Primary Ad */}
          <AnimatedNewsColumn delay={250}>
            <div className="mb-8">
              <AdBanner variant="large" adId="aklistings" />
            </div>
          </AnimatedNewsColumn>

          {/* Three Column News Sections */}
          <StaggeredColumnGrid columns={3} staggerDelay={100} className="mb-8">
            {/* Local News */}
            <NewsSectionFrame 
              title="Local News" 
              icon={<MapPin className="h-4 w-4" />}
              variant="default"
              href="/section/local"
            >
              <div className="p-4">
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-32 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                ) : latestArticles.length > 0 ? (
                  <ArticleCard
                    id={latestArticles[0]?.id || ''}
                    slug={latestArticles[0]?.slug || ''}
                    title={latestArticles[0]?.title || 'Coming Soon'}
                    excerpt={latestArticles[0]?.excerpt}
                    imageUrl={articleImages[latestArticles[0]?.slug] || latestArticles[0]?.image_url}
                    publishedAt={latestArticles[0]?.published_at}
                    variant="featured"
                  />
                ) : (
                  <p className="text-muted-foreground font-serif text-sm italic">
                    Local coverage coming soon. Alaska News Corporation is building its network of community correspondents.
                  </p>
                )}
              </div>
            </NewsSectionFrame>

            {/* State News */}
            <NewsSectionFrame 
              title="State News" 
              icon={<Building2 className="h-4 w-4" />}
              variant="secondary"
              href="/section/state"
            >
              <div className="p-4">
                <p className="text-muted-foreground font-serif text-sm italic">
                  Coverage of Alaska state government, legislature, and statewide issues coming soon.
                </p>
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="font-display text-sm font-bold text-foreground mb-2">Coming Coverage</h4>
                  <ul className="text-xs text-muted-foreground font-sans space-y-1">
                    <li>• Legislative Session Updates</li>
                    <li>• State Budget Analysis</li>
                    <li>• Resource Development</li>
                  </ul>
                </div>
              </div>
            </NewsSectionFrame>

            {/* Outdoors */}
            <NewsSectionFrame 
              title="Outdoors" 
              icon={<Mountain className="h-4 w-4" />}
              variant="accent"
              href="/section/outdoors"
            >
              <div className="p-4">
                <p className="text-muted-foreground font-serif text-sm italic">
                  Fishing reports, hunting regulations, trail conditions, and outdoor recreation news coming soon.
                </p>
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="font-display text-sm font-bold text-foreground mb-2">Seasonal Focus</h4>
                  <ul className="text-xs text-muted-foreground font-sans space-y-1">
                    <li>• Ice Fishing Conditions</li>
                    <li>• Aurora Viewing Reports</li>
                    <li>• Winter Trail Status</li>
                  </ul>
                </div>
              </div>
            </NewsSectionFrame>
          </StaggeredColumnGrid>

          {/* Two Column Layout: Main Content + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Business & Economy */}
              <AnimatedNewsColumn delay={400}>
                <NewsSectionFrame 
                  title="Business & Economy" 
                  icon={<TrendingUp className="h-4 w-4" />}
                  variant="default"
                  href="/section/business"
                >
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-display text-base font-bold text-foreground mb-2">
                          Alaska Economic Outlook
                        </h4>
                        <p className="text-muted-foreground font-serif text-sm mb-3">
                          In-depth coverage of Alaska's economy, from oil & gas to tourism, fisheries to emerging industries.
                        </p>
                        <ul className="text-xs text-muted-foreground font-sans space-y-1">
                          <li>• Permanent Fund Updates</li>
                          <li>• Job Market Analysis</li>
                          <li>• Small Business Spotlights</li>
                        </ul>
                      </div>
                      <div className="border-l border-border pl-6">
                        <h4 className="font-display text-sm font-bold text-foreground mb-2">Key Industries</h4>
                        <div className="space-y-2">
                          {['Oil & Gas', 'Commercial Fishing', 'Tourism', 'Mining', 'Healthcare'].map((industry) => (
                            <div 
                              key={industry}
                              className="text-xs font-sans text-muted-foreground py-1.5 px-2 bg-muted/50 hover:bg-accent/10 hover:text-accent transition-colors cursor-pointer"
                            >
                              {industry}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </NewsSectionFrame>
              </AnimatedNewsColumn>

              {/* Decorative Divider */}
              <div className="newspaper-divider" />

              {/* Quote */}
              <AnimatedNewsColumn delay={450}>
                <RandomAlaskaQuote variant="featured" />
              </AnimatedNewsColumn>

            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <AnimatedNewsColumn delay={300}>
                <AdBanner variant="sidebar" adId="akguidesearch" />
              </AnimatedNewsColumn>

              <AnimatedNewsColumn delay={350}>
                {/* Quick Links */}
                <div className="bg-card border border-border p-5">
                  <h3 className="font-display text-lg font-bold text-primary mb-4">Explore Sections</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Local', 'State', 'Politics', 'Sports', 'Outdoors', 'Business'].map((section) => (
                      <a
                        key={section}
                        href={`/section/${section.toLowerCase()}`}
                        className="px-3 py-2.5 text-sm font-sans bg-muted hover:bg-accent hover:text-accent-foreground text-center transition-all duration-200 hover:scale-105"
                      >
                        {section}
                      </a>
                    ))}
                  </div>
                </div>
              </AnimatedNewsColumn>

              <AnimatedNewsColumn delay={400}>
                <AdBanner variant="sidebar" adId="boats" />
              </AnimatedNewsColumn>

              <AnimatedNewsColumn delay={450}>
                {/* Newsletter Signup */}
                <div className="bg-primary text-primary-foreground p-5 relative overflow-hidden group">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <h3 className="font-display text-lg font-bold mb-2">Stay Informed</h3>
                    <p className="font-serif text-sm text-primary-foreground/80 mb-4">
                      Get Alaska news delivered to your inbox.
                    </p>
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full px-3 py-2 text-sm bg-primary-foreground/10 border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-accent mb-2 transition-colors"
                    />
                    <button className="w-full bg-accent text-accent-foreground px-4 py-2 text-sm font-sans font-bold hover:bg-accent/90 transition-all duration-200 hover:scale-[1.02]">
                      Subscribe
                    </button>
                  </div>
                </div>
              </AnimatedNewsColumn>

              <AnimatedNewsColumn delay={500}>
                <AdBanner variant="sidebar" adId="consulting" />
              </AnimatedNewsColumn>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
