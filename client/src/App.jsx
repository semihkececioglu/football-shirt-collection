import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "./context/authContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ScrollToTop from "./components/common/ScrollToTop";

// Skeletons
import {
  DashboardSkeleton,
  CollectionSkeleton,
  StatisticsSkeleton,
  PageSkeleton,
  WishlistSkeleton,
} from "./components/skeletons";
import ShirtDetailSkeleton from "./components/shirt/ShirtDetailSkeleton";

// Lazy loaded pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const UsernameSetup = lazy(() => import("./pages/UsernameSetup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Collection = lazy(() => import("./pages/Collection"));
const AddShirt = lazy(() => import("./pages/AddShirt"));
const EditShirt = lazy(() => import("./pages/EditShirt"));
const ShirtDetail = lazy(() => import("./pages/ShirtDetail"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Help = lazy(() => import("./pages/Help"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Minimal auth page skeleton (for login/register)
const AuthPageSkeleton = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center animate-pulse">
    <div className="w-full max-w-md p-8">
      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-48 mx-auto mb-8" />
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  </div>
);

// Landing page skeleton
const LandingPageSkeleton = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 animate-pulse">
    <div className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700" />
    <div className="h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-96 mx-auto mb-4" />
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-64 mx-auto" />
      </div>
    </div>
  </div>
);

function App() {
  const { isAuthenticated, needsUsername } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              needsUsername ? (
                <Navigate to="/setup-username" />
              ) : (
                <Navigate to="/collection" />
              )
            ) : (
              <Suspense fallback={<AuthPageSkeleton />}>
                <Login />
              </Suspense>
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              needsUsername ? (
                <Navigate to="/setup-username" />
              ) : (
                <Navigate to="/collection" />
              )
            ) : (
              <Suspense fallback={<AuthPageSkeleton />}>
                <Register />
              </Suspense>
            )
          }
        />

        {/* Username Setup (for Google auth users) */}
        <Route
          path="/setup-username"
          element={
            isAuthenticated && needsUsername ? (
              <Suspense fallback={<AuthPageSkeleton />}>
                <UsernameSetup />
              </Suspense>
            ) : (
              <Navigate to="/collection" />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Suspense fallback={<DashboardSkeleton />}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/collection"
          element={
            <ProtectedRoute>
              <Suspense fallback={<CollectionSkeleton />}>
                <Collection />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Suspense fallback={<WishlistSkeleton />}>
                <Wishlist />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageSkeleton />}>
                <Profile />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageSkeleton />}>
                <Settings />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageSkeleton />}>
                <Help />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <Suspense fallback={<StatisticsSkeleton />}>
                <Statistics />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/collection/add"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageSkeleton />}>
                <AddShirt />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/collection/:id/edit"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageSkeleton />}>
                <EditShirt />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/collection/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<ShirtDetailSkeleton />}>
                <ShirtDetail />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Landing Page */}
        <Route
          path="/"
          element={
            <Suspense fallback={<LandingPageSkeleton />}>
              <LandingPage />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<PageSkeleton />}>
              <Contact />
            </Suspense>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <Suspense fallback={<PageSkeleton />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
