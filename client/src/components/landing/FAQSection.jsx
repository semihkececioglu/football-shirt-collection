import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { TextAnimate } from "@/components/ui/text-animate";
import { ChevronDown } from "lucide-react";

const faqs = [
  { questionKey: "landing.faq.q1", answerKey: "landing.faq.a1" },
  { questionKey: "landing.faq.q2", answerKey: "landing.faq.a2" },
  { questionKey: "landing.faq.q3", answerKey: "landing.faq.a3" },
  { questionKey: "landing.faq.q4", answerKey: "landing.faq.a4" },
  { questionKey: "landing.faq.q5", answerKey: "landing.faq.a5" },
];

const FAQItem = ({ questionKey, answerKey, isOpen, onClick }) => {
  const { t } = useTranslation();

  return (
    <div className="border-b border-stone-200 dark:border-stone-700 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left gap-4 transition-colors duration-200 hover:text-stone-600 dark:hover:text-stone-300"
      >
        <span className="text-base font-medium text-stone-900 dark:text-stone-50">
          {t(questionKey)}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-stone-400 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-stone-600 dark:text-stone-400 leading-relaxed">
              {t(answerKey)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#FDFBF7] dark:bg-stone-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl font-display font-light text-stone-900 dark:text-stone-50 text-center mb-12 tracking-tight">
          <TextAnimate
            animation="blurIn"
            by="word"
            as="span"
            delay={0.1}
            duration={0.8}
            once
          >
            {t("landing.faq.title")}
          </TextAnimate>
        </h2>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700 px-6 sm:px-8"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.questionKey}
              questionKey={faq.questionKey}
              answerKey={faq.answerKey}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
