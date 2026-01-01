-- Categories for organizing articles
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Articles table
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  author_name TEXT DEFAULT 'Staff Writer',
  is_featured BOOLEAN DEFAULT false,
  is_breaking BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Breaking news ticker items
CREATE TABLE public.breaking_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  link TEXT,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Critical alerts (weather, emergencies, etc.)
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('weather', 'emergency', 'traffic', 'community', 'general')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  link TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Weather data
CREATE TABLE public.weather (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL DEFAULT 'Anchorage',
  temperature_f INTEGER,
  condition TEXT,
  icon TEXT,
  high_f INTEGER,
  low_f INTEGER,
  humidity INTEGER,
  wind_mph INTEGER,
  wind_direction TEXT,
  forecast_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Community events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  link TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breaking_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public read access for all content tables (news site is public)
CREATE POLICY "Public read access for categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read access for articles" ON public.articles FOR SELECT USING (is_published = true);
CREATE POLICY "Public read access for breaking news" ON public.breaking_news FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for alerts" ON public.alerts FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for weather" ON public.weather FOR SELECT USING (true);
CREATE POLICY "Public read access for events" ON public.events FOR SELECT USING (is_published = true);

-- Enable realtime for breaking news and alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.breaking_news;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.weather;

-- Insert default categories
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Local News', 'local', 'News from Anchorage and surrounding areas', 1),
  ('State News', 'state', 'News from across Alaska', 2),
  ('Politics', 'politics', 'Political news and government coverage', 3),
  ('Business', 'business', 'Business and economic news', 4),
  ('Sports', 'sports', 'Sports coverage and scores', 5),
  ('Outdoors', 'outdoors', 'Hunting, fishing, and outdoor recreation', 6),
  ('Community', 'community', 'Community events and announcements', 7),
  ('Opinion', 'opinion', 'Editorials and opinion pieces', 8);

-- Insert sample weather
INSERT INTO public.weather (location, temperature_f, condition, icon, high_f, low_f, humidity, wind_mph, wind_direction) VALUES
  ('Anchorage', 28, 'Partly Cloudy', 'cloud-sun', 32, 18, 65, 8, 'NW');

-- Insert sample breaking news
INSERT INTO public.breaking_news (message, priority, is_active) VALUES
  ('Winter storm advisory in effect for Kenai Peninsula through Friday', 1, true),
  ('Iditarod 2026 route announced: Traditional northern route confirmed', 2, true);

-- Insert sample alert
INSERT INTO public.alerts (title, message, alert_type, severity, is_active) VALUES
  ('Winter Weather Advisory', 'Heavy snow expected in Matanuska-Susitna Valley. Travel with caution.', 'weather', 'warning', true);

-- Insert sample articles
INSERT INTO public.articles (title, slug, excerpt, content, author_name, category_id, is_featured, published_at) VALUES
  (
    'Northern Lights Spectacular Expected This Week',
    'northern-lights-spectacular-expected',
    'Forecasters predict strong aurora activity across Southcentral Alaska through the weekend.',
    'Alaska residents and visitors are in for a treat this week as space weather forecasters predict exceptional aurora borealis activity across the state. The Geophysical Institute at the University of Alaska Fairbanks has issued an aurora forecast indicating high activity levels through Sunday evening.

"We''re seeing conditions that could produce some of the best displays of the season," said Dr. Sarah Chen, a space physicist at the institute. "Clear skies are expected across much of Southcentral Alaska, making this an ideal viewing opportunity."

Best viewing times are expected between 11 p.m. and 2 a.m., with the aurora potentially visible as far south as Juneau. Residents in Anchorage, Fairbanks, and the Matanuska-Susitna Valley should have excellent viewing conditions.

For the best experience, experts recommend traveling away from city lights and allowing 20-30 minutes for eyes to adjust to the darkness.',
    'Emily Rodriguez',
    (SELECT id FROM public.categories WHERE slug = 'local'),
    true,
    now()
  ),
  (
    'State Legislature Convenes for New Session',
    'legislature-convenes-new-session',
    'Lawmakers return to Juneau with budget, education funding, and energy policy on the agenda.',
    'The Alaska State Legislature convened its annual session Tuesday in Juneau, with lawmakers facing a packed agenda that includes the state budget, education funding reforms, and energy policy decisions that could shape Alaska''s future for decades.

Governor James Mitchell addressed a joint session, outlining priorities that include infrastructure investments, support for rural communities, and workforce development initiatives aimed at keeping young Alaskans in the state.

"This session represents an opportunity to chart a course for Alaska that honors our past while embracing the opportunities of tomorrow," Mitchell said in his State of the State address.

Key issues expected to dominate the session include:
- The Permanent Fund dividend amount
- Education funding formula reforms
- Carbon capture and energy transition policies
- Infrastructure projects including road and port improvements

Legislative leaders from both parties expressed cautious optimism about finding common ground on priority issues.',
    'Michael Thompson',
    (SELECT id FROM public.categories WHERE slug = 'politics'),
    true,
    now() - interval '2 hours'
  ),
  (
    'Iditarod Mushers Prepare for Historic 2026 Race',
    'iditarod-mushers-prepare-2026',
    'Over 50 teams registered for the Last Great Race, including several international competitors.',
    'With less than two months until the ceremonial start in Anchorage, Iditarod mushers are putting final touches on their training as they prepare for the 2026 edition of the Last Great Race.

Race officials announced that 54 teams have registered for this year''s competition, including mushers from Norway, France, and Japan. The field features a mix of veteran champions and promising rookies.

"The trail conditions are looking excellent," said race director Mark Nordman. "We''ve had good early snowfall and cold temperatures that have helped set the trail nicely."

Four-time champion Dallas Seavey is among the favorites, along with recent winners Ryan Redington and Jessie Holmes. The race will follow the traditional northern route to Nome, covering approximately 1,000 miles of Alaska wilderness.',
    'Jennifer Walsh',
    (SELECT id FROM public.categories WHERE slug = 'sports'),
    false,
    now() - interval '4 hours'
  ),
  (
    'Fishing Industry Sees Record Salmon Harvest',
    'fishing-industry-record-salmon',
    'Bristol Bay salmon run exceeds expectations, providing economic boost to coastal communities.',
    'Alaska''s fishing industry is celebrating what officials are calling one of the best salmon seasons in recent memory, with Bristol Bay reporting a harvest that exceeded initial projections by 20%.

The commercial fishing fleet brought in over 80 million sockeye salmon during the summer season, providing a significant economic boost to fishing communities across Southwest Alaska. The strong returns are attributed to favorable ocean conditions and effective fishery management practices.

"This was an exceptional year," said Alaska Department of Fish and Game Commissioner James Haskins. "Our sustainable management approach continues to pay dividends for Alaska''s fishing families and communities."

The economic impact extends beyond the fishing fleet, benefiting processors, support services, and local businesses throughout the region. Industry analysts estimate the season''s total economic contribution at over $2 billion.',
    'Robert Chen',
    (SELECT id FROM public.categories WHERE slug = 'business'),
    false,
    now() - interval '6 hours'
  ),
  (
    'New Hiking Trail Opens in Chugach State Park',
    'new-hiking-trail-chugach',
    'The 8-mile Ptarmigan Ridge Trail offers stunning views of the Anchorage Bowl and Cook Inlet.',
    'Outdoor enthusiasts have a new destination to explore as Chugach State Park officially opened the Ptarmigan Ridge Trail this week. The 8-mile route offers hikers spectacular panoramic views of the Anchorage Bowl, Cook Inlet, and the Alaska Range.

Park rangers say the trail, which took three years to complete, was designed to accommodate hikers of varying skill levels while minimizing environmental impact. The route gains approximately 2,500 feet in elevation and features several rest areas with interpretive signage.

"This trail opens up a beautiful part of the park that was previously difficult to access," said park superintendent Lisa Morrison. "We''ve worked hard to create a sustainable trail that visitors can enjoy for generations."

The trailhead is located off the Glen Alps parking area and is accessible year-round, though winter visitors should be prepared for changing conditions and carry appropriate safety equipment.',
    'Amanda Foster',
    (SELECT id FROM public.categories WHERE slug = 'outdoors'),
    false,
    now() - interval '8 hours'
  );

-- Function to update article updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for articles
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_articles_category ON public.articles(category_id);
CREATE INDEX idx_articles_published ON public.articles(is_published, published_at DESC);
CREATE INDEX idx_articles_featured ON public.articles(is_featured, published_at DESC);
CREATE INDEX idx_articles_breaking ON public.articles(is_breaking, published_at DESC);
CREATE INDEX idx_breaking_news_active ON public.breaking_news(is_active, priority DESC);
CREATE INDEX idx_alerts_active ON public.alerts(is_active, severity);