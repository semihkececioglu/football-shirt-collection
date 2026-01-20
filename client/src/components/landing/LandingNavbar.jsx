import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { ShirtIcon, ArrowRight } from "lucide-react";

const LandingNavbar = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    // If not on landing page, navigate first then scroll
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      return;
    }

    // Update URL hash for SEO and bookmarking
    window.history.pushState(null, "", `#${sectionId}`);

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle hash on page load and navigation
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
      <nav
        className={`max-w-3xl mx-auto rounded-full transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-white/80 dark:bg-stone-900/80 shadow-xl shadow-stone-900/10 border border-stone-200 dark:border-stone-700"
            : "bg-white/40 dark:bg-stone-900/40 backdrop-blur-sm border border-transparent"
        }`}
      >
        <div className="flex items-center justify-between w-full px-5 py-2.5">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group transition-all duration-300"
          >
            <div className="w-9 h-9 bg-stone-900 dark:bg-stone-50 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <ShirtIcon className="w-4 h-4 text-stone-50 dark:text-stone-900" />
            </div>
            <span className="text-sm font-semibold text-stone-900 dark:text-stone-50 tracking-tight hidden sm:block">
              Football Shirt Collection
            </span>
          </Link>

          {/* Section Navigation */}
          <div className="flex items-center gap-0.5 hidden md:flex">
            <button
              onClick={() => scrollToSection("features")}
              className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 px-3 py-1.5 rounded-full hover:bg-stone-100/80 dark:hover:bg-stone-800/80 transition-all duration-200"
            >
              {t("landing.nav.features")}
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 px-3 py-1.5 rounded-full hover:bg-stone-100/80 dark:hover:bg-stone-800/80 transition-all duration-200"
            >
              {t("landing.nav.howItWorks")}
            </button>
            <button
              onClick={() => scrollToSection("showcase")}
              className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 px-3 py-1.5 rounded-full hover:bg-stone-100/80 dark:hover:bg-stone-800/80 transition-all duration-200"
            >
              {t("landing.nav.showcase")}
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 px-3 py-1.5 rounded-full hover:bg-stone-100/80 dark:hover:bg-stone-800/80 transition-all duration-200"
            >
              {t("landing.nav.faq")}
            </button>
            <Link
              to="/contact"
              className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 px-3 py-1.5 rounded-full hover:bg-stone-100/80 dark:hover:bg-stone-800/80 transition-all duration-200"
            >
              {t("landing.nav.contact")}
            </Link>
          </div>

          {/* CTA - ShimmerButton */}
          <Link to="/register">
            <ShimmerButton className="h-9 px-4 text-xs font-medium">
              {t("landing.nav.cta")}
              <ArrowRight className="w-3 h-3 ml-1" />
            </ShimmerButton>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default LandingNavbar;
