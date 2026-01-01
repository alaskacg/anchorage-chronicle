import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';

interface AlaskaQuoteProps {
  quote: string;
  author: string;
  variant?: 'default' | 'featured' | 'sidebar';
}

const alaskaQuotes = [
  { quote: "Alaska is not a place for the faint of heart. It's a place for those whose hearts beat for adventure.", author: "Unknown Alaskan" },
  { quote: "In Alaska, the wilderness is not just a place you visit—it's where you find yourself.", author: "Alaska Proverb" },
  { quote: "The land itself is a living entity, speaking through its rivers, mountains, and northern lights.", author: "Native Alaskan Wisdom" },
  { quote: "Alaska: Where every sunrise writes a new chapter in the story of the Last Frontier.", author: "Anchorage Journal" },
  { quote: "We came to Alaska because we believed in living life on our own terms.", author: "Homesteader's Creed" },
  { quote: "The cold doesn't build character—it reveals it.", author: "Fairbanks Saying" },
  { quote: "In the silence of Alaska's wilderness, you hear what truly matters.", author: "Denali Observer" },
  { quote: "Alaska isn't at the edge of the world—it's at the center of ours.", author: "State Motto Adaptation" },
  { quote: "When the aurora dances overhead, even the most skeptical hearts believe in magic.", author: "Northern Lights Watcher" },
  { quote: "We measure wealth not in gold, but in sunrises over mountains and salmon in the stream.", author: "Alaska Native Proverb" },
  { quote: "The Last Frontier isn't just a nickname—it's a way of life.", author: "Alaska Tourism" },
  { quote: "Alaska teaches you that you're never too small to make a difference, or too big for humility.", author: "Bush Pilot Wisdom" },
];

export function AlaskaQuote({ quote, author, variant = 'default' }: AlaskaQuoteProps) {
  const variantStyles = {
    default: 'bg-card border border-border p-6',
    featured: 'bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-l-4 border-accent p-8',
    sidebar: 'bg-muted/50 p-4 border-l-2 border-secondary',
  };

  return (
    <blockquote className={`${variantStyles[variant]} relative overflow-hidden group`}>
      {/* Background decoration */}
      <div className="absolute top-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <Quote className={variant === 'featured' ? 'h-24 w-24' : 'h-16 w-16'} />
      </div>

      <Quote className={`text-accent mb-3 ${variant === 'featured' ? 'h-8 w-8' : 'h-5 w-5'}`} />
      
      <p className={`font-serif italic text-foreground relative z-10 ${
        variant === 'featured' ? 'text-xl md:text-2xl leading-relaxed' : 
        variant === 'sidebar' ? 'text-sm leading-relaxed' : 'text-base md:text-lg leading-relaxed'
      }`}>
        "{quote}"
      </p>
      
      <footer className={`mt-4 font-sans font-medium text-muted-foreground ${
        variant === 'featured' ? 'text-base' : 'text-sm'
      }`}>
        — {author}
      </footer>
    </blockquote>
  );
}

export function RandomAlaskaQuote({
  variant = 'default',
  autoRotateMs = 10000,
}: {
  variant?: 'default' | 'featured' | 'sidebar';
  autoRotateMs?: number;
}) {
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * alaskaQuotes.length));

  useEffect(() => {
    if (!autoRotateMs || autoRotateMs <= 0) return;
    const id = window.setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % alaskaQuotes.length);
    }, autoRotateMs);
    return () => window.clearInterval(id);
  }, [autoRotateMs]);

  const q = alaskaQuotes[quoteIndex];
  return <AlaskaQuote quote={q.quote} author={q.author} variant={variant} />;
}

export { alaskaQuotes };
