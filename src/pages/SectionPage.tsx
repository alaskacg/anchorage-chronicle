import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SectionHero } from '@/components/SectionHero';
import { ArticleCard } from '@/components/ArticleCard';
import { SectionHeader } from '@/components/SectionHeader';
import { RandomAlaskaQuote, alaskaQuotes } from '@/components/AlaskaQuote';
import { AdBanner } from '@/components/ads/AdBanner';
import { WeatherWidget } from '@/components/WeatherWidget';
import { BreakingNewsTicker } from '@/components/BreakingNewsTicker';
import { AlertBanner } from '@/components/AlertBanner';
import { Calendar, TrendingUp, Clock } from 'lucide-react';

// Section images
import politicsImage from '@/assets/section-politics.jpg';
import businessImage from '@/assets/section-business.jpg';
import sportsImage from '@/assets/section-sports.jpg';
import outdoorsImage from '@/assets/section-outdoors.jpg';
import communityImage from '@/assets/section-community.jpg';
import localImage from '@/assets/section-local.jpg';
import stateImage from '@/assets/section-state.jpg';
import weatherImage from '@/assets/section-weather.jpg';

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

const sectionConfig: Record<string, {
  title: string;
  description: string;
  image: string;
  color: string;
}> = {
  local: {
    title: 'Local News',
    description: 'Stories from Anchorage and the Mat-Su Valley that shape our community.',
    image: localImage,
    color: 'from-primary',
  },
  state: {
    title: 'State News',
    description: 'Coverage from across Alaska, from Ketchikan to Barrow.',
    image: stateImage,
    color: 'from-secondary',
  },
  politics: {
    title: 'Politics',
    description: 'Government affairs, legislation, and political developments affecting Alaskans.',
    image: politicsImage,
    color: 'from-primary',
  },
  business: {
    title: 'Business',
    description: 'Economic news, industry updates, and commercial developments in Alaska.',
    image: businessImage,
    color: 'from-accent',
  },
  sports: {
    title: 'Sports',
    description: 'From hockey to fishing derbies, coverage of Alaska athletics.',
    image: sportsImage,
    color: 'from-destructive',
  },
  outdoors: {
    title: 'Outdoors',
    description: 'Adventures, wildlife, and the great Alaskan wilderness.',
    image: outdoorsImage,
    color: 'from-secondary',
  },
  community: {
    title: 'Community',
    description: 'Events, people, and stories that bring Alaskans together.',
    image: communityImage,
    color: 'from-accent',
  },
  opinion: {
    title: 'Opinion',
    description: 'Perspectives, editorials, and letters from across Alaska.',
    image: stateImage,
    color: 'from-muted',
  },
};

