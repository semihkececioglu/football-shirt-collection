import { useTranslation } from "react-i18next";
import { Shirt, BarChart3, Heart, FolderOpen } from "lucide-react";

export default function WelcomeStep() {
  const { t } = useTranslation();

  const features = [
    {
      icon: FolderOpen,
      title: t("onboarding.organize"),
      description: t("onboarding.organizeDesc"),
    },
    {
      icon: BarChart3,
      title: t("onboarding.analyze"),
      description: t("onboarding.analyzeDesc"),
    },
    {
      icon: Heart,
      title: t("onboarding.wishlistFeature"),
      description: t("onboarding.wishlistDesc"),
    },
  ];

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Shirt className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t("onboarding.welcome")}
        </h2>
        <p className="text-muted-foreground mt-2">
          {t("onboarding.welcomeSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="font-medium text-sm text-slate-900 dark:text-white">
                {title}
              </p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
