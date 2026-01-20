import { useTranslation } from "react-i18next";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

export default function AddButtonSpotlight({ children }) {
  const { t } = useTranslation();
  const { isAddButtonHighlighted, showAddButtonTooltip } = useOnboarding();

  if (!isAddButtonHighlighted) {
    return children;
  }

  // Pulsing animation wrapper
  const PulsingWrapper = (
    <div className="relative inline-flex">
      <motion.div
        className="absolute inset-0 rounded-md bg-primary/30"
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [0.6, 0, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-md bg-primary/30"
        animate={{
          scale: [1, 1.3, 1.3],
          opacity: [0.6, 0, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.3,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );

  // Show tooltip only after Get Started is clicked
  if (!showAddButtonTooltip) {
    return PulsingWrapper;
  }

  return (
    <TooltipProvider>
      <Tooltip open={true}>
        <TooltipTrigger asChild>{PulsingWrapper}</TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-primary text-primary-foreground font-medium"
          sideOffset={8}
        >
          {t("onboarding.clickToAdd")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
