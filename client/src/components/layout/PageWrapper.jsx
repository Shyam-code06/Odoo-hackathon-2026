import { memo } from 'react';
import { cn } from '@/utils';
import { APP_META } from '@/constants';

/**
 * PageWrapper — consistent page-level layout container.
 * Applies standard padding, max-width, and SEO title.
 */
export const PageWrapper = memo(function PageWrapper({ children, className, title, ...props }) {
  // Update document title for SEO
  if (title) {
    document.title = `${title} — ${APP_META.name}`;
  }

  return (
    <div
      className={cn('w-full space-y-0 font-sans', className)}
      {...props}
    >
      {children}
    </div>
  );
});

export default PageWrapper;
