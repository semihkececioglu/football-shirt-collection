import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { ShirtIcon } from "lucide-react";

// Consistent minimal illustration components
const CollectionIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center p-4 group">
    {/* Card with organized data fields */}
    <div className="w-40 bg-white dark:bg-stone-800 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
      {/* Card header with shirt preview */}
      <div className="h-16 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-700 dark:to-stone-600 flex items-center justify-center">
        <ShirtIcon className="w-8 h-8 text-stone-600 dark:text-stone-300" />
      </div>

      {/* Data fields */}
      <div className="p-3 space-y-2">
        {/* Team field */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-stone-800 dark:bg-stone-200" />
          <div className="h-2 bg-stone-300 dark:bg-stone-600 rounded-full flex-1" />
        </div>
        {/* Season field */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-stone-400 dark:bg-stone-500" />
          <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full w-2/3" />
        </div>
        {/* Price field */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-stone-400 dark:bg-stone-500" />
          <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full w-1/2" />
        </div>
      </div>
    </div>
  </div>
);

const StatisticsIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center p-4 group">
    {/* Bar chart with floating labels */}
    <div className="flex items-end gap-3 h-28">
      {/* Bar 1 */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">12</span>
        <div className="w-6 bg-stone-300 dark:bg-stone-600 rounded-t-md transition-all duration-500 group-hover:bg-stone-400 dark:group-hover:bg-stone-500" style={{ height: '40px' }} />
      </div>
      {/* Bar 2 */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">28</span>
        <div className="w-6 bg-stone-400 dark:bg-stone-500 rounded-t-md transition-all duration-500 group-hover:bg-stone-500 dark:group-hover:bg-stone-400" style={{ height: '70px' }} />
      </div>
      {/* Bar 3 - Highlighted */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] font-bold text-stone-800 dark:text-stone-200">47</span>
        <div className="w-6 bg-stone-800 dark:bg-stone-200 rounded-t-md transition-all duration-500 group-hover:scale-y-105 origin-bottom" style={{ height: '95px' }} />
      </div>
      {/* Bar 4 */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">19</span>
        <div className="w-6 bg-stone-400 dark:bg-stone-500 rounded-t-md transition-all duration-500 group-hover:bg-stone-500 dark:group-hover:bg-stone-400" style={{ height: '55px' }} />
      </div>
      {/* Bar 5 */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">8</span>
        <div className="w-6 bg-stone-300 dark:bg-stone-600 rounded-t-md transition-all duration-500 group-hover:bg-stone-400 dark:group-hover:bg-stone-500" style={{ height: '30px' }} />
      </div>
    </div>
  </div>
);

const WishlistIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center p-4 group">
    {/* Stacked cards with hover animation */}
    <div className="relative w-32 h-24">
      <div className="absolute inset-0 bg-stone-300 dark:bg-stone-600 rounded-xl transform rotate-6 translate-x-2 translate-y-2 transition-transform duration-300 group-hover:rotate-8 group-hover:translate-x-3 group-hover:translate-y-3" />
      <div className="absolute inset-0 bg-stone-200 dark:bg-stone-700 rounded-xl transform rotate-3 translate-x-1 translate-y-1 transition-transform duration-300 group-hover:rotate-5 group-hover:translate-x-2 group-hover:translate-y-2" />
      <div className="absolute inset-0 bg-white dark:bg-stone-800 rounded-xl shadow-lg flex items-center justify-center border border-stone-200 dark:border-stone-700 transition-transform duration-300 group-hover:rotate-[-2deg]">
        <svg
          viewBox="0 0 24 24"
          className="w-10 h-10 text-stone-800 dark:text-stone-200"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    </div>
  </div>
);

const GalleryIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center p-4 group">
    {/* Carousel-style stacked photos */}
    <div className="relative w-36 h-24 flex items-center justify-center">
      {/* Back photos - left side */}
      <div className="absolute w-16 h-20 bg-stone-300 dark:bg-stone-600 rounded-lg shadow-sm transform -rotate-12 -translate-x-8 transition-all duration-300 group-hover:-rotate-20 group-hover:-translate-x-12 overflow-hidden">
        <div className="w-full h-3/4 bg-stone-400 dark:bg-stone-500" />
        <div className="w-full h-1/4 bg-white dark:bg-stone-700" />
      </div>
      <div className="absolute w-16 h-20 bg-stone-200 dark:bg-stone-700 rounded-lg shadow-sm transform -rotate-6 -translate-x-4 transition-all duration-300 group-hover:-rotate-10 group-hover:-translate-x-6 overflow-hidden">
        <div className="w-full h-3/4 bg-stone-300 dark:bg-stone-600" />
        <div className="w-full h-1/4 bg-white dark:bg-stone-800" />
      </div>

      {/* Front photo - center */}
      <div className="absolute w-16 h-20 bg-white dark:bg-stone-800 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 transform transition-all duration-300 group-hover:scale-105 overflow-hidden z-10">
        <div className="w-full h-3/4 bg-stone-800 dark:bg-stone-200 flex items-center justify-center">
          <ShirtIcon className="w-6 h-6 text-white dark:text-stone-800" />
        </div>
        <div className="w-full h-1/4 bg-white dark:bg-stone-800" />
      </div>

      {/* Back photos - right side */}
      <div className="absolute w-16 h-20 bg-stone-200 dark:bg-stone-700 rounded-lg shadow-sm transform rotate-6 translate-x-4 transition-all duration-300 group-hover:rotate-10 group-hover:translate-x-6 overflow-hidden">
        <div className="w-full h-3/4 bg-stone-300 dark:bg-stone-600" />
        <div className="w-full h-1/4 bg-white dark:bg-stone-800" />
      </div>
      <div className="absolute w-16 h-20 bg-stone-300 dark:bg-stone-600 rounded-lg shadow-sm transform rotate-12 translate-x-8 transition-all duration-300 group-hover:rotate-20 group-hover:translate-x-12 overflow-hidden">
        <div className="w-full h-3/4 bg-stone-400 dark:bg-stone-500" />
        <div className="w-full h-1/4 bg-white dark:bg-stone-700" />
      </div>
    </div>
  </div>
);

const CurrencyIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center p-4 group">
    <div className="flex items-center gap-4">
      {/* Left currency */}
      <div className="w-16 h-16 bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <span className="text-2xl font-bold text-stone-800 dark:text-stone-200">$</span>
      </div>

      {/* Exchange arrows */}
      <div className="flex flex-col gap-1">
        <svg className="w-6 h-3 text-stone-400 dark:text-stone-500 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M0 6h22M18 2l4 4-4 4" />
        </svg>
        <svg className="w-6 h-3 text-stone-400 dark:text-stone-500 transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M24 6H2M6 2L2 6l4 4" />
        </svg>
      </div>

      {/* Right currency options */}
      <div className="flex flex-col gap-1">
        <div className="w-12 h-7 bg-stone-200 dark:bg-stone-700 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-stone-800 group-hover:dark:bg-stone-200">
          <span className="text-sm font-bold text-stone-600 dark:text-stone-400 transition-colors duration-300 group-hover:text-white group-hover:dark:text-stone-800">€</span>
        </div>
        <div className="w-12 h-7 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center border border-stone-200 dark:border-stone-700">
          <span className="text-sm font-bold text-stone-500 dark:text-stone-500">£</span>
        </div>
        <div className="w-12 h-7 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center border border-stone-200 dark:border-stone-700">
          <span className="text-sm font-bold text-stone-500 dark:text-stone-500">₺</span>
        </div>
      </div>
    </div>
  </div>
);

const SecurityIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center p-4 group">
    {/* Concentric protection layers */}
    <div className="relative flex items-center justify-center">
      {/* Outer ring */}
      <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-stone-300 dark:border-stone-600 transition-all duration-500 group-hover:scale-110 group-hover:border-stone-400 group-hover:dark:border-stone-500" />

      {/* Middle ring */}
      <div className="absolute w-18 h-18 rounded-full border-2 border-stone-400 dark:border-stone-500 transition-all duration-400 group-hover:scale-105" style={{ width: '72px', height: '72px' }} />

      {/* Inner shield */}
      <div className="w-14 h-14 bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 flex items-center justify-center transition-all duration-300 group-hover:shadow-xl">
        <svg className="w-7 h-7 text-stone-800 dark:text-stone-200" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
        </svg>
      </div>
    </div>
  </div>
);

const features = [
  {
    illustration: CollectionIllustration,
    titleKey: "landing.features.collection.title",
    descKey: "landing.features.collection.desc",
    row: "top",
  },
  {
    illustration: StatisticsIllustration,
    titleKey: "landing.features.statistics.title",
    descKey: "landing.features.statistics.desc",
    row: "top",
  },
  {
    illustration: WishlistIllustration,
    titleKey: "landing.features.wishlist.title",
    descKey: "landing.features.wishlist.desc",
    row: "bottom",
  },
  {
    illustration: GalleryIllustration,
    titleKey: "landing.features.gallery.title",
    descKey: "landing.features.gallery.desc",
    row: "bottom",
  },
  {
    illustration: CurrencyIllustration,
    titleKey: "landing.features.currency.title",
    descKey: "landing.features.currency.desc",
    row: "bottom",
  },
  {
    illustration: SecurityIllustration,
    titleKey: "landing.features.security.title",
    descKey: "landing.features.security.desc",
    row: "bottom",
  },
];

const FeaturesSection = () => {
  const { t } = useTranslation();

  const topFeatures = features.filter((f) => f.row === "top");
  const bottomFeatures = features.filter((f) => f.row === "bottom");

  return (
    <section
      id="features"
      className="py-20 sm:py-28 bg-[#F0F0F0] dark:bg-stone-900"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bento Grid */}
        <div className="space-y-4">
          {/* Top Row - 2 larger cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topFeatures.map((feature, index) => (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#FAFAFA] dark:bg-stone-800 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg"
              >
                {/* Illustration */}
                <div className="h-40 mb-6">
                  <feature.illustration />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-50 mb-3 tracking-tight">
                  {t(feature.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed text-sm">
                  {t(feature.descKey)}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Bottom Row - 4 smaller cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bottomFeatures.map((feature, index) => (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-[#FAFAFA] dark:bg-stone-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
              >
                {/* Illustration */}
                <div className="h-32 mb-4">
                  <feature.illustration />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2 tracking-tight">
                  {t(feature.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed text-sm">
                  {t(feature.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
