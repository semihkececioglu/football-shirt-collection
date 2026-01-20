import { createContext, useState, useEffect, useContext, useCallback, useMemo } from "react";

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
};

const STORAGE_KEY = "onboarding_completed";

export const OnboardingProvider = ({ children }) => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAddButtonHighlighted, setIsAddButtonHighlighted] = useState(false);
  const [showAddButtonTooltip, setShowAddButtonTooltip] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY) === "true";
    setHasCompletedOnboarding(completed);
  }, []);

  const triggerOnboarding = useCallback(() => {
    setShouldShowOnboarding(true);
    setCurrentStep(0);
  }, []);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setHasCompletedOnboarding(true);
    setShouldShowOnboarding(false);
    // Keep highlight and show tooltip after modal closes
    setIsAddButtonHighlighted(true);
    setShowAddButtonTooltip(true);
  }, []);

  const skipOnboarding = useCallback(() => {
    setShouldShowOnboarding(false);
    setIsAddButtonHighlighted(false);
    setShowAddButtonTooltip(false);
  }, []);

  const restartOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHasCompletedOnboarding(false);
    setShouldShowOnboarding(true);
    setCurrentStep(0);
    setShowAddButtonTooltip(false);
  }, []);

  const dismissAddButtonHighlight = useCallback(() => {
    setIsAddButtonHighlighted(false);
    setShowAddButtonTooltip(false);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const value = useMemo(() => ({
    hasCompletedOnboarding,
    shouldShowOnboarding,
    currentStep,
    isAddButtonHighlighted,
    showAddButtonTooltip,
    setIsAddButtonHighlighted,
    triggerOnboarding,
    completeOnboarding,
    skipOnboarding,
    restartOnboarding,
    dismissAddButtonHighlight,
    nextStep,
    prevStep,
    setCurrentStep,
  }), [
    hasCompletedOnboarding,
    shouldShowOnboarding,
    currentStep,
    isAddButtonHighlighted,
    showAddButtonTooltip,
    triggerOnboarding,
    completeOnboarding,
    skipOnboarding,
    restartOnboarding,
    dismissAddButtonHighlight,
    nextStep,
    prevStep,
  ]);

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
