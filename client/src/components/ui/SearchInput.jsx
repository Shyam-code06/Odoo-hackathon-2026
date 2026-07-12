import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils';

/**
 * Reusable animated Search component for filter tables & query actions
 */
export const SearchInput = forwardRef(({
  className,
  value = '',
  onChange,
  onClear,
  placeholder = 'Search records...',
  isDisabled = false,
  ...props
}, ref) => {
  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </span>

      <input
        ref={ref}
        type="text"
        disabled={isDisabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full text-xs py-3 pr-4 pl-9.5 bg-white border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all",
          value && "pr-10",
          isDisabled && "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
        )}
        {...props}
      />

      {value && !isDisabled && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Clear search input"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
