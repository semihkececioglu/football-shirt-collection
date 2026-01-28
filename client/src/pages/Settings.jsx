import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/common/SEO";
import { useTheme } from "@/context/ThemeContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Monitor, DollarSign, Sparkles, Globe, Palette, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/OnboardingContext";
import { cn } from "@/lib/utils";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const { hasCompletedOnboarding, restartOnboarding } = useOnboarding();
  const [activeSection, setActiveSection] = useState("appearance");

  const navItems = [
    { id: "appearance", icon: Palette, label: t("settings.appearance") },
    { id: "currency", icon: DollarSign, label: t("settings.currency") },
    { id: "language", icon: Globe, label: t("settings.language") },
    { id: "onboarding", icon: Sparkles, label: t("settings.onboarding") },
  ];

  const themeOptions = [
    { value: "light", icon: Sun, label: t("settings.light") },
    { value: "dark", icon: Moon, label: t("settings.dark") },
    { value: "system", icon: Monitor, label: t("settings.system") },
  ];

  const currencyOptions = [
    { value: "USD", symbol: "$", label: "US Dollar" },
    { value: "EUR", symbol: "€", label: "Euro" },
    { value: "GBP", symbol: "£", label: "British Pound" },
    { value: "TRY", symbol: "₺", label: "Turkish Lira" },
  ];

  const languageOptions = [
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "tr", label: "Türkçe", flag: "🇹🇷" },
    { value: "fr", label: "Français", flag: "🇫🇷" },
    { value: "de", label: "Deutsch", flag: "🇩🇪" },
    { value: "es", label: "Español", flag: "🇪🇸" },
    { value: "it", label: "Italiano", flag: "🇮🇹" },
  ];

  return (
    <>
      <SEO
        title="Settings"
        description="Customize your Football Shirt Collection experience. Change theme, currency, and language preferences."
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t("settings.title")}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {t("settings.subtitle")}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Navigation */}
            <nav className="w-full md:w-56 shrink-0">
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                      activeSection === item.id
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Content Area */}
            <main className="flex-1 min-w-0">
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                {/* Appearance Section */}
                {activeSection === "appearance" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        {t("settings.appearance")}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {t("settings.appearanceDesc")}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        {t("settings.theme")}
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {themeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            className={cn(
                              "relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                              theme === option.value
                                ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            )}
                          >
                            {theme === option.value && (
                              <div className="absolute top-2 right-2">
                                <Check className="h-4 w-4 text-slate-900 dark:text-white" />
                              </div>
                            )}
                            <option.icon className={cn(
                              "h-6 w-6",
                              theme === option.value
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-500 dark:text-slate-400"
                            )} />
                            <span className={cn(
                              "text-sm font-medium",
                              theme === option.value
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-600 dark:text-slate-400"
                            )}>
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                        {t("settings.themeDesc")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Currency Section */}
                {activeSection === "currency" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        {t("settings.currency")}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {t("settings.currencyDesc")}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        {t("settings.displayCurrency")}
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {currencyOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setCurrency(option.value)}
                            className={cn(
                              "relative flex flex-col items-center gap-1 p-4 rounded-lg border-2 transition-all",
                              currency === option.value
                                ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            )}
                          >
                            {currency === option.value && (
                              <div className="absolute top-2 right-2">
                                <Check className="h-4 w-4 text-slate-900 dark:text-white" />
                              </div>
                            )}
                            <span className={cn(
                              "text-2xl font-bold",
                              currency === option.value
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-500 dark:text-slate-400"
                            )}>
                              {option.symbol}
                            </span>
                            <span className={cn(
                              "text-xs font-medium",
                              currency === option.value
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-600 dark:text-slate-400"
                            )}>
                              {option.value}
                            </span>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                        {t("settings.currencyNote")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Language Section */}
                {activeSection === "language" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        {t("settings.language")}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {t("settings.languageDesc")}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        {t("settings.selectLanguage")}
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {languageOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => i18n.changeLanguage(option.value)}
                            className={cn(
                              "relative flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
                              i18n.language === option.value
                                ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            )}
                          >
                            {i18n.language === option.value && (
                              <div className="absolute top-2 right-2">
                                <Check className="h-4 w-4 text-slate-900 dark:text-white" />
                              </div>
                            )}
                            <span className="text-xl">{option.flag}</span>
                            <span className={cn(
                              "text-sm font-medium",
                              i18n.language === option.value
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-600 dark:text-slate-400"
                            )}>
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Onboarding Section */}
                {activeSection === "onboarding" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        {t("settings.onboarding")}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {t("settings.onboardingDesc")}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          hasCompletedOnboarding ? "bg-green-500" : "bg-yellow-500"
                        )} />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {hasCompletedOnboarding
                            ? t("settings.onboardingCompleted")
                            : t("settings.onboardingNotCompleted")}
                        </span>
                      </div>
                      <Button variant="outline" onClick={restartOnboarding}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        {t("settings.restartOnboarding")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
