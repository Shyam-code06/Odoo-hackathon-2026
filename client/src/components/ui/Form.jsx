import { cn } from '@/utils';

/**
 * Reusable Form Layout helper components
 */

/**
 * Standard accessible form label
 */
export function FormLabel({
  children,
  className,
  isRequired = false,
  htmlFor,
  ...props
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 select-none",
        className
      )}
      {...props}
    >
      {children}
      {isRequired && (
        <span className="text-brand-danger font-bold" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

/**
 * Helper instructions or constraints
 */
export function FormDescription({ children, className, ...props }) {
  return (
    <p
      className={cn("text-[11px] font-medium text-slate-450 leading-normal select-none", className)}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * Red error messages
 */
export function FormError({ children, className, ...props }) {
  if (!children) return null;
  return (
    <span
      className={cn("text-[11px] font-medium text-brand-danger flex items-center gap-1 select-none", className)}
      role="alert"
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * Container wrapping a control with standard padding and layout
 */
export function FormField({
  children,
  className,
  label,
  error,
  description,
  isRequired = false,
  id,
  ...props
}) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full text-left", className)} {...props}>
      {label && (
        <FormLabel htmlFor={id} isRequired={isRequired}>
          {label}
        </FormLabel>
      )}
      
      {/* If child is a React input, bind error/required state directly if appropriate */}
      <div className="w-full">
        {children}
      </div>

      {error && <FormError>{error}</FormError>}
      {!error && description && <FormDescription>{description}</FormDescription>}
    </div>
  );
}

export default FormField;
