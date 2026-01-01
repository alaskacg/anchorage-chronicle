import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  href?: string;
  showViewAll?: boolean;
}

export function SectionHeader({ title, href, showViewAll = true }: SectionHeaderProps) {
  return (
    <div className="section-header flex items-center justify-between">
      <h2 className="font-display text-2xl font-bold text-primary">{title}</h2>
      {showViewAll && href && (
        <Link
          to={href}
          className="flex items-center gap-1 text-sm font-sans font-medium text-accent transition-opacity hover:opacity-80"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
