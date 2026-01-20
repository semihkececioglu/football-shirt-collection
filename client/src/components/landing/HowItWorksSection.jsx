import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { TextAnimate } from "@/components/ui/text-animate";
import { UserPlus, ShirtIcon, BarChart3, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    titleKey: "landing.howItWorks.step1.title",
    descKey: "landing.howItWorks.step1.desc",
  },
  {
    icon: ShirtIcon,
    titleKey: "landing.howItWorks.step2.title",
    descKey: "landing.howItWorks.step2.desc",
  },
  {
    icon: BarChart3,
    titleKey: "landing.howItWorks.step3.title",
    descKey: "landing.howItWorks.step3.desc",
  },
];

const HowItWorksSection = () => {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#F0F0F0] dark:bg-stone-800/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-light text-stone-900 dark:text-stone-50 mb-4 tracking-tight">
            <TextAnimate
              animation="blurIn"
              by="word"
              as="span"
              delay={0.1}
              duration={0.8}
              once
            >
              {t("landing.howItWorks.title")}
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
            {t("landing.howItWorks.subtitle")}
          </TextAnimate>
        </div>

        {/* Steps - Horizontal Timeline */}
        <div className="relative">
          {/* Timeline connector line */}
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 dark:from-stone-700 dark:via-stone-600 dark:to-stone-700" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Card */}
                <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-stone-700 transition-shadow duration-300 hover:shadow-lg">
                  {/* Step number badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-xl bg-stone-100 dark:bg-stone-700 flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-stone-600 dark:text-stone-300" />
                    </div>
                    <span className="text-4xl font-display font-light text-stone-200 dark:text-stone-700">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2">
                    {t(step.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {t(step.descKey)}
                  </p>

                  {/* Arrow indicator for next step */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center shadow-sm">
                        <ArrowRight className="w-4 h-4 text-stone-400" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
