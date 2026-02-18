/**
 * EmpireFooter — Universal footer for Alaska Business Empire sites.
 *
 * Drop this file into any site's src/components/ directory.
 * Usage: <EmpireFooter />
 *
 * No external dependencies — React + Tailwind CSS only.
 */

interface FooterLink {
  name: string;
  url: string;
}

const NEWS_LINKS: FooterLink[] = [
  { name: 'Anchorage Chronicle', url: 'https://anchoragechronicle.com' },
  { name: 'Kenai News', url: 'https://kenainews.com' },
  { name: 'Tongass News', url: 'https://tongassnews.com' },
  { name: 'Chugach News', url: 'https://chugachnews.com' },
  { name: 'Alcan News', url: 'https://alcannews.com' },
  { name: 'Alaska Gold News', url: 'https://alaskagoldnews.com' },
  { name: 'Alaska Fires', url: 'https://alaskafires.com' },
];

const MARKETPLACE_LINKS: FooterLink[] = [
  { name: 'Alaska Metals Exchange', url: 'https://alaskametalsexchange.com' },
  { name: 'Kenai Borough Realty', url: 'https://kenaiboroughrealty.com' },
  { name: 'Kenai Auto Sales', url: 'https://kenaiautosales.com' },
  { name: 'Alaska Listings', url: 'https://aklistings.com' },
  { name: 'Kenai Listings', url: 'https://kenailistings.com' },
  { name: "Alaska's Store", url: 'https://alaskasstore.com' },
  { name: 'Alaska Domains', url: 'https://alaskadomains.com' },
];

const SERVICES_LINKS: FooterLink[] = [
  { name: 'Alaska Consulting Group', url: 'https://alaskaconsultinggroup.com' },
  { name: 'Alaska Guide Listings', url: 'https://alaskaguidelistings.com' },
  { name: 'Alaska Drone Survey', url: 'https://alaskadronesurvey.com' },
  { name: 'Alaska Minerals Exploration', url: 'https://akmineralexploration.com' },
];

const FOUNDATION_LINKS: FooterLink[] = [
  { name: 'The Alaska Foundation', url: 'https://thealaskafoundation.com' },
];

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function EmpireFooter() {
  return (
    <footer className="bg-slate-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <LinkColumn title="News" links={NEWS_LINKS} />
          <LinkColumn title="Marketplace" links={MARKETPLACE_LINKS} />
          <LinkColumn title="Services" links={SERVICES_LINKS} />
          <LinkColumn title="Foundations" links={FOUNDATION_LINKS} />
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AK</span>
              </div>
              <span className="text-sm font-semibold text-white">
                Part of the Alaska Business Empire
              </span>
            </div>

            {/* Contact */}
            <a
              href="mailto:admin@alaskaconsultinggroup.com"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              admin@alaskaconsultinggroup.com
            </a>
          </div>

          {/* Bottom line */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <p>&copy; 2026 Alaska Consulting Group LLC. All rights reserved.</p>
            <p>Kenai Peninsula, Alaska</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
