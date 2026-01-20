import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/authContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { OnboardingProvider } from "./context/OnboardingContext";
import "./i18n";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Suppress Recharts resize warning (known issue, doesn't affect functionality)
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('The width') && args[0].includes('of chart should be greater than 0')) {
    return;
  }
  originalConsoleWarn(...args);
};

// Validate environment variables
if (!import.meta.env.VITE_API_URL) {
  console.error("VITE_API_URL is not defined in environment variables");
  throw new Error("Missing required environment variable: VITE_API_URL");
}

if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.warn("VITE_GOOGLE_CLIENT_ID is not defined. Google Sign-In will not work.");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <ThemeProvider>
                  <CurrencyProvider>
                    <OnboardingProvider>
                      <App />
                    </OnboardingProvider>
                  </CurrencyProvider>
                </ThemeProvider>
              </AuthProvider>
            </QueryClientProvider>
          </BrowserRouter>
        </GoogleOAuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
);
