import { cn } from "@/lib/utils";

export default function OnboardingProgress({ totalSteps, currentStep }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            index === currentStep
              ? "w-6 bg-primary"
              : index < currentStep
              ? "w-1.5 bg-primary/60"
              : "w-1.5 bg-slate-300 dark:bg-slate-600"
          )}
        />
      ))}
    </div>
  );
}
