import { createContext, useState, useEffect, useContext, useMemo, useCallback } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState("light"); // "light" | "dark" | "system"
  const [effectiveTheme, setEffectiveTheme] = useState("light"); // "light" | "dark"

  // Compute effective theme based on preference
  const getEffectiveTheme = useCallback((themePreference) => {
    if (themePreference === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return themePreference;
  }, []);

  // Apply theme to document
  const applyTheme = useCallback((appliedTheme) => {
    if (appliedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme || "system";
    setThemeState(initialTheme);

    const effective = getEffectiveTheme(initialTheme);
    setEffectiveTheme(effective);
    applyTheme(effective);
  }, [getEffectiveTheme, applyTheme]);

  // Listen for system theme changes when theme is set to "system"
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = (e) => {
        const newEffective = e.matches ? "dark" : "light";
        setEffectiveTheme(newEffective);
        applyTheme(newEffective);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, applyTheme]);

  // Set theme (used by Settings page)
  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);

    const effective = getEffectiveTheme(newTheme);
    setEffectiveTheme(effective);
    applyTheme(effective);
  }, [getEffectiveTheme, applyTheme]);

  // Toggle theme (used by Navbar theme button)
  const toggleTheme = useCallback(() => {
    setEffectiveTheme(current => {
      const newTheme = current === "light" ? "dark" : "light";
      setThemeState(newTheme);
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
      return newTheme;
    });
  }, [applyTheme]);

  const value = useMemo(() => ({
    theme, // Current theme preference: "light" | "dark" | "system"
    effectiveTheme, // Actual applied theme: "light" | "dark"
    setTheme, // Set theme preference
    toggleTheme, // Toggle between light and dark
    isDark: effectiveTheme === "dark",
  }), [theme, effectiveTheme, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
