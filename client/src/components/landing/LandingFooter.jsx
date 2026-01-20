import { useTranslation } from "react-i18next";
import { Heart, ShirtIcon } from "lucide-react";

const LandingFooter = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FDFBF7] dark:bg-stone-900 border-t border-stone-200/50 dark:border-stone-800/50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-stone-900 dark:bg-stone-50 rounded-lg flex items-center justify-center">
              <ShirtIcon className="w-4 h-4 text-stone-50 dark:text-stone-900" />
            </div>
            <span className="text-sm text-stone-500">
              © {currentYear} Football Shirt Collection
            </span>
          </div>

          {/* Made with love */}
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <span>{t("landing.footer.madeWith")}</span>
            <Heart className="w-4 h-4 text-stone-400 fill-stone-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
