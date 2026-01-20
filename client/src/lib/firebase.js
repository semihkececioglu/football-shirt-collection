import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app = null;
let analytics = null;

// Initialize Firebase only if config is provided
const initFirebase = async () => {
  if (app) return { app, analytics };

  // Check if Firebase config is provided
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    return { app: null, analytics: null };
  }

  try {
    app = initializeApp(firebaseConfig);

    // Check if analytics is supported (not in SSR, not blocked by browser)
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }

  return { app, analytics };
};

// Initialize on load
initFirebase();

/**
 * Track a custom event
 * @param {string} eventName - Name of the event
 * @param {object} params - Event parameters
 */
export const trackEvent = (eventName, params = {}) => {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
};

/**
 * Track page view
 * @param {string} pageName - Name of the page
 * @param {string} pageLocation - URL of the page
 */
export const trackPageView = (pageName, pageLocation) => {
  trackEvent("page_view", {
    page_title: pageName,
    page_location: pageLocation,
  });
};

/**
 * Track user sign up
 * @param {string} method - Sign up method (email, google)
 */
export const trackSignUp = (method) => {
  trackEvent("sign_up", { method });
};

/**
 * Track user login
 * @param {string} method - Login method (email, google)
 */
export const trackLogin = (method) => {
  trackEvent("login", { method });
};

/**
 * Track shirt added to collection
 * @param {object} shirt - Shirt details
 */
export const trackAddShirt = (shirt) => {
  trackEvent("add_shirt", {
    team: shirt.team,
    brand: shirt.brand,
    type: shirt.type,
    season: shirt.season,
  });
};

/**
 * Track shirt added to wishlist
 * @param {object} item - Wishlist item details
 */
export const trackAddToWishlist = (item) => {
  trackEvent("add_to_wishlist", {
    team: item.team,
    priority: item.priority,
  });
};

/**
 * Track search
 * @param {string} searchTerm - Search query
 */
export const trackSearch = (searchTerm) => {
  trackEvent("search", { search_term: searchTerm });
};

export { app, analytics };
