import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useOnboarding } from "@/context/OnboardingContext";
import { Plus, ArrowUp } from "lucide-react";

export default function AddButtonStep() {
  const { t } = useTranslation();
  const { setIsAddButtonHighlighted } = useOnboarding();

  useEffect(() => {
    setIsAddButtonHighlighted(true);
    return () => setIsAddButtonHighlighted(false);
  }, [setIsAddButtonHighlighted]);

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
          <Plus className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {t("onboarding.addFirstShirt")}
        </h2>
        <p className="text-muted-foreground mt-2">
          {t("onboarding.addFirstShirtDesc")}
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <ArrowUp className="w-4 h-4" />
        <span>{t("onboarding.lookForButton")}</span>
      </div>
    </div>
  );
}
