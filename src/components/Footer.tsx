import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { AnimatedLogo } from '@/components/AnimatedLogo';

const sections = [
  { label: 'Local News', href: '/section/local' },
  { label: 'State News', href: '/section/state' },
  { label: 'Politics', href: '/section/politics' },
  { label: 'Business', href: '/section/business' },
  { label: 'Sports', href: '/section/sports' },
  { label: 'Outdoors', href: '/section/outdoors' },
  { label: 'Weather', href: '/weather' },
  { label: 'Community', href: '/section/community' },
];

const about = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Advertise', href: '/advertise' },
  { label: 'Careers', href: '/careers' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export const Footer = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer ref={ref} className="bg-primary text-primary-foreground" {...props}>
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <AnimatedLogo size="sm" showText={true} variant="light" />
            </Link>
            <p className="font-serif text-sm text-primary-foreground/80 mb-4">
              Serving Alaska with trusted journalism since 2026. Your source for local, state, and community news.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Sections */}
          <div>
            <h4 className="font-display text-lg font-bold mb-4">Sections</h4>
            <ul className="space-y-2">
              {sections.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="font-sans text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-display text-lg font-bold mb-4">About</h4>
            <ul className="space-y-2">
              {about.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="font-sans text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 shrink-0 text-accent" />
                <span className="font-sans text-sm text-primary-foreground/80">
                  123 Fourth Avenue<br />
                  Anchorage, AK 99501
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a href="tel:+19075551234" className="font-sans text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  (907) 555-1234
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a
                  href="mailto:newsteam@anchoragechronicle.com"
                  className="font-sans text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  newsteam@anchoragechronicle.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans text-primary-foreground/60">
            <p>© 2026 Alaska News Corporation LLC. All rights reserved.</p>
            <p>Proudly serving the Last Frontier</p>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
