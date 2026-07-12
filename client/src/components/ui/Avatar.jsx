import { useState } from 'react';
import { cn } from '@/utils';

/**
 * Premium Avatar component with fallback initials and status indicators
 */
export function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  status, // 'available' | 'on_trip' | 'off_duty' | 'suspended'
  className,
  ...props
}) {
  const [imageError, setImageError] = useState(false);

  // Generate initials (up to 2 characters) from the name
  const getInitials = (fullName) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusColors = {
    available: 'bg-brand-success ring-white',
    on_trip: 'bg-brand-primary ring-white',
    off_duty: 'bg-slate-400 ring-white',
    suspended: 'bg-brand-danger ring-white',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5 border-[1px]',
    sm: 'w-2 h-2 border-[1.5px]',
    md: 'w-2.5 h-2.5 border-[2px]',
    lg: 'w-3 h-3 border-[2px]',
    xl: 'w-4 h-4 border-[2px.5]',
  };

  return (
    <div className={cn("relative shrink-0 select-none", className)} {...props}>
      <div className={cn(
        "rounded-full flex items-center justify-center font-bold text-slate-600 bg-brand-bg-secondary overflow-hidden border border-slate-200",
        sizes[size]
      )}>
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name) || '?'}</span>
        )}
      </div>

      {status && statusColors[status] && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border border-white shrink-0 shadow-sm",
            statusColors[status],
            statusSizes[size]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}

export default Avatar;
