import { cn } from "@/lib/utils";

export const PasswordStrength = ({ password }) => {
  const calculateStrength = (pwd) => {
    let strength = 0;
    const requirements = {
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };

    strength += requirements.minLength ? 20 : 0;
    strength += requirements.hasUpperCase ? 20 : 0;
    strength += requirements.hasLowerCase ? 20 : 0;
    strength += requirements.hasNumber ? 20 : 0;
    strength += requirements.hasSpecial ? 20 : 0;

    return { strength, requirements };
  };

  const getColorClass = (strength) => {
    if (strength <= 20) return "bg-red-500 dark:bg-red-400";
    if (strength <= 40) return "bg-orange-500 dark:bg-orange-400";
    if (strength <= 60) return "bg-yellow-500 dark:bg-yellow-400";
    if (strength <= 80) return "bg-lime-500 dark:bg-lime-400";
    return "bg-green-500 dark:bg-green-400";
  };

  const getTextColorClass = (strength) => {
    if (strength <= 20) return "text-red-600 dark:text-red-400";
    if (strength <= 40) return "text-orange-600 dark:text-orange-400";
    if (strength <= 60) return "text-yellow-600 dark:text-yellow-400";
    if (strength <= 80) return "text-lime-600 dark:text-lime-400";
    return "text-green-600 dark:text-green-400";
  };

  const getStrengthLabel = (strength) => {
    if (strength <= 20) return "Very Weak";
    if (strength <= 40) return "Weak";
    if (strength <= 60) return "Fair";
    if (strength <= 80) return "Good";
    return "Strong";
  };

  const { strength, requirements } = calculateStrength(password);
  const segments = 5;
  const filledSegments = Math.ceil(strength / 20);

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className="flex gap-1">
        {[...Array(segments)].map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              index < filledSegments
                ? getColorClass(strength)
                : "bg-slate-200 dark:bg-slate-700"
            )}
          />
        ))}
      </div>

      {/* Strength Label */}
      {password && (
        <p className={cn("text-xs font-medium", getTextColorClass(strength))}>
          Password Strength: {getStrengthLabel(strength)}
        </p>
      )}

      {/* Requirements Checklist */}
      {password && (
        <ul className="space-y-1 text-xs mt-2">
          <li
            className={
              requirements.minLength
                ? "text-green-600 dark:text-green-400"
                : "text-slate-500 dark:text-slate-400"
            }
          >
            <span className="mr-1">{requirements.minLength ? "✓" : "○"}</span>
            At least 8 characters
          </li>
          <li
            className={
              requirements.hasUpperCase
                ? "text-green-600 dark:text-green-400"
                : "text-slate-500 dark:text-slate-400"
            }
          >
            <span className="mr-1">{requirements.hasUpperCase ? "✓" : "○"}</span>
            One uppercase letter
          </li>
          <li
            className={
              requirements.hasLowerCase
                ? "text-green-600 dark:text-green-400"
                : "text-slate-500 dark:text-slate-400"
            }
          >
            <span className="mr-1">{requirements.hasLowerCase ? "✓" : "○"}</span>
            One lowercase letter
          </li>
          <li
            className={
              requirements.hasNumber
                ? "text-green-600 dark:text-green-400"
                : "text-slate-500 dark:text-slate-400"
            }
          >
            <span className="mr-1">{requirements.hasNumber ? "✓" : "○"}</span>
            One number
          </li>
          <li
            className={
              requirements.hasSpecial
                ? "text-green-600 dark:text-green-400"
                : "text-slate-500 dark:text-slate-400"
            }
          >
            <span className="mr-1">{requirements.hasSpecial ? "✓" : "○"}</span>
            One special character
          </li>
        </ul>
      )}
    </div>
  );
};
