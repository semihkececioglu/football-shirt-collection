import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
};

const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  TRY: "₺",
};

const AVAILABLE_CURRENCIES = Object.keys(CURRENCY_SYMBOLS);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState("USD");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved && CURRENCY_SYMBOLS[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  // Save to localStorage when changed
  const setCurrency = useCallback((newCurrency) => {
    if (CURRENCY_SYMBOLS[newCurrency]) {
      setCurrencyState(newCurrency);
      localStorage.setItem("currency", newCurrency);
    }
  }, []);

  // Format number with current currency symbol
  const formatCurrency = useCallback((amount) => {
    const symbol = CURRENCY_SYMBOLS[currency];
    // Simple formatting - no conversion
    return `${symbol}${Number(amount).toLocaleString()}`;
  }, [currency]);

  // Get current symbol
  const getSymbol = useCallback(() => CURRENCY_SYMBOLS[currency], [currency]);

  const value = useMemo(() => ({
    currency,
    setCurrency,
    formatCurrency,
    getSymbol,
    availableCurrencies: AVAILABLE_CURRENCIES,
  }), [currency, setCurrency, formatCurrency, getSymbol]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
