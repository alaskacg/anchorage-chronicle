import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';

interface AlaskaQuoteProps {
  quote: string;
  author: string;
  variant?: 'default' | 'featured' | 'sidebar';
}

// Curated collection of meaningful Alaska quotes - removed silly/humorous entries
const alaskaQuotes = [
  // Historical Alaskans & Pioneers
  { quote: "Alaska is what happens when God's having a good day.", author: "Sydney Laurence, Alaskan Painter" },
  { quote: "In Alaska, we measure distance in time, not miles.", author: "Fairbanks Pioneer Saying" },
  { quote: "The cold doesn't build character—it reveals it.", author: "Fairbanks Sourdough Proverb" },
  { quote: "Alaska is a land that teaches you to be humble every single day.", author: "Walter Harper, First to Summit Denali" },
  { quote: "You haven't lived until you've watched the sun set at midnight.", author: "Nome Settler's Journal, 1902" },
  { quote: "We came here not to escape life, but to find it.", author: "Matanuska Valley Homesteader" },
  { quote: "Alaska forgives nothing, but rewards everything.", author: "Iditarod Musher Proverb" },
  
  // Native Alaskan Wisdom
  { quote: "The land knows you, even when you have forgotten who you are.", author: "Tlingit Proverb" },
  { quote: "We are the land and the land is us.", author: "Yup'ik Elder Teaching" },
  { quote: "Listen to the wind, it talks. Listen to the silence, it speaks.", author: "Inupiat Wisdom" },
  { quote: "A canoe doesn't know its master until the rapids.", author: "Athabascan Proverb" },
  { quote: "Walk softly on the earth—she is your grandmother.", author: "Haida Proverb" },
  { quote: "When you drink from the stream, remember the spring.", author: "Tsimshian Teaching" },
  { quote: "To know the trail ahead, ask those returning.", author: "Dena'ina Proverb" },
  { quote: "Even the smallest river carves the deepest canyon.", author: "Eyak Saying" },
  
  // Bush Pilots & Aviators
  { quote: "There are old pilots and bold pilots, but no old, bold pilots in Alaska.", author: "Don Sheldon, Talkeetna Bush Pilot" },
  { quote: "Trust your instruments, but trust the mountain more.", author: "Denali Flight Service" },
  { quote: "A good pilot is always learning, especially from the ones who didn't make it.", author: "Bethel Bush Pilot" },
  
  // Fishermen & Mariners
  { quote: "The sea takes what she wants and gives what she pleases.", author: "Bristol Bay Fisherman" },
  { quote: "A boat in harbor is safe, but that's not what boats are for.", author: "Sitka Seiner Captain" },
  { quote: "The best captain is the one who knows when to stay ashore.", author: "Dutch Harbor Proverb" },
  { quote: "Respect the Bering Sea, or she'll teach you a lesson you won't live to remember.", author: "Crab Fleet Wisdom" },
  
  // Mushers & Dog Sledders
  { quote: "The dogs don't know it's a race. They just love to run.", author: "Susan Butcher, 4-Time Iditarod Champion" },
  { quote: "Every mile between Anchorage and Nome teaches you something about yourself.", author: "Joe Redington Sr., Father of the Iditarod" },
  { quote: "Out on the trail, your dogs become your family and your lifeline.", author: "DeeDee Jonrowe, Iditarod Legend" },
  { quote: "When you're out there at forty below, there's only you, your dogs, and the aurora.", author: "Nome Finish Line Saying" },
  { quote: "The Iditarod doesn't build champions—it reveals them.", author: "Rick Swenson, 5-Time Champion" },
  { quote: "A tired dog team will still run for a good musher.", author: "Willow Kennel Wisdom" },
  
  // Modern Alaskans
  { quote: "In the silence of Alaska's wilderness, you hear what truly matters.", author: "Celia Hunter, Alaska Conservationist" },
  { quote: "Alaska isn't at the edge of the world—it's at the center of ours.", author: "Ted Stevens, U.S. Senator (Alaska)" },
  { quote: "We measure wealth not in gold, but in sunrises over mountains and salmon in the stream.", author: "Alaska Native Foundation" },
  { quote: "This land was alive long before us and will endure long after.", author: "Margaret Murie, Grandmother of Conservation" },
  { quote: "Alaska is not a place for the faint of heart. It's a place for those whose hearts beat for adventure.", author: "Libby Riddles, First Woman Iditarod Champion" },
  { quote: "You don't conquer Alaska—you learn to live with her on her terms.", author: "Anchorage Mountaineering Club" },
  
  // Philosophy & Life
  { quote: "The Last Frontier isn't just a nickname—it's a way of life.", author: "Alaska State Tourism" },
  { quote: "Alaska: where you go to find yourself, but end up finding something much bigger.", author: "Backpacker Magazine" },
  { quote: "Living in Alaska means knowing what matters and letting go of what doesn't.", author: "Homer Homesteader" },
  { quote: "Out here, the sky isn't the limit—it's just the beginning.", author: "Talkeetna Climber" },
  { quote: "Alaska teaches you that you're never too small to make a difference, or too big for humility.", author: "Bush Community Saying" },
  { quote: "The only thing bigger than Alaska is the hearts of the people who live here.", author: "Anchorage Daily News" },
  { quote: "We came to Alaska because we believed in living life on our own terms.", author: "Delta Junction Homesteader" },
  { quote: "Alaska: Where every sunrise writes a new chapter in the story of the Last Frontier.", author: "Kenai Peninsula Journal" },
  { quote: "Some people dream of Alaska. We're lucky enough to live the dream.", author: "Sitka Resident" },
  
  // Survival & Resilience
  { quote: "Adapt, improvise, overcome—or Alaska will overcome you.", author: "Alaska National Guard Motto" },
  { quote: "Plan for the worst, hope for the best, and always carry extra matches.", author: "Wilderness Survival Instructor" },
  { quote: "The wilderness doesn't care about your schedule.", author: "Chugach Backcountry Guide" },
  { quote: "Prepare like you'll never be rescued, and you probably won't need to be.", author: "Alaska State Troopers" },
  
  // Community & Connection
  { quote: "In Alaska, your neighbor might be fifty miles away, but they'll be there in five minutes if you need them.", author: "Rural Alaska Saying" },
  { quote: "Small towns have long memories and big hearts.", author: "Seward Community Proverb" },
  { quote: "Anyone can visit Alaska. It takes a special soul to stay.", author: "Glacier View Lodge" },
  { quote: "Up here, helping a stranger isn't charity—it's survival.", author: "Alaska Highway Patrol" },
];

export function AlaskaQuote({ quote, author, variant = 'default' }: AlaskaQuoteProps) {
  const variantStyles = {
    default: 'bg-card border border-border p-6',
    featured: 'bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-l-4 border-accent p-8',
    sidebar: 'bg-muted/50 p-4 border-l-2 border-secondary',
  };

  return (
    <blockquote className={`${variantStyles[variant]} relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute top-2 right-2 opacity-5">
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
  autoRotateMs = 30000, // 30 seconds default for rare repetition
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
