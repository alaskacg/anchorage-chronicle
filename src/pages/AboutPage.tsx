import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Users, Compass, Shield, Mountain, Newspaper, Mail } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                News for Alaska.<br />By Alaskans.
              </h1>
              <p className="font-serif text-xl md:text-2xl text-primary-foreground/80 leading-relaxed">
                In a world of national headlines and distant concerns, we chose to focus on what matters most: 
                the stories of our neighbors, our communities, and our home.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-20 bg-cream dark:bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1 bg-secondary/20 text-secondary font-sans text-sm font-semibold uppercase tracking-wider rounded-full mb-4">
                  Our Mission
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Why We Exist
                </h2>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="font-serif text-lg text-muted-foreground leading-relaxed mb-6">
                  Alaska is unlike anywhere else on Earth. Our communities are spread across 663,300 square miles 
                  of breathtaking wilderness. What happens in Barrow rarely makes news in Ketchikan. The concerns 
                  of Bethel differ vastly from those of Anchorage. Yet for too long, Alaskans have been served 
                  by news sources that treat our state as a monolith—or worse, as an afterthought.
                </p>
                <p className="font-serif text-lg text-muted-foreground leading-relaxed mb-6">
                  <strong className="text-foreground">Alaska News Corporation</strong> was founded because we believe 
                  every Alaskan community deserves coverage that understands its unique character. We believe that 
                  the decisions made in Juneau should be explained in plain language. We believe that the achievements 
                  of our neighbors deserve celebration just as much as national headlines.
                </p>
                <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">The Anchorage Chronicle</strong> is our flagship publication, 
                  covering state and federal matters that affect all Alaskans. But our vision extends further—to 
                  build a network of coverage that reaches every corner of the Last Frontier.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 bg-gold/20 text-gold font-sans text-sm font-semibold uppercase tracking-wider rounded-full mb-4">
                Our Values
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                What We Stand For
              </h2>
              <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto">
                These principles guide every story we write, every decision we make, 
                and every community we serve.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <ValueCard
                icon={<MapPin className="h-8 w-8" />}
                title="Local Focus"
                description="We cover Alaska's diverse regions with the depth and understanding they deserve. From the Kenai to the Kuskokwim, every community matters."
              />
              <ValueCard
                icon={<Heart className="h-8 w-8" />}
                title="Balanced Perspective"
                description="Yes, we report challenges—because informed citizens make better decisions. But we also seek out the triumphs, innovations, and acts of kindness that define Alaska."
              />
              <ValueCard
                icon={<Shield className="h-8 w-8" />}
                title="Trustworthy Journalism"
                description="In an age of misinformation, we pledge accuracy over speed. We cite our sources, correct our mistakes, and earn your trust every day."
              />
              <ValueCard
                icon={<Users className="h-8 w-8" />}
                title="Community-Driven"
                description="We're not outsiders looking in. We're your neighbors, and we cover stories that affect the lives of real Alaskans—including our own."
              />
              <ValueCard
                icon={<Compass className="h-8 w-8" />}
                title="Regional Understanding"
                description="What matters in Juneau may not matter in Nome. We recognize Alaska's diversity and tailor our coverage to serve each region's unique needs."
              />
              <ValueCard
                icon={<Mountain className="h-8 w-8" />}
                title="Alaska Spirit"
                description="We celebrate the resilience, independence, and community spirit that makes Alaska unlike anywhere else on Earth."
              />
            </div>
          </div>
        </section>

        {/* Different Kind of News */}
        <section className="py-16 md:py-20 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1 bg-primary/20 text-primary font-sans text-sm font-semibold uppercase tracking-wider rounded-full mb-4">
                  A Different Approach
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  News That Doesn't Just Inform—It Inspires
                </h2>
              </div>

              <div className="bg-card border border-border p-8 md:p-12 rounded-lg">
                <p className="font-serif text-lg text-muted-foreground leading-relaxed mb-6">
                  We understand that many Alaskans have grown weary of news coverage that seems designed 
                  to frighten rather than inform, to divide rather than unite. We share that frustration.
                </p>
                <p className="font-serif text-lg text-muted-foreground leading-relaxed mb-6">
                  <strong className="text-foreground">Our promise is simple:</strong> We will tell the stories 
                  that matter to you. We will investigate the issues that affect your lives. We will hold 
                  power accountable. But we will also celebrate your communities, highlight the good work 
                  being done across Alaska, and remember that behind every headline are real people with 
                  real hopes and real concerns.
                </p>
                <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                  Alaska deserves a news source that reflects its spirit—one that is honest, resilient, 
                  and ultimately hopeful about the future of the Last Frontier.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Regional Coverage */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 bg-forest/20 text-forest font-sans text-sm font-semibold uppercase tracking-wider rounded-full mb-4">
                Regional Coverage
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Every Corner of Alaska
              </h2>
              <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto">
                Alaska News Corporation is building a network of coverage that will eventually 
                reach every community in our great state.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                'Anchorage & Mat-Su',
                'Kenai Peninsula',
                'Southeast Alaska',
                'Interior & Fairbanks',
                'Southwest & Bristol Bay',
                'Western Alaska',
                'North Slope',
                'Kodiak Island',
              ].map((region) => (
                <div
                  key={region}
                  className="bg-card border border-border p-4 text-center hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <span className="font-sans text-sm font-medium text-foreground">{region}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section className="py-16 md:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Newspaper className="h-16 w-16 mx-auto mb-6 opacity-80" />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Be Part of This Story
              </h2>
              <p className="font-serif text-lg text-primary-foreground/80 leading-relaxed mb-8">
                This is more than a news organization—it is a community endeavor. We invite you to be 
                part of this journey. Share your story ideas. Tell us what matters to your community. 
                Help us build a news source that truly serves the Last Frontier.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:news@anchoragechronicle.com"
                  className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 font-sans font-bold hover:bg-accent/90 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  Share a Story Tip
                </a>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 bg-primary-foreground/10 border border-primary-foreground/30 text-primary-foreground px-8 py-4 font-sans font-bold hover:bg-primary-foreground/20 transition-colors"
                >
                  Read The Chronicle
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

function ValueCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="font-serif text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

export default AboutPage;
