import { forwardRef } from 'react';
import { cn } from '@/utils';

/**
 * Reusable premium multi-line Textarea field
 */
export const Textarea = forwardRef(({
  className,
  label,
  placeholder,
  error,
  isSuccess = false,
  isDisabled = false,
  helperText,
  rows = 4,
  maxLength,
  value = '',
  onChange,
  isRequired = false,
  ...props
}, ref) => {
  const currentLength = value ? String(value).length : 0;

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <div className="flex justify-between items-center select-none">
        {label && (
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            {label}
            {isRequired && <span className="text-brand-danger" aria-hidden="true">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="text-[10px] font-semibold text-slate-400">
            {currentLength} / {maxLength}
          </span>
        )}
      </div>

      <div className="relative w-full">
        <textarea
          ref={ref}
          placeholder={placeholder}
          disabled={isDisabled}
          rows={rows}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          className={cn(
            "w-full text-xs p-3.5 bg-white border rounded-xl placeholder-slate-400 transition-all focus:outline-none resize-y",
            error 
              ? "border-brand-danger bg-red-50/10 focus:border-brand-danger focus:ring-1 focus:ring-brand-danger"
              : isSuccess
                ? "border-brand-success bg-green-50/10 focus:border-brand-success focus:ring-1 focus:ring-brand-success"
                : "border-slate-200 hover:border-slate-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30",
            isDisabled && "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed",
            className
          )}
          {...props}
        />
      </div>

      {error && (
        <span className="text-[11px] font-medium text-brand-danger mt-0.5" role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span className="text-[11px] font-medium text-slate-400 mt-0.5">
          {helperText}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
