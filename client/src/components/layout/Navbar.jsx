import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  ShirtIcon,
  Heart,
  BarChart3,
  User,
  LogOut,
  Moon,
  Sun,
  Search,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuHighlight,
  DropdownMenuHighlightItem,
} from "@/components/animate-ui/primitives/radix/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { CommandPalette } from "./CommandPalette";
import {
  Highlight,
  HighlightItem,
} from "@/components/animate-ui/primitives/effects/highlight";

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { effectiveTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [commandOpen, setCommandOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  // Animated theme toggle with radial transition
  const handleThemeToggle = async (event) => {
    // Check if browser supports View Transitions API
    if (!document.startViewTransition) {
      toggleTheme();
      return;
    }

    // Get click position for radial animation origin
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Start view transition
    const transition = document.startViewTransition(() => {
      toggleTheme();
    });

    // Wait for transition to be ready, then animate
    await transition.ready;

    // Animate with clip-path circle from click position
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: t("nav.dashboard") },
    { path: "/collection", icon: ShirtIcon, label: t("nav.collection") },
    { path: "/wishlist", icon: Heart, label: t("nav.wishlist") },
    { path: "/statistics", icon: BarChart3, label: t("nav.statistics") },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <ShirtIcon className="w-8 h-8 text-slate-900 dark:text-slate-100" />
              <div className="flex flex-col">
                <span className="font-bold text-xl text-slate-900 dark:text-slate-100 leading-tight">
                  Football Shirts
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                  {t("onboarding.welcomeSubtitle")}
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <Highlight
              hover
              className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-lg"
              controlledItems
              mode="parent"
            >
              <div className="hidden md:flex items-center gap-1 relative">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <HighlightItem key={item.path} value={item.path} asChild>
                      <Link to={item.path} className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "gap-2 px-4 py-5 text-sm font-medium transition-colors relative z-10 w-full cursor-pointer",
                            active
                              ? "text-slate-900 dark:text-slate-100"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Button>
                        {active && (
                          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 dark:bg-slate-100 rounded-full" />
                        )}
                      </Link>
                    </HighlightItem>
                  );
                })}
              </div>
            </Highlight>

            {/* Right side - Search, Theme toggle, and User menu */}
            <div className="flex items-center gap-2">
              {/* Command Palette Search Trigger - Desktop with border */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCommandOpen(true)}
                className="hidden md:flex items-center gap-2 h-9 px-3 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label={t("nav.commandPalette")}
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">{t("common.search")}</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-600 dark:text-slate-400 opacity-100">
                  ⌘<span>K</span>
                </kbd>
              </Button>

              {/* Command Palette Search Trigger - Mobile icon only, no border */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCommandOpen(true)}
                className="md:hidden rounded-full"
                aria-label={t("nav.commandPalette")}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
                className="rounded-full"
                aria-label={`Switch to ${
                  effectiveTheme === "dark" ? "light" : "dark"
                } mode`}
              >
                {effectiveTheme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center justify-center h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:ring-offset-2 overflow-hidden"
                    aria-label="Open user menu"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-[100]"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1 py-2 px-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuHighlight className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <DropdownMenuHighlightItem value="profile">
                      <DropdownMenuItem
                        onClick={() => navigate("/profile")}
                        className="relative flex items-center gap-2 w-full px-2.5 py-2.5 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                      >
                        <User className="w-4 h-4" />
                        <span>{t("nav.profile")}</span>
                      </DropdownMenuItem>
                    </DropdownMenuHighlightItem>

                    <DropdownMenuHighlightItem value="settings">
                      <DropdownMenuItem
                        onClick={() => navigate("/settings")}
                        className="relative flex items-center gap-2 w-full px-2.5 py-2.5 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                      >
                        <Settings className="w-4 h-4" />
                        <span>{t("nav.settings")}</span>
                      </DropdownMenuItem>
                    </DropdownMenuHighlightItem>

                    <DropdownMenuHighlightItem value="command">
                      <DropdownMenuItem
                        onClick={() => setCommandOpen(true)}
                        className="relative flex items-center gap-2 w-full px-2.5 py-2.5 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                      >
                        <Search className="w-4 h-4" />
                        <div className="flex items-center justify-between flex-1">
                          <span>{t("nav.commandPalette")}</span>
                          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-600 dark:text-slate-400">
                            ⌘ K
                          </kbd>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuHighlightItem>
                  </DropdownMenuHighlight>

                  <DropdownMenuSeparator />

                  <DropdownMenuHighlight className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <DropdownMenuHighlightItem value="help">
                      <DropdownMenuItem
                        onClick={() => navigate("/help")}
                        className="relative flex items-center gap-2 w-full px-2.5 py-2.5 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>{t("nav.help")}</span>
                      </DropdownMenuItem>
                    </DropdownMenuHighlightItem>
                  </DropdownMenuHighlight>

                  <DropdownMenuSeparator />

                  <DropdownMenuHighlight className="inset-0 bg-red-100 dark:bg-red-900/30 rounded-md">
                    <DropdownMenuHighlightItem value="logout">
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="relative flex items-center gap-2 w-full px-2.5 py-2.5 text-sm cursor-pointer rounded-md outline-none text-red-600 dark:text-red-400 select-none"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t("nav.logout")}</span>
                      </DropdownMenuItem>
                    </DropdownMenuHighlightItem>
                  </DropdownMenuHighlight>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Fixed Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg pb-safe">
        <div className="flex justify-around items-center px-2 py-2 safe-area-inset-bottom">
          <Link to="/dashboard" className="flex-1 min-w-0">
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full px-3 py-2 rounded-lg transition-all",
                isActive("/dashboard")
                  ? "text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800"
                  : "text-slate-600 dark:text-slate-400 active:bg-slate-50 dark:active:bg-slate-800/50"
              )}
              aria-label={t("nav.dashboard")}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs font-medium truncate w-full text-center">
                {t("nav.dashboard")}
              </span>
            </button>
          </Link>

          <Link to="/collection" className="flex-1 min-w-0">
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full px-3 py-2 rounded-lg transition-all",
                isActive("/collection")
                  ? "text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800"
                  : "text-slate-600 dark:text-slate-400 active:bg-slate-50 dark:active:bg-slate-800/50"
              )}
              aria-label={t("nav.collection")}
            >
              <ShirtIcon className="w-5 h-5" />
              <span className="text-xs font-medium truncate w-full text-center">
                {t("nav.collection")}
              </span>
            </button>
          </Link>

          <Link to="/wishlist" className="flex-1 min-w-0">
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full px-3 py-2 rounded-lg transition-all",
                isActive("/wishlist")
                  ? "text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800"
                  : "text-slate-600 dark:text-slate-400 active:bg-slate-50 dark:active:bg-slate-800/50"
              )}
              aria-label={t("nav.wishlist")}
            >
              <Heart className="w-5 h-5" />
              <span className="text-xs font-medium truncate w-full text-center">
                {t("nav.wishlist")}
              </span>
            </button>
          </Link>

          <Link to="/statistics" className="flex-1 min-w-0">
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full px-3 py-2 rounded-lg transition-all",
                isActive("/statistics")
                  ? "text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800"
                  : "text-slate-600 dark:text-slate-400 active:bg-slate-50 dark:active:bg-slate-800/50"
              )}
              aria-label={t("nav.statistics")}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs font-medium truncate w-full text-center">
                {t("nav.statistics")}
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette open={commandOpen} setOpen={setCommandOpen} />
    </>
  );
};

export default Navbar;
