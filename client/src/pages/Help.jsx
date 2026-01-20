import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/common/SEO";
import {
  BookOpen,
  Shirt,
  Heart,
  BarChart3,
  User,
  Keyboard,
  HelpCircle,
  Mail,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Star,
  Search,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Help = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("getting-started");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sectionRefs = useRef({});

  const sections = [
    { id: "getting-started", icon: BookOpen, label: t("help.gettingStarted") },
    { id: "collection", icon: Shirt, label: t("help.managingCollection") },
    { id: "wishlist", icon: Heart, label: t("help.wishlist") },
    { id: "statistics", icon: BarChart3, label: t("help.statistics") },
    { id: "profile", icon: User, label: t("help.profileSettings") },
    { id: "shortcuts", icon: Keyboard, label: t("help.keyboardShortcuts") },
    { id: "faq", icon: HelpCircle, label: t("help.faq") },
    { id: "contact", icon: Mail, label: t("help.contact") },
  ];

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 100;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  const SidebarContent = () => (
    <nav className="space-y-1">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;

        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-left",
              isActive
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{section.label}</span>
            {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      <SEO
        title="Help"
        description="Learn how to use Football Shirt Collection. Find guides, FAQs, and keyboard shortcuts."
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />

        {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t("help.title")}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {t("help.subtitle")}
              </p>
            </div>

            {/* Mobile menu trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>{t("help.navigation")}</SheetTitle>
                  <SheetDescription className="sr-only">
                    Navigate to different help sections
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <SidebarContent />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Getting Started */}
            <section
              id="getting-started"
              ref={(el) => (sectionRefs.current["getting-started"] = el)}
              className="scroll-mt-28"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {t("help.gettingStarted")}
                  </h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-400">
                    {t("help.gettingStartedDesc")}
                  </p>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-6 mb-3">
                    {t("help.welcome")}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {t("help.welcomeDesc")}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mt-4">
                    <li>{t("help.feature1")}</li>
                    <li>{t("help.feature2")}</li>
                    <li>{t("help.feature3")}</li>
                    <li>{t("help.feature4")}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Managing Collection */}
            <section
              id="collection"
              ref={(el) => (sectionRefs.current["collection"] = el)}
              className="scroll-mt-28"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Shirt className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {t("help.managingCollection")}
                  </h2>
                </div>
                <div className="space-y-6">
                  {/* Adding Shirts */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Plus className="w-4 h-4 text-slate-500" />
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                        {t("help.addingShirts")}
                      </h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      {t("help.addingShirtsDesc")}
                    </p>
                  </div>

                  {/* Editing Shirts */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Pencil className="w-4 h-4 text-slate-500" />
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                        {t("help.editingShirts")}
                      </h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      {t("help.editingShirtsDesc")}
                    </p>
                  </div>

                  {/* Deleting Shirts */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Trash2 className="w-4 h-4 text-slate-500" />
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                        {t("help.deletingShirts")}
                      </h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      {t("help.deletingShirtsDesc")}
                    </p>
                  </div>

                  {/* Favorites */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-slate-500" />
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                        {t("help.favorites")}
                      </h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      {t("help.favoritesDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Wishlist */}
            <section
              id="wishlist"
              ref={(el) => (sectionRefs.current["wishlist"] = el)}
              className="scroll-mt-28"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                    <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {t("help.wishlist")}
                  </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {t("help.wishlistDesc")}
                </p>
              </div>
            </section>

            {/* Statistics */}
            <section
              id="statistics"
              ref={(el) => (sectionRefs.current["statistics"] = el)}
              className="scroll-mt-28"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {t("help.statistics")}
                  </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {t("help.statisticsDesc")}
                </p>
              </div>
            </section>

            {/* Profile & Settings */}
            <section
              id="profile"
              ref={(el) => (sectionRefs.current["profile"] = el)}
              className="scroll-mt-28"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {t("help.profileSettings")}
                  </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {t("help.profileSettingsDesc")}
                </p>
              </div>
            </section>

            {/* Keyboard Shortcuts */}
            <section
              id="shortcuts"
              ref={(el) => (sectionRefs.current["shortcuts"] = el)}
              className="scroll-mt-28"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                    <Keyboard className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {t("help.keyboardShortcuts")}
                  </h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">{t("help.shortcutSearch")}</span>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600">
                        Ctrl
                      </kbd>
                      <span className="text-slate-400">+</span>
                      <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600">
                        K
                      </kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">{t("help.shortcutNewShirt")}</span>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600">
                        Ctrl
                      </kbd>
                      <span className="text-slate-400">+</span>
                      <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600">
                        N
                      </kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">{t("help.shortcutFocusSearch")}</span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600">
                      /
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-600 dark:text-slate-400">{t("help.shortcutClearFilters")}</span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600">
                      Esc
                    </kbd>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section
              id="faq"
              ref={(el) => (sectionRefs.current["faq"] = el)}
              className="scroll-mt-28"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <HelpCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {t("help.faq")}
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                      {t("help.faq1Question")}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {t("help.faq1Answer")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                      {t("help.faq2Question")}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {t("help.faq2Answer")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                      {t("help.faq3Question")}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {t("help.faq3Answer")}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section
              id="contact"
              ref={(el) => (sectionRefs.current["contact"] = el)}
              className="scroll-mt-28"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {t("help.contact")}
                  </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {t("help.contactDesc")}
                </p>
                <a
                  href="mailto:support@footballshirts.app"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  support@footballshirts.app
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
      </div>
    </>
  );
};

export default Help;
