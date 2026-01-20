import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const ContactSection = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:contact@footballshirtcollection.com?subject=${encodeURIComponent(`İletişim Formu - ${formData.name}`)}&body=${encodeURIComponent(`İsim: ${formData.name}\nE-posta: ${formData.email}\n\nMesaj:\n${formData.message}`)}`;
    window.location.href = mailtoLink;
  };

  return (
    <section
      id="contact"
      className="py-20 sm:py-28 bg-[#F5F1EA] dark:bg-stone-800"
    >
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-light text-stone-900 dark:text-stone-50 mb-4 tracking-tight">
            {t("landing.contact.title")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400">
            {t("landing.contact.subtitle")}
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              {t("landing.contact.name")}
            </label>
            <Input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t("landing.contact.namePlaceholder")}
              className="w-full bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              {t("landing.contact.email")}
            </label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder={t("landing.contact.emailPlaceholder")}
              className="w-full bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              {t("landing.contact.message")}
            </label>
            <Textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder={t("landing.contact.messagePlaceholder")}
              className="w-full resize-none bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-100 rounded-full h-12 font-medium transition-all duration-300 hover:scale-[1.02]"
          >
            {t("landing.contact.submit")}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactSection;
