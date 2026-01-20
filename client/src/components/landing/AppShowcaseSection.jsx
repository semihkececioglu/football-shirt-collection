import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { TextAnimate } from "@/components/ui/text-animate";
import { Safari } from "@/components/ui/safari";

const AppShowcaseSection = () => {
  const { t } = useTranslation();

  return (
    <section id="showcase" className="py-20 sm:py-28 bg-[#F5F1EA] dark:bg-stone-800/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-light text-stone-900 dark:text-stone-50 mb-4 tracking-tight">
            <TextAnimate
              animation="blurIn"
              by="word"
              as="span"
              delay={0.1}
              duration={0.8}
              once
            >
              {t("landing.showcase.title")}
            </TextAnimate>
          </h2>
          <TextAnimate
            animation="blurIn"
            by="word"
            as="p"
            delay={0.3}
            duration={0.8}
            once
            className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto"
          >
            {t("landing.showcase.subtitle")}
          </TextAnimate>
        </div>

        {/* Safari Browser Frame */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <Safari
            url="footballshirtcollection.app/collection"
            className="w-full shadow-2xl"
            imageSrc="/app-screenshot.png"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default AppShowcaseSection;
