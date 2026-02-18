/**
 * EmpireNetwork — Alaska Business Empire Cross-Promotion Component
 *
 * Drop this file into any site's src/components/ directory.
 * Usage: <EmpireNetwork currentSite="anchorage-chronicle" />
 *
 * No external dependencies — React + Tailwind CSS only.
 */

interface EmpireSite {
  id: string;
  name: string;
  url: string;
  tagline: string;
  category: string;
  gradient: string;
}

const EMPIRE_SITES: EmpireSite[] = [
  // News
  { id: 'anchorage-chronicle', name: 'Anchorage Chronicle', url: 'https://anchoragechronicle.com', tagline: "Anchorage's Premier News Source", category: 'news', gradient: 'from-blue-900 to-slate-900' },
  { id: 'kenai-news', name: 'Kenai News', url: 'https://kenainews.com', tagline: 'Kenai Peninsula Coverage', category: 'news', gradient: 'from-emerald-900 to-slate-900' },
  { id: 'tongass-news', name: 'Tongass News', url: 'https://tongassnews.com', tagline: 'Southeast Alaska News', category: 'news', gradient: 'from-teal-900 to-slate-900' },
  { id: 'chugach-news', name: 'Chugach News', url: 'https://chugachnews.com', tagline: 'Southcentral Alaska Updates', category: 'news', gradient: 'from-cyan-900 to-slate-900' },
  { id: 'alcan-news', name: 'Alcan News', url: 'https://alcannews.com', tagline: 'Alaska Highway & Interior', category: 'news', gradient: 'from-indigo-900 to-slate-900' },
  { id: 'alaska-gold-news', name: 'Alaska Gold News', url: 'https://alaskagoldnews.com', tagline: 'Mining & Precious Metals', category: 'news', gradient: 'from-yellow-900 to-slate-900' },
  { id: 'alaska-fires', name: 'Alaska Fires', url: 'https://alaskafires.com', tagline: 'Wildfire Tracking & Safety', category: 'news', gradient: 'from-red-900 to-slate-900' },

  // Commerce
  { id: 'alaska-metals-exchange', name: 'Alaska Metals Exchange', url: 'https://alaskametalsexchange.com', tagline: 'Buy & Sell Gold & Silver', category: 'commerce', gradient: 'from-amber-900 to-slate-900' },
  { id: 'kenai-borough-realty', name: 'Kenai Borough Realty', url: 'https://kenaiboroughrealty.com', tagline: 'Alaska Real Estate', category: 'realty', gradient: 'from-green-900 to-slate-900' },
  { id: 'kenai-auto-sales', name: 'Kenai Auto Sales', url: 'https://kenaiautosales.com', tagline: 'Cars & Trucks For Sale', category: 'commerce', gradient: 'from-orange-900 to-slate-900' },
  { id: 'alaska-listings', name: 'Alaska Listings', url: 'https://aklistings.com', tagline: 'Statewide Classifieds', category: 'listings', gradient: 'from-violet-900 to-slate-900' },
  { id: 'kenai-listings', name: 'Kenai Listings', url: 'https://kenailistings.com', tagline: 'Kenai Peninsula Classifieds', category: 'listings', gradient: 'from-purple-900 to-slate-900' },
  { id: 'alaska-guide-listings', name: 'Alaska Guide Listings', url: 'https://alaskaguidelistings.com', tagline: 'Find Guides & Outfitters', category: 'services', gradient: 'from-lime-900 to-slate-900' },

  // Services
  { id: 'alaska-consulting-group', name: 'Alaska Consulting Group', url: 'https://alaskaconsultinggroup.com', tagline: 'Business Strategy & Consulting', category: 'services', gradient: 'from-slate-800 to-blue-900' },
  { id: 'alaska-drone-survey', name: 'Alaska Drone Survey', url: 'https://alaskadronesurvey.com', tagline: 'Aerial Mapping & Surveys', category: 'services', gradient: 'from-sky-900 to-slate-900' },
  { id: 'alaska-minerals-exploration', name: 'Alaska Minerals Exploration', url: 'https://akmineralexploration.com', tagline: 'Geological Survey Services', category: 'mining', gradient: 'from-stone-800 to-slate-900' },

  // Foundation
  { id: 'alaska-foundation', name: 'The Alaska Foundation', url: 'https://thealaskafoundation.com', tagline: "Protecting Alaska's Wilderness", category: 'nonprofit', gradient: 'from-emerald-900 to-green-950' },

  // Domains
  { id: 'alaska-domains', name: 'Alaska Domains', url: 'https://alaskadomains.com', tagline: 'Premium Alaska Domain Names', category: 'domains', gradient: 'from-fuchsia-900 to-slate-900' },

  // Store
  { id: 'alaskas-store', name: "Alaska's Store", url: 'https://alaskasstore.com', tagline: 'Alaska Products & Gear', category: 'commerce', gradient: 'from-rose-900 to-slate-900' },
];

const CATEGORY_LABELS: Record<string, string> = {
  news: '📰 News',
  commerce: '🛒 Commerce',
  realty: '🏠 Real Estate',
  listings: '📋 Listings',
  services: '🔧 Services',
  mining: '⛏️ Mining',
  nonprofit: '🌲 Foundation',
  domains: '🌐 Domains',
};

/** Deterministic shuffle seeded by the current day so promotions rotate daily. */
function dailyShuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  const today = new Date();
  let seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  for (let i = copy.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = seed % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface EmpireNetworkProps {
  /** The id of the current site — it will be excluded from the promotions grid. */
  currentSite: string;
  /** Number of partner cards to display (default 8). */
  count?: number;
}

export default function EmpireNetwork({ currentSite, count = 8 }: EmpireNetworkProps) {
  const partners = dailyShuffle(
    EMPIRE_SITES.filter((s) => s.id !== currentSite),
  ).slice(0, count);

  return (
    <section className="bg-slate-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest text-blue-400 uppercase mb-2">
            Discover More
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Alaska Business Network
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Explore our family of trusted Alaska websites — news, commerce,
            real&nbsp;estate, services, and&nbsp;more.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {partners.map((site) => (
            <a
              key={site.id}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${site.gradient} border border-white/10 p-6 transition-all duration-300 hover:scale-[1.03] hover:border-white/25 hover:shadow-lg hover:shadow-blue-500/10`}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <span className="inline-block text-[11px] font-medium tracking-wider uppercase text-slate-400 mb-3">
                  {CATEGORY_LABELS[site.category] ?? site.category}
                </span>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                  {site.name}
                </h3>
                <p className="text-sm text-slate-300">{site.tagline}</p>

                <span className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                  Visit Site
                  <svg
                    className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Footer badge */}
        <p className="text-center text-xs text-slate-600 mt-10">
          Part of the{' '}
          <span className="text-slate-400 font-medium">Alaska Business Empire</span>{' '}
          · Alaska Consulting Group LLC
        </p>
      </div>
    </section>
  );
}
