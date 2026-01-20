import { lazy, Suspense, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { TextAnimate } from "@/components/ui/text-animate";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { ChevronDown } from "lucide-react";

// Lazy load the heavy Three.js component
const LiquidEther = lazy(() => import("@/components/backgrounds/LiquidEther"));

// CSS-only gradient fallback - lightweight alternative
const GradientFallback = () => (
  <div
    className="absolute inset-0 animate-gradient-shift"
    style={{
      background: "linear-gradient(-45deg, #D4C4B0, #C4B5A5, #A8998A, #D4C4B0)",
      backgroundSize: "400% 400%",
    }}
  />
);

const HeroSection = () => {
  const { t } = useTranslation();
  const [showLiquidEther, setShowLiquidEther] = useState(false);

  // Only load Three.js after initial paint to improve LCP
  useEffect(() => {
    // Use requestIdleCallback if available, otherwise setTimeout
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(
        () => setShowLiquidEther(true),
        { timeout: 2000 }
      );
      return () => window.cancelIdleCallback(id);
    } else {
      const timer = setTimeout(() => setShowLiquidEther(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FDFBF7] dark:bg-stone-900">
      {/* Gradient Blob Background */}
      <div className="absolute inset-0">
        {showLiquidEther ? (
          <Suspense fallback={<GradientFallback />}>
            <LiquidEther
              colors={["#D4C4B0", "#C4B5A5", "#A8998A"]}
              mouseForce={10}
              cursorSize={180}
              isViscous={false}
              viscous={25}
              iterationsViscous={32}
              iterationsPoisson={32}
              resolution={0.5}
              isBounce={false}
              autoDemo={true}
              autoSpeed={0.1}
              autoIntensity={0.8}
              takeoverDuration={0.5}
              autoResumeDelay={5000}
              autoRampDuration={1.2}
            />
          </Suspense>
        ) : (
          <GradientFallback />
        )}
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/40 via-transparent to-[#FDFBF7]/60 dark:from-stone-900/40 dark:via-transparent dark:to-stone-900/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 bg-stone-100/80 dark:bg-stone-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8"
        >
          <div className="relative w-2 h-2">
            <span className="absolute inset-0 bg-emerald-500/30 rounded-full animate-ping" />
            <span className="absolute inset-0 bg-emerald-500/20 rounded-full animate-pulse" />
            <span className="absolute inset-0 bg-emerald-500 rounded-full" />
          </div>
          <span className="text-sm text-stone-600 dark:text-stone-400 font-medium tracking-wide">
            {t("landing.hero.badge")}
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-normal text-stone-900 dark:text-stone-50 leading-[1.1] tracking-tight mb-6">
          <TextAnimate
            animation="blurIn"
            by="word"
            as="span"
            delay={0.1}
            duration={0.8}
            once
            className="block"
          >
            {t("landing.hero.titlePrefix")}
          </TextAnimate>
          <TextAnimate
            animation="blurIn"
            by="word"
            as="span"
            delay={0.3}
            duration={1}
            once
            className="block font-display font-light"
          >
            {t("landing.hero.titleHighlight")}
          </TextAnimate>
          <TextAnimate
            animation="blurIn"
            by="word"
            as="span"
            delay={1.4}
            duration={0.8}
            once
            className="block"
          >
            {t("landing.hero.titleSuffix")}
          </TextAnimate>
        </h1>

        {/* Subtitle - Detailed */}
        <TextAnimate
          animation="blurIn"
          by="word"
          as="p"
          delay={0.8}
          duration={1}
          once
          className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          {t("landing.hero.subtitle")}
        </TextAnimate>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link to="/register">
            <InteractiveHoverButton className="bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-50 border-stone-200 dark:border-stone-700 text-base font-medium px-6 py-2.5">
              {t("landing.hero.cta")}
            </InteractiveHoverButton>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown className="w-6 h-6 text-stone-400 animate-bounce" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
