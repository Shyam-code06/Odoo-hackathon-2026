import { forwardRef, useState } from 'react';
import { Eye, EyeOff, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/utils';

/**
 * Reusable premium form Input control with advanced prefix/suffix capabilities
 */
export const Input = forwardRef(({
  className,
  label,
  type = 'text',
  placeholder,
  error,
  isSuccess = false,
  isDisabled = false,
  helperText,
  prefixIcon: PrefixIcon,
  suffixIcon: SuffixIcon,
  onClear,
  value,
  onChange,
  isRequired = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 select-none">
          {label}
          {isRequired && <span className="text-brand-danger" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {PrefixIcon && (
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <PrefixIcon className="w-4 h-4" />
          </span>
        )}

        <input
          ref={ref}
          type={resolvedType}
          placeholder={placeholder}
          disabled={isDisabled}
          value={value}
          onChange={onChange}
          className={cn(
            "w-full text-xs py-3.5 pr-4 pl-4 bg-white border rounded-xl placeholder-slate-400 transition-all focus:outline-none",
            PrefixIcon && "pl-10",
            (isPassword || onClear || SuffixIcon || error || isSuccess) && "pr-11",
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

        {/* Input End Adornments */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5 text-slate-400">
          {onClear && value && !isDisabled && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 hover:bg-slate-100 rounded-lg hover:text-slate-700 transition-colors"
              aria-label="Clear input value"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {isPassword && !isDisabled && (
            <button
              type="button"
              onClick={handlePasswordToggle}
              className="p-1 hover:bg-slate-100 rounded-lg hover:text-slate-700 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          )}

          {error && <AlertCircle className="w-4 h-4 text-brand-danger" />}
          {!error && isSuccess && <CheckCircle2 className="w-4 h-4 text-brand-success" />}
          {!error && !isSuccess && SuffixIcon && <SuffixIcon className="w-4 h-4" />}
        </div>
      </div>

      {/* Helper text or validation errors */}
      {error && (
        <span className="text-[11px] font-medium text-brand-danger flex items-center gap-1 mt-0.5" role="alert">
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

Input.displayName = 'Input';

export default Input;
