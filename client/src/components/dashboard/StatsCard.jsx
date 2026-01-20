import { useEffect, useState } from "react";
import { motion, animate } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

// Parse number from formatted string (handles both TR and EN formats)
const parseFormattedNumber = (str) => {
  if (typeof str === "number") return str;
  if (typeof str !== "string") return 0;

  // Remove currency symbols and spaces
  let cleaned = str.replace(/[₺$€£\s]/g, "");

  // Detect format: Turkish uses "1.234,56", English uses "1,234.56"
  const lastDot = cleaned.lastIndexOf(".");
  const lastComma = cleaned.lastIndexOf(",");

  if (lastComma > lastDot) {
    // Turkish format: 1.234,56 -> remove dots, replace comma with dot
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (lastDot > lastComma && lastComma === -1) {
    // Only dot, no comma - need to determine if dot is decimal or thousand separator
    const afterDot = cleaned.substring(lastDot + 1);
    if (afterDot.length === 3) {
      // Exactly 3 digits after dot = thousand separator (e.g., "1.234" = 1234)
      cleaned = cleaned.replace(/\./g, "");
    }
    // Otherwise keep as is (decimal point)
  } else if (lastDot > lastComma) {
    // English format: 1,234.56 -> remove commas
    cleaned = cleaned.replace(/,/g, "");
  }

  return parseFloat(cleaned) || 0;
};

// Animated number component
const AnimatedNumber = ({ value }) => {
  const numericValue = parseFormattedNumber(value);
  const [displayValue, setDisplayValue] = useState(0);

  // Check if it's a currency value
  const isCurrency = typeof value === "string" && value.match(/[₺$€£]/);
  const prefix = isCurrency ? (value.match(/^[₺$€£\s]*/)?.[0] || "") : "";

  useEffect(() => {
    const controls = animate(0, numericValue, {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (latest) => setDisplayValue(latest),
    });
    return () => controls.stop();
  }, [numericValue]);

  const formattedValue = isCurrency
    ? prefix + displayValue.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(displayValue).toLocaleString();

  return <span>{formattedValue}</span>;
};

const StatsCard = ({ title, value, subtitle, icon: Icon, trend, index = 0 }) => {
  const isPositive = trend && parseFloat(trend) >= 0;

  // Check if value is a number or numeric string (including 0)
  const isNumeric = typeof value === "number" ||
    (typeof value === "string" && (value.match(/\d/) || value === "0"));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.1,
      }}
    >
      <Card className="transition-all duration-200 hover:shadow-lg border-2 border-slate-200 dark:border-slate-700 h-32">
        <CardContent className="p-4 h-full flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-slate-100">
                {isNumeric ? <AnimatedNumber value={value} /> : value}
              </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
            )}
            {trend && (
              <div
                className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                  isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{trend}%</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="ml-4 w-12 h-12 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 flex-shrink-0">
              <Icon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default StatsCard;
