import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import SEO from "@/components/common/SEO";
import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import AppShowcaseSection from "@/components/landing/AppShowcaseSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import LandingFooter from "@/components/landing/LandingFooter";

const LandingPage = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show nothing while checking auth status
  if (loading) {
    return null;
  }

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <SEO
        title="Track Your Kit Collection"
        description="Organize, track, and showcase your football shirt collection. Manage your jerseys with detailed stats, wishlist features, and beautiful visualization."
      />
      <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-900">
        <LandingNavbar />
        <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AppShowcaseSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
      </div>
    </>
  );
};

export default LandingPage;
