import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { ArrowRight, Menu, X } from "lucide-react";
import Logo from "@/components/common/Logo";
import { cn } from "@/lib/utils";

const LandingNavbar = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let rafId = null;
    let lastScrolled = window.scrollY > 20;
    setScrolled(lastScrolled);

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const shouldBeScrolled = window.scrollY > 20;
        if (lastScrolled !== shouldBeScrolled) {
          setScrolled(shouldBeScrolled);
          lastScrolled = shouldBeScrolled;
        }
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);

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

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { id: "features", label: t("landing.nav.features") },
    { id: "how-it-works", label: t("landing.nav.howItWorks") },
    { id: "showcase", label: t("landing.nav.showcase") },
    { id: "faq", label: t("landing.nav.faq") },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
      <nav
        className={cn(
          "max-w-4xl mx-auto rounded-2xl transition-all duration-500",
          scrolled
            ? "backdrop-blur-xl bg-white/80 dark:bg-stone-900/80 shadow-xl shadow-stone-900/10 border border-stone-200 dark:border-stone-700"
            : "bg-white/40 dark:bg-stone-900/40 backdrop-blur-sm border border-transparent"
        )}
      >
        <div className="flex items-center justify-between w-full px-4 sm:px-6 py-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0"
          >
            <div className="w-11 h-11 bg-stone-900 dark:bg-stone-50 rounded-xl flex items-center justify-center border border-white/20 dark:border-stone-900/20 shadow-sm shrink-0">
              <Logo className="w-6 h-6 text-stone-50 dark:text-stone-900" />
            </div>
            <span className="font-display text-lg font-normal text-stone-900 dark:text-stone-50 tracking-tight hidden sm:block whitespace-nowrap">
              Football Shirt Collection
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 px-4 py-2 rounded-full hover:bg-stone-100/80 dark:hover:bg-stone-800/80 transition-all duration-200"
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/contact"
              className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 px-4 py-2 rounded-full hover:bg-stone-100/80 dark:hover:bg-stone-800/80 transition-all duration-200"
            >
              {t("landing.nav.contact")}
            </Link>
          </div>

          {/* Right side - CTA and Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* CTA - ShimmerButton (hidden on mobile when menu is open) */}
            <Link to="/register" className={cn(mobileMenuOpen && "hidden sm:block")}>
              <ShimmerButton className="h-10 px-5 text-sm font-medium">
                {t("landing.nav.cta")}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </ShimmerButton>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 dark:border-stone-700 px-4 py-4">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 px-4 py-3 rounded-xl hover:bg-stone-100/80 dark:hover:bg-stone-800/80 transition-all duration-200 text-left"
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 px-4 py-3 rounded-xl hover:bg-stone-100/80 dark:hover:bg-stone-800/80 transition-all duration-200"
              >
                {t("landing.nav.contact")}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2"
              >
                <ShimmerButton className="w-full h-11 text-sm font-medium">
                  {t("landing.nav.cta")}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </ShimmerButton>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default LandingNavbar;
