import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useShirts } from "@/hooks/useShirts";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Highlight, HighlightItem } from "@/components/animate-ui/primitives/effects/highlight";
import {
  LayoutDashboard,
  ShirtIcon,
  Heart,
  BarChart3,
  User,
  Settings,
  Search,
  Sun,
  Moon,
  Monitor,
  DollarSign,
  Globe,
  Check,
  Loader2,
  X,
} from "lucide-react";

const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  TRY: "₺",
};

// Recent searches stored in localStorage
const RECENT_SEARCHES_KEY = "commandPalette_recentSearches";
const MAX_RECENT_SEARCHES = 5;

const getRecentSearches = () => {
  try {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const addRecentSearch = (query) => {
  if (!query || query.length < 2) return;
  try {
    const recent = getRecentSearches();
    const filtered = recent.filter((s) => s !== query);
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // ignore localStorage errors
  }
};

export const CommandPalette = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [recentSearches, setRecentSearches] = useState([]);

  // Only search when there's at least 2 characters
  const shouldSearch = debouncedSearch.length >= 2;

  const { data: shirtsData, isLoading: isSearching } = useShirts(
    shouldSearch ? { search: debouncedSearch, limit: 5 } : { limit: 0 }
  );

  const shirts = shouldSearch ? (shirtsData?.data || []) : [];

  // Load recent searches when palette opens
  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
      setSearch("");
    }
  }, [open]);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const handleSelect = (callback) => {
    setOpen(false);
    callback();
  };

  const handleShirtSelect = (shirtId) => {
    if (debouncedSearch) {
      addRecentSearch(debouncedSearch);
    }
    setOpen(false);
    navigate(`/collection/${shirtId}`);
  };

  const handleSearchInCollection = () => {
    if (debouncedSearch) {
      addRecentSearch(debouncedSearch);
      setOpen(false);
      navigate(`/collection?search=${encodeURIComponent(debouncedSearch)}`);
    }
  };

  const handleRecentSearch = (query) => {
    setOpen(false);
    navigate(`/collection?search=${encodeURIComponent(query)}`);
  };

  const clearRecentSearch = (queryToRemove) => {
    const updated = recentSearches.filter((q) => q !== queryToRemove);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder={t("nav.searchPlaceholder") || "Search shirts..."}
        value={search}
        onValueChange={setSearch}
        onClose={() => setOpen(false)}
      />
      <CommandList>
        <CommandEmpty>
          {isSearching ? (
            <div className="flex items-center justify-center gap-2 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t("common.loading")}</span>
            </div>
          ) : (
            t("common.noResults")
          )}
        </CommandEmpty>

        {/* Dynamic Shirt Search Results */}
        {shirts.length > 0 && (
          <>
            <CommandGroup heading={t("collection.shirts")}>
              <Highlight
                hover
                className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md"
                controlledItems
                mode="parent"
              >
                {shirts.map((shirt) => (
                  <HighlightItem key={shirt._id} value={`shirt-${shirt._id}`} asChild>
                    <CommandItem
                      value={`shirt-${shirt._id}-${shirt.teamName}`}
                      onSelect={() => handleShirtSelect(shirt._id)}
                      className="relative"
                    >
                      {shirt.images?.[0]?.thumbnail ? (
                        <img
                          src={shirt.images[0].thumbnail}
                          alt={shirt.teamName}
                          className="w-8 h-8 rounded object-cover mr-2"
                        />
                      ) : (
                        <ShirtIcon className="w-8 h-8 mr-2 text-slate-400" />
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">{shirt.teamName}</span>
                        <span className="text-xs text-slate-500">
                          {shirt.season} {shirt.type && `• ${shirt.type}`} {shirt.playerName && `• ${shirt.playerName}`}
                        </span>
                      </div>
                    </CommandItem>
                  </HighlightItem>
                ))}
                {shirtsData?.pagination?.totalShirts > 5 && (
                  <HighlightItem value="view-all" asChild>
                    <CommandItem
                      value="view-all-search-results"
                      onSelect={handleSearchInCollection}
                      className="relative"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      <span>
                        {t("common.viewAll")} ({shirtsData.pagination.totalShirts} {t("collection.shirts")})
                      </span>
                    </CommandItem>
                  </HighlightItem>
                )}
              </Highlight>
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Recent Searches - only show when not actively searching */}
        {!shouldSearch && recentSearches.length > 0 && (
          <>
            <CommandGroup heading={t("nav.recentSearches") || "Recent Searches"}>
              <Highlight
                hover
                className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md"
                controlledItems
                mode="parent"
              >
                {recentSearches.map((query) => (
                  <HighlightItem key={query} value={`recent-${query}`} asChild>
                    <CommandItem
                      value={`recent-${query}`}
                      onSelect={() => handleRecentSearch(query)}
                      className="relative group"
                    >
                      <Search className="mr-2 h-4 w-4 text-slate-400" />
                      <span className="flex-1">{query}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearRecentSearch(query);
                        }}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        type="button"
                      >
                        <X className="h-3 w-3 text-slate-400" />
                      </button>
                    </CommandItem>
                  </HighlightItem>
                ))}
              </Highlight>
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Navigation">
          <Highlight
            hover
            className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md"
            controlledItems
            mode="parent"
          >
            <HighlightItem value="dashboard" asChild>
              <CommandItem
                value="dashboard"
                onSelect={() => handleSelect(() => navigate("/dashboard"))}
                className="relative"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </CommandItem>
            </HighlightItem>
            <HighlightItem value="collection" asChild>
              <CommandItem
                value="collection"
                onSelect={() => handleSelect(() => navigate("/collection"))}
                className="relative"
              >
                <ShirtIcon className="mr-2 h-4 w-4" />
                <span>Collection</span>
              </CommandItem>
            </HighlightItem>
            <HighlightItem value="wishlist" asChild>
              <CommandItem
                value="wishlist"
                onSelect={() => handleSelect(() => navigate("/wishlist"))}
                className="relative"
              >
                <Heart className="mr-2 h-4 w-4" />
                <span>Wishlist</span>
              </CommandItem>
            </HighlightItem>
            <HighlightItem value="statistics" asChild>
              <CommandItem
                value="statistics"
                onSelect={() => handleSelect(() => navigate("/statistics"))}
                className="relative"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Statistics</span>
              </CommandItem>
            </HighlightItem>
          </Highlight>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <Highlight
            hover
            className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md"
            controlledItems
            mode="parent"
          >
            <HighlightItem value="search-shirts" asChild>
              <CommandItem
                value="search-shirts"
                onSelect={() => handleSelect(() => navigate("/collection?focusSearch=true"))}
                className="relative"
              >
                <Search className="mr-2 h-4 w-4" />
                <span>Search Shirts</span>
              </CommandItem>
            </HighlightItem>
          </Highlight>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <Highlight
            hover
            className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md"
            controlledItems
            mode="parent"
          >
            <HighlightItem value="theme-light" asChild>
              <CommandItem value="theme-light" onSelect={() => handleSelect(() => setTheme("light"))} className="relative">
                <Sun className="mr-2 h-4 w-4" />
                <span>Light Mode</span>
                {theme === "light" && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
            </HighlightItem>
            <HighlightItem value="theme-dark" asChild>
              <CommandItem value="theme-dark" onSelect={() => handleSelect(() => setTheme("dark"))} className="relative">
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark Mode</span>
                {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
            </HighlightItem>
            <HighlightItem value="theme-system" asChild>
              <CommandItem value="theme-system" onSelect={() => handleSelect(() => setTheme("system"))} className="relative">
                <Monitor className="mr-2 h-4 w-4" />
                <span>System</span>
                {theme === "system" && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
            </HighlightItem>
          </Highlight>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Currency">
          <Highlight
            hover
            className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md"
            controlledItems
            mode="parent"
          >
            {["USD", "EUR", "GBP", "TRY"].map((curr) => (
              <HighlightItem key={curr} value={`currency-${curr}`} asChild>
                <CommandItem value={`currency-${curr.toLowerCase()}`} onSelect={() => handleSelect(() => setCurrency(curr))} className="relative">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>{curr} ({CURRENCY_SYMBOLS[curr]})</span>
                  {currency === curr && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              </HighlightItem>
            ))}
          </Highlight>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Language">
          <Highlight
            hover
            className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md"
            controlledItems
            mode="parent"
          >
            <HighlightItem value="language-english" asChild>
              <CommandItem value="language-english" onSelect={() => handleSelect(() => i18n.changeLanguage("en"))} className="relative">
                <Globe className="mr-2 h-4 w-4" />
                <span>English</span>
                {i18n.language === "en" && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
            </HighlightItem>
            <HighlightItem value="language-turkish" asChild>
              <CommandItem value="language-turkish" onSelect={() => handleSelect(() => i18n.changeLanguage("tr"))} className="relative">
                <Globe className="mr-2 h-4 w-4" />
                <span>Türkçe</span>
                {i18n.language === "tr" && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
            </HighlightItem>
            <HighlightItem value="language-french" asChild>
              <CommandItem value="language-french" onSelect={() => handleSelect(() => i18n.changeLanguage("fr"))} className="relative">
                <Globe className="mr-2 h-4 w-4" />
                <span>Français</span>
                {i18n.language === "fr" && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
            </HighlightItem>
            <HighlightItem value="language-german" asChild>
              <CommandItem value="language-german" onSelect={() => handleSelect(() => i18n.changeLanguage("de"))} className="relative">
                <Globe className="mr-2 h-4 w-4" />
                <span>Deutsch</span>
                {i18n.language === "de" && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
            </HighlightItem>
            <HighlightItem value="language-spanish" asChild>
              <CommandItem value="language-spanish" onSelect={() => handleSelect(() => i18n.changeLanguage("es"))} className="relative">
                <Globe className="mr-2 h-4 w-4" />
                <span>Español</span>
                {i18n.language === "es" && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
            </HighlightItem>
            <HighlightItem value="language-italian" asChild>
              <CommandItem value="language-italian" onSelect={() => handleSelect(() => i18n.changeLanguage("it"))} className="relative">
                <Globe className="mr-2 h-4 w-4" />
                <span>Italiano</span>
                {i18n.language === "it" && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
            </HighlightItem>
          </Highlight>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Account">
          <Highlight
            hover
            className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md"
            controlledItems
            mode="parent"
          >
            <HighlightItem value="profile" asChild>
              <CommandItem
                value="profile"
                onSelect={() => handleSelect(() => navigate("/profile"))}
                className="relative"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </CommandItem>
            </HighlightItem>
            <HighlightItem value="settings" asChild>
              <CommandItem
                value="settings"
                onSelect={() => handleSelect(() => navigate("/settings"))}
                className="relative"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </CommandItem>
            </HighlightItem>
          </Highlight>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
