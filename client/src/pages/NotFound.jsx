import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/common/SEO";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        noindex={true}
      />
      <div className="min-h-screen bg-cream dark:bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* 404 Number */}
          <h1 className="text-9xl font-display font-light text-stone-200 dark:text-slate-700 select-none">
            404
          </h1>

          {/* Title */}
          <h2 className="text-2xl font-display font-medium text-stone-800 dark:text-stone-100 -mt-4 mb-4">
            {t("notFound.title", "Page Not Found")}
          </h2>

          {/* Description */}
          <p className="text-stone-600 dark:text-stone-400 mb-8 leading-relaxed">
            {t(
              "notFound.description",
              "The page you're looking for doesn't exist or has been moved. Let's get you back on track."
            )}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              variant="default"
              className="gap-2"
            >
              <Link to="/">
                <Home className="w-4 h-4" />
                {t("notFound.homeButton", "Go Home")}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="gap-2"
              onClick={() => window.history.back()}
            >
              <button type="button" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4" />
                {t("notFound.backButton", "Go Back")}
              </button>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