const SectionPage = () => {
  const { section } = useParams<{ section: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const config = section ? sectionConfig[section] : null;
  const quoteIndex = section ? section.charCodeAt(0) % alaskaQuotes.length : 0;
  const sectionQuote = alaskaQuotes[quoteIndex];

  useEffect(() => {
    const fetchArticles = async () => {
      if (!section) return;

      setLoading(true);
      
      // First get the category
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', section)
        .single();

      if (category) {
        const { data } = await supabase
          .from('articles')
          .select('*, categories(name, slug)')
          .eq('category_id', category.id)
          .eq('is_published', true)
          .order('published_at', { ascending: false })
          .limit(20);

        if (data) setArticles(data);
      } else {
        // Fallback to all articles if category not found
        const { data } = await supabase
          .from('articles')
          .select('*, categories(name, slug)')
          .eq('is_published', true)
          .order('published_at', { ascending: false })
          .limit(20);

        if (data) setArticles(data);
      }

      setLoading(false);
    };

    fetchArticles();

    // Realtime subscription
    const channel = supabase
      .channel('section-articles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, () => {
        fetchArticles();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [section]);

  if (!config) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="font-display text-4xl text-primary mb-4">Section Not Found</h1>
          <p className="text-muted-foreground mb-6">The section you're looking for doesn't exist.</p>
          <Link to="/" className="text-accent hover:underline">Return to Home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AlertBanner />
      <BreakingNewsTicker />
      <Header />

      <main className="flex-1">
        <SectionHero
          title={config.title}
          description={config.description}
          imageUrl={config.image}
          breadcrumbs={[{ label: config.title, href: `/section/${section}` }]}
        />

        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Quote */}
              <RandomAlaskaQuote variant="featured" />

              {/* Top Stories */}
              <div>
                <SectionHeader title="Latest Stories" showViewAll={false} />
                
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
                ) : articles.length > 0 ? (
                  <>
                    {/* Featured Articles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {articles.slice(0, 2).map((article) => (
                        <ArticleCard
                          key={article.id}
                          id={article.id}
                          slug={article.slug}
                          title={article.title}
                          excerpt={article.excerpt}
                          imageUrl={article.image_url}
                          authorName={article.author_name}
                          publishedAt={article.published_at}
                          categoryName={article.categories?.name}
                          categorySlug={article.categories?.slug}
                          variant="featured"
                        />
                      ))}
                    </div>

                    {/* Ad */}
                    <AdBanner variant="large" />

                    {/* More Articles */}
                    <div className="mt-8 space-y-4">
                      {articles.slice(2, 6).map((article) => (
                        <ArticleCard
                          key={article.id}
                          id={article.id}
                          slug={article.slug}
                          title={article.title}
                          excerpt={article.excerpt}
                          imageUrl={article.image_url}
                          authorName={article.author_name}
                          publishedAt={article.published_at}
                          categoryName={article.categories?.name}
                          variant="compact"
                        />
                      ))}
                    </div>

                    {/* Another Quote */}
                    <div className="my-8">
                      <RandomAlaskaQuote variant="default" />
                    </div>

                    {/* Remaining Articles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {articles.slice(6).map((article) => (
                        <ArticleCard
                          key={article.id}
                          id={article.id}
                          slug={article.slug}
                          title={article.title}
                          excerpt={article.excerpt}
                          imageUrl={article.image_url}
                          authorName={article.author_name}
                          publishedAt={article.published_at}
                          categoryName={article.categories?.name}
                          categorySlug={article.categories?.slug}
                          variant="default"
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bg-card border border-border p-8 text-center">
                    <p className="text-muted-foreground">No articles in this section yet.</p>
                    <p className="text-sm text-muted-foreground mt-2">Check back soon for updates.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <WeatherWidget />

              <AdBanner variant="sidebar" adId="consulting" />

              {/* Trending */}
              <div className="bg-card border border-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <h3 className="font-display text-lg font-bold text-primary">Trending</h3>
                </div>
                <div className="space-y-3">
                  {articles.slice(0, 5).map((article, index) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.slug}`}
                      className="flex items-start gap-3 group"
                    >
                      <span className="font-display text-2xl font-bold text-accent/50 group-hover:text-accent transition-colors">
                        {index + 1}
                      </span>
                      <span className="font-sans text-sm text-foreground group-hover:text-accent transition-colors line-clamp-2">
                        {article.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <RandomAlaskaQuote variant="sidebar" />

              <AdBanner variant="sidebar" adId="boats" />

              {/* Other Sections */}
              <div className="bg-card border border-border p-5">
                <h3 className="font-display text-lg font-bold text-primary mb-4">Explore Sections</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(sectionConfig)
                    .filter(([key]) => key !== section)
                    .slice(0, 6)
                    .map(([key, value]) => (
                      <Link
                        key={key}
                        to={`/section/${key}`}
                        className="px-3 py-2 text-sm font-sans bg-muted hover:bg-accent hover:text-accent-foreground text-center transition-colors"
                      >
                        {value.title.replace(' News', '')}
                      </Link>
                    ))}
                </div>
              </div>

              <AdBanner variant="sidebar" adId="mining" />

              {/* Upcoming Events */}
              <div className="bg-primary text-primary-foreground p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5" />
                  <h3 className="font-display text-lg font-bold">Upcoming Events</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="border-b border-primary-foreground/20 pb-2">
                    <p className="font-sans font-medium">Iditarod Ceremonial Start</p>
                    <p className="text-primary-foreground/70 text-xs">March 1, 2026 • Anchorage</p>
                  </div>
                  <div className="border-b border-primary-foreground/20 pb-2">
                    <p className="font-sans font-medium">Fur Rondy Festival</p>
                    <p className="text-primary-foreground/70 text-xs">February 28 - March 9, 2026</p>
                  </div>
                  <div>
                    <p className="font-sans font-medium">Alaska Folk Festival</p>
                    <p className="text-primary-foreground/70 text-xs">April 6-12, 2026 • Juneau</p>
                  </div>
                </div>
              </div>

              <AdBanner variant="sidebar" adId="aklistings" />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SectionPage;
