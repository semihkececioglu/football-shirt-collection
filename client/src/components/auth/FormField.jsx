import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const FormField = ({
  label,
  id,
  type = "text",
  placeholder,
  error,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  register,
  required = false,
  className,
  ...props
}) => {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>

      <div className="relative">
        {LeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <LeftIcon className="h-[18px] w-[18px]" />
          </div>
        )}

        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={cn(
            "h-11 rounded-lg transition-all duration-200",
            "border-slate-200 dark:border-slate-700",
            "focus:border-slate-400 dark:focus:border-slate-500",
            "focus-visible:ring-2 focus-visible:ring-slate-200 dark:focus-visible:ring-slate-700",
            LeftIcon && "pl-10",
            RightIcon && "pr-10",
            error && "border-red-500 focus-visible:ring-red-200 dark:focus-visible:ring-red-900",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          {...register}
          {...props}
        />

        {RightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <RightIcon className="h-[18px] w-[18px] text-slate-400" />
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="text-xs text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          {error}
        </p>
      )}
    </div>
  );
};
