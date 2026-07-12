import { useState, useRef, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/utils';

/**
 * Premium Keyboard-Accessible Custom Select Dropdown
 */
export const Select = forwardRef(({
  className,
  label,
  options = [], // [{ value: '...', label: '...' }]
  placeholder = 'Select an option',
  value,
  onChange,
  error,
  isDisabled = false,
  isSearchable = false,
  isRequired = false,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle open
  const toggleDropdown = () => {
    if (isDisabled) return;
    setIsOpen(!isOpen);
    setSearchQuery('');
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset index when dropdown opens/closes
  useEffect(() => {
    if (isOpen) {
      const selectedIndex = options.findIndex((opt) => opt.value === value);
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
      if (isSearchable && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    } else {
      setActiveIndex(-1);
    }
  }, [isOpen, value, isSearchable, options]);

  const handleSelect = (option) => {
    if (onChange) {
      onChange(option.value);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  // Keyboard navigation controller
  const handleKeyDown = (e) => {
    if (isDisabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[activeIndex]) {
          handleSelect(filteredOptions[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        // Tab closes select panel naturally
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div 
      className="flex flex-col gap-1.5 w-full text-left" 
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 select-none">
          {label}
          {isRequired && <span className="text-brand-danger" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative w-full">
        {/* Toggle Button */}
        <button
          ref={ref}
          type="button"
          disabled={isDisabled}
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={cn(
            "w-full flex items-center justify-between text-xs py-3.5 pr-4 pl-4 bg-white border rounded-xl placeholder-slate-400 transition-all focus:outline-none cursor-pointer text-slate-800",
            error 
              ? "border-brand-danger bg-red-50/10 focus:border-brand-danger focus:ring-1 focus:ring-brand-danger"
              : isOpen
                ? "border-brand-primary ring-1 ring-brand-primary/30"
                : "border-slate-200 hover:border-slate-300 focus:border-brand-primary",
            isDisabled && "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed",
            className
          )}
          {...props}
        >
          <span className={cn(!selectedOption && "text-slate-400")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0", isOpen && "rotate-180")} />
        </button>

        {/* Dropdown Options List */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-premium-lg z-50 overflow-hidden"
            >
              {/* Optional Search Filter */}
              {isSearchable && (
                <div className="flex items-center gap-2 p-2 border-b border-subtle">
                  <Search className="w-4 h-4 text-slate-400 ml-1.5 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search options..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs py-1.5 focus:outline-none bg-transparent"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Options Listbox */}
              <ul 
                role="listbox" 
                className="max-h-60 overflow-y-auto py-1"
                aria-label={label || "Options"}
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt, idx) => {
                    const isSelected = value === opt.value;
                    const isActive = idx === activeIndex;

                    return (
                      <li
                        key={opt.value}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(opt)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          "cursor-pointer text-xs px-4 py-2.5 flex items-center justify-between transition-colors",
                          isActive ? "bg-brand-bg-secondary text-slate-800 font-semibold" : "text-slate-655",
                          isSelected && "text-brand-primary font-bold bg-blue-50/40"
                        )}
                      >
                        <span>{opt.label}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                        )}
                      </li>
                    );
                  })
                ) : (
                  <li className="text-xs px-4 py-4 text-slate-400 text-center select-none">
                    No results found
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <span className="text-[11px] font-medium text-brand-danger mt-0.5" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
