import { useRef } from "react";
import { useTranslation } from "react-i18next";
import confetti from "canvas-confetti";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/OnboardingContext";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeStep from "./steps/WelcomeStep";
import SettingsStep from "./steps/SettingsStep";
import AddButtonStep from "./steps/AddButtonStep";
import OnboardingProgress from "./OnboardingProgress";

const triggerConfetti = () => {
  const end = Date.now() + 3 * 1000;
  const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    });

    requestAnimationFrame(frame);
  };

  frame();
};

const steps = [
  { component: WelcomeStep },
  { component: SettingsStep },
  { component: AddButtonStep },
];

export default function OnboardingModal() {
  const { t } = useTranslation();
  const isCompletingRef = useRef(false);
  const {
    shouldShowOnboarding,
    currentStep,
    nextStep,
    prevStep,
    skipOnboarding,
    completeOnboarding,
  } = useOnboarding();

  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleSkip = () => {
    triggerConfetti();
    skipOnboarding();
  };

  const handleNext = () => {
    if (isLastStep) {
      isCompletingRef.current = true;
      triggerConfetti();
      completeOnboarding();
    } else {
      nextStep();
    }
  };

  return (
    <Dialog
      open={shouldShowOnboarding}
      onOpenChange={(open) => {
        // Only call handleSkip if user manually closes (escape/click outside)
        // Don't call if closing via completeOnboarding (Get Started button)
        if (!open && !isCompletingRef.current) {
          handleSkip();
        }
        if (!open) {
          isCompletingRef.current = false;
        }
      }}
    >
      <DialogContent showCloseButton={false} className="sm:max-w-lg p-0 overflow-hidden">
        <DialogTitle className="sr-only">Welcome to Football Shirt Collection</DialogTitle>
        <DialogDescription className="sr-only">
          Follow the onboarding steps to get started with your collection
        </DialogDescription>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            <CurrentStepComponent />
          </motion.div>
        </AnimatePresence>

        <div className="border-t p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            {t("common.skip")}
          </Button>

          <OnboardingProgress totalSteps={steps.length} currentStep={currentStep} />

          <div className="flex gap-2">
            {!isFirstStep && (
              <Button variant="outline" size="sm" onClick={prevStep}>
                {t("common.back")}
              </Button>
            )}
            <Button size="sm" onClick={handleNext}>
              {isLastStep ? t("onboarding.getStarted") : t("common.next")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
