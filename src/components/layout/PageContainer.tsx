import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  to?: string;
}

interface PageContainerProps {
  title?: string;
  breadcrumbs?: Breadcrumb[];
  children: ReactNode;
  className?: string;
}

export default function PageContainer({
  title,
  breadcrumbs,
  children,
  className = '',
}: PageContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-gray-400 mb-4">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <span key={index} className="flex items-center gap-1">
                {crumb.to && !isLast ? (
                  <Link
                    to={crumb.to}
                    className="hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-gray-700 font-medium' : ''}>
                    {crumb.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="w-4 h-4" />}
              </span>
            );
          })}
        </nav>
      )}
      {title && (
        <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-6">{title}</h1>
      )}
      {children}
    </div>
  );
}
