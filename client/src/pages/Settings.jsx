import React from "react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/common/SEO";
import { useTheme } from "@/context/ThemeContext";
import { useCurrency } from "@/context/CurrencyContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sun, Moon, Monitor, DollarSign, Sparkles, Globe } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/OnboardingContext";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const { hasCompletedOnboarding, restartOnboarding } = useOnboarding();

  return (
    <>
      <SEO
        title="Settings"
        description="Customize your Football Shirt Collection experience. Change theme, currency, and language preferences."
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />

        {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t("settings.title")}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t("settings.subtitle")}
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <CardTitle>{t("settings.appearance")}</CardTitle>
            </div>
            <CardDescription>
              {t("settings.appearanceDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme" className="text-sm font-medium mb-2 block">
                {t("settings.theme")}
              </Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme" className="w-full md:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      <span>{t("settings.light")}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      <span>{t("settings.dark")}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <span>{t("settings.system")}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {t("settings.themeDesc")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Currency Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <CardTitle>{t("settings.currency")}</CardTitle>
            </div>
            <CardDescription>
              {t("settings.currencyDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label
                htmlFor="currency"
                className="text-sm font-medium mb-2 block"
              >
                {t("settings.displayCurrency")}
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency" className="w-full md:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                  <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                  <SelectItem value="TRY">TRY (₺) - Turkish Lira</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {t("settings.currencyNote")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <CardTitle>{t("settings.language")}</CardTitle>
            </div>
            <CardDescription>
              {t("settings.languageDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={i18n.language}
              onValueChange={(lng) => i18n.changeLanguage(lng)}
            >
              <SelectTrigger className="w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="tr">Türkçe</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Onboarding Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <CardTitle>{t("settings.onboarding")}</CardTitle>
            </div>
            <CardDescription>
              {t("settings.onboardingDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={restartOnboarding}>
              {t("settings.restartOnboarding")}
            </Button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {hasCompletedOnboarding
                ? t("settings.onboardingCompleted")
                : t("settings.onboardingNotCompleted")}
            </p>
          </CardContent>
        </Card>
      </main>
      </div>
    </>
  );
};

export default Settings;
