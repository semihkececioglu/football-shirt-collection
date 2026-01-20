import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TextAnimate } from "@/components/ui/text-animate";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const CTASection = () => {
  const { t } = useTranslation();

  return (
    <section id="cta" className="relative py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/512411ldsdl.jpg"
          alt="Football shirt collection showcase - various jerseys displayed"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/50 via-stone-900/40 to-stone-900/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl font-display font-light text-white mb-6 tracking-tight drop-shadow-lg">
          <TextAnimate
            animation="blurIn"
            by="word"
            as="span"
            delay={0.1}
            duration={0.8}
            once
          >
            {t("landing.cta.title")}
          </TextAnimate>
        </h2>

        {/* Subtitle */}
        <TextAnimate
          animation="blurIn"
          by="word"
          as="p"
          delay={0.3}
          duration={0.8}
          once
          className="text-xl text-stone-200 mb-10 max-w-xl mx-auto leading-relaxed drop-shadow-md"
        >
          {t("landing.cta.subtitle")}
        </TextAnimate>

        {/* CTA Button */}
        <Link to="/register">
          <InteractiveHoverButton
            className="bg-white text-stone-900 border-white/20 px-8 py-3 text-base font-medium shadow-lg"
            dotClassName="bg-stone-900"
          >
            {t("landing.cta.button")}
          </InteractiveHoverButton>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
