import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/common/SEO";
import { motion, AnimatePresence, animate } from "motion/react";
import {
  Download,
  TrendingUp,
  Trophy,
  ShoppingBag,
  Palette,
  Shirt,
  Wallet,
  Coins,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Navbar from "@/components/layout/Navbar";
import {
  useOverviewStats,
  useTypeStats,
  useSeasonStats,
  useBrandStats,
  useConditionStats,
  useMostValuable,
  useCompetitionStats,
  useSizeStats,
  useMostTeamsStats,
} from "@/hooks/useStats";
import { useCurrency } from "@/context/CurrencyContext";
import { toast } from "sonner";
import statsService from "@/services/statsService";

// Unified blue color scheme with different opacity levels
const COLORS = [
  "hsl(217 91% 60%)", // Primary blue
  "hsl(217 91% 55%)", // Slightly darker
  "hsl(217 91% 50%)", // Darker
  "hsl(217 91% 45%)", // Even darker
  "hsl(217 91% 65%)", // Lighter
  "hsl(217 91% 70%)", // Even lighter
  "hsl(217 91% 40%)", // Very dark
];

// Helper to get thumbnail URL (handles both string and object formats)
const getImageThumbnail = (image) => {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.thumbnail || image.url;
};

// Parse number from formatted string (handles both TR and EN formats)
const parseFormattedNumber = (str) => {
  if (typeof str === "number") return str;
  if (typeof str !== "string") return 0;

  let cleaned = str.replace(/[₺$€£\s]/g, "");
  const lastDot = cleaned.lastIndexOf(".");
  const lastComma = cleaned.lastIndexOf(",");

  if (lastComma > lastDot) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (lastDot > lastComma && lastComma === -1) {
    const afterDot = cleaned.substring(lastDot + 1);
    if (afterDot.length === 3) {
      cleaned = cleaned.replace(/\./g, "");
    }
  } else if (lastDot > lastComma) {
    cleaned = cleaned.replace(/,/g, "");
  }

  return parseFloat(cleaned) || 0;
};

// Animated number component
const AnimatedNumber = ({ value, isCurrency = false, prefix = "" }) => {
  const numericValue = parseFormattedNumber(value);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, numericValue, {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (latest) => setDisplayValue(latest),
    });
    return () => controls.stop();
  }, [numericValue]);

  const formattedValue = isCurrency
    ? prefix +
      displayValue.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : Math.round(displayValue).toLocaleString();

  return <span>{formattedValue}</span>;
};

// Skeleton card for loading state
const StatCardSkeleton = ({ index }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2, delay: index * 0.05 }}
  >
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-1" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  </motion.div>
);

const Statistics = () => {
  const { t } = useTranslation();
  const [chartType, setChartType] = useState("pie");
  const { formatCurrency } = useCurrency();

  // Responsive Y-axis width based on screen size
  const [axisWidth, setAxisWidth] = useState(
    typeof window !== "undefined"
      ? window.innerWidth < 640
        ? 60
        : window.innerWidth < 1024
        ? 70
        : 80
      : 80
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setAxisWidth(60);
      else if (window.innerWidth < 1024) setAxisWidth(70);
      else setAxisWidth(80);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: overviewData, isLoading: isOverviewLoading } =
    useOverviewStats();
  const { data: typeData } = useTypeStats();
  const { data: seasonData } = useSeasonStats();
  const { data: brandData } = useBrandStats();
  const { data: conditionData } = useConditionStats();
  const { data: valuableData } = useMostValuable(10);
  const { data: competitionData } = useCompetitionStats();
  const { data: sizeData } = useSizeStats();
  const { data: mostTeamsData } = useMostTeamsStats(10);

  const overview = overviewData?.data || {};
  const typeStats = typeData?.data || [];
  const seasonStats = seasonData?.data || [];
  const brandStats = brandData?.data || [];
  const conditionStats = conditionData?.data || [];
  const valuableShirts = valuableData?.data || [];
  const competitionStats = competitionData?.data || [];
  const sizeStats = sizeData?.data || [];
  const mostTeamsStats = mostTeamsData?.data || [];

  // Prepare chart data
  const typeChartData = typeStats.map((item) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    count: item.count,
    value: item.totalValue || 0,
  }));

  const seasonChartData = seasonStats.map((item) => ({
    season: item._id,
    count: item.count,
    value: item.totalValue || 0,
  }));

  const brandChartData = brandStats.map((item) => ({
    brand: item._id,
    count: item.count,
    value: item.totalValue || 0,
  }));

  const conditionChartData = conditionStats.map((item) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    count: item.count,
  }));

  const competitionChartData = competitionStats.map((item) => ({
    competition: item._id,
    count: item.count,
    value: item.totalValue || 0,
  }));

  const sizeChartData = sizeStats.map((item) => ({
    size: item._id,
    count: item.count,
  }));

  const mostTeamsChartData = mostTeamsStats.map((item) => ({
    team: item._id,
    count: item.count,
    value: item.totalValue || 0,
    seasons: item.seasons?.length || 0,
  }));

  // Export functions
  const exportToCSV = async () => {
    try {
      const response = await statsService.exportAll();
      const shirts = response.data;

      // CSV Headers
      const headers = [
        "Team Name",
        "Season",
        "Type",
        "Brand",
        "Size",
        "Condition",
        "Competition",
        "Purchase Price",
        "Current Value",
        "Purchase Location",
        "Player Name",
        "Player Number",
        "Signed",
        "Match Worn",
        "Notes",
      ];

      // Build CSV rows
      const rows = shirts.map((shirt) => [
        shirt.teamName || "",
        shirt.season || "",
        shirt.type || "",
        shirt.brand || "",
        shirt.size || "",
        shirt.condition || "",
        shirt.competition || "",
        shirt.purchasePrice || "0",
        shirt.currentValue || "0",
        shirt.purchaseLocation || "",
        shirt.playerName || "",
        shirt.playerNumber || "",
        shirt.signed ? "Yes" : "No",
        shirt.matchWorn ? "Yes" : "No",
        (shirt.notes || "").replace(/\n/g, " ").replace(/,/g, ";"), // Escape commas
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Create download
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `football-shirts-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("CSV exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export CSV");
    }
  };

  const exportToJSON = () => {
    try {
      const data = {
        overview,
        byType: typeStats,
        bySeason: seasonStats,
        byBrand: brandStats,
        byCondition: conditionStats,
        mostValuable: valuableShirts,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `shirt-collection-stats-${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Statistics exported as JSON!");
    } catch (error) {
      toast.error("Failed to export");
    }
  };

  return (
    <>
      <SEO
        title="Statistics"
        description="Detailed analytics and statistics of your football shirt collection. View charts, trends, and insights."
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />

        {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {t("statistics.title")}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {t("statistics.subtitle")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                {t("statistics.exportCSV")}
              </Button>
              <Button variant="outline" onClick={exportToJSON}>
                <Download className="w-4 h-4 mr-2" />
                {t("statistics.exportJSON")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="wait">
            {isOverviewLoading ? (
              <>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <StatCardSkeleton key={`skeleton-${i}`} index={i} />
                ))}
              </>
            ) : (
              <>
                {/* Total Shirts */}
                <motion.div
                  key="total-shirts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0 * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {t("dashboard.totalShirts")}
                      </CardTitle>
                      <Shirt className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        <AnimatedNumber value={overview.totalShirts || 0} />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t("statistics.itemsInCollection")}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Total Investment */}
                <motion.div
                  key="total-investment"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1 * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {t("dashboard.totalInvestment")}
                      </CardTitle>
                      <Wallet className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                        <AnimatedNumber
                          value={formatCurrency(
                            (overview.totalInvestment || 0).toFixed(2)
                          )}
                          isCurrency
                          prefix={formatCurrency("").replace(/[\d.,\s]/g, "")}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t("statistics.totalSpent")}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Current Value */}
                <motion.div
                  key="current-value"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 2 * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {t("dashboard.currentValue")}
                      </CardTitle>
                      <Coins className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                        <AnimatedNumber
                          value={formatCurrency(
                            (overview.totalCurrentValue || 0).toFixed(2)
                          )}
                          isCurrency
                          prefix={formatCurrency("").replace(/[\d.,\s]/g, "")}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t("statistics.currentWorth")}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Value Change */}
                <motion.div
                  key="value-change"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 3 * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {t("statistics.valueChange")}
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-2xl font-bold ${
                          (overview.valueChange || 0) >= 0
                            ? "text-green-600 dark:text-green-500"
                            : "text-red-600 dark:text-red-500"
                        }`}
                      >
                        {(overview.valueChange || 0) >= 0 ? "+" : ""}
                        <AnimatedNumber
                          value={formatCurrency(
                            Math.abs(overview.valueChange || 0).toFixed(2)
                          )}
                          isCurrency
                          prefix={formatCurrency("").replace(/[\d.,\s]/g, "")}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {overview.valueChangePercent || 0}%{" "}
                        {t("statistics.change")}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Unique Teams */}
                <motion.div
                  key="unique-teams"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 4 * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {t("statistics.uniqueTeams")}
                      </CardTitle>
                      <Shield className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        <AnimatedNumber
                          value={overview.totalUniqueTeams || 0}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t("statistics.differentClubs")}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Unique Competitions */}
                <motion.div
                  key="unique-competitions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 5 * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {t("statistics.uniqueCompetitions")}
                      </CardTitle>
                      <Trophy className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        <AnimatedNumber
                          value={overview.totalUniqueCompetitions || 0}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t("statistics.differentTournaments")}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Unique Brands */}
                <motion.div
                  key="unique-brands"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 6 * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {t("statistics.uniqueBrands")}
                      </CardTitle>
                      <ShoppingBag className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        <AnimatedNumber
                          value={overview.totalUniqueBrands || 0}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t("statistics.differentManufacturers")}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Unique Colors */}
                <motion.div
                  key="unique-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 7 * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {t("statistics.uniqueColors")}
                      </CardTitle>
                      <Palette className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        <AnimatedNumber
                          value={overview.totalUniqueColors || 0}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t("statistics.differentColors")}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Charts Grid - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collection by Type */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("statistics.byType")}</CardTitle>
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pie">
                      {t("statistics.pieChart")}
                    </SelectItem>
                    <SelectItem value="bar">
                      {t("statistics.barChart")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
              {typeChartData.length === 0 ? (
                <div className="h-[300px] w-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                  <p className="text-sm font-medium">
                    {t("statistics.noData")}
                  </p>
                  <p className="text-xs mt-1">
                    {t("statistics.addShirtsToSee")}
                  </p>
                </div>
              ) : chartType === "pie" ? (
                <ChartContainer
                  config={{
                    count: {
                      label: "Shirts",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px] w-full min-h-[300px] animate-in fade-in duration-500"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Pie
                        data={typeChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={90}
                        fill="var(--color-count)"
                        dataKey="count"
                        isAnimationActive={true}
                        animationBegin={0}
                        animationDuration={800}
                        animationEasing="ease-out"
                      >
                        {typeChartData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <ChartLegend
                        content={
                          <ChartLegendContent
                            payload={typeChartData.map((entry, index) => ({
                              value: entry.name,
                              type: "square",
                              color: COLORS[index % COLORS.length],
                            }))}
                          />
                        }
                        verticalAlign="bottom"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <ChartContainer
                  config={{
                    count: {
                      label: "Shirts",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px] w-full min-h-[300px] animate-in fade-in duration-500"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={typeChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="count"
                        fill="var(--color-count)"
                        name="Shirts"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={true}
                        animationDuration={800}
                        animationEasing="ease-out"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Collection Timeline by Season */}
          <Card>
            <CardHeader>
              <CardTitle>{t("statistics.collectionTimeline")}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
              {seasonChartData.length === 0 ? (
                <div className="h-[300px] w-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                  <p className="text-sm font-medium">
                    {t("statistics.noData")}
                  </p>
                  <p className="text-xs mt-1">
                    {t("statistics.addShirtsTimeline")}
                  </p>
                </div>
              ) : (
                <ChartContainer
                  config={{
                    count: {
                      label: "Shirts",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px] w-full min-h-[300px] animate-in fade-in duration-500"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={seasonChartData}>
                      <defs>
                        <linearGradient
                          id="fillCount"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-count)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-count)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="season" />
                      <YAxis allowDecimals={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="var(--color-count)"
                        fill="url(#fillCount)"
                        strokeWidth={2}
                        isAnimationActive={true}
                        animationDuration={800}
                        animationEasing="ease-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Collection by Brand */}
          <Card>
            <CardHeader>
              <CardTitle>{t("statistics.byBrandTop10")}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px] overflow-hidden">
              {brandChartData.length === 0 ? (
                <div className="h-[300px] w-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                  <p className="text-sm font-medium">
                    {t("statistics.noData")}
                  </p>
                  <p className="text-xs mt-1">
                    {t("statistics.addShirtsBrands")}
                  </p>
                </div>
              ) : (
                <ChartContainer
                  config={{
                    count: {
                      label: "Shirts",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px] w-full min-h-[300px] animate-in fade-in duration-500"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={brandChartData}
                      layout="vertical"
                      margin={{ left: 10, right: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis
                        dataKey="brand"
                        type="category"
                        width={axisWidth}
                        tick={{ fontSize: 12 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="count"
                        fill="var(--color-count)"
                        radius={[0, 4, 4, 0]}
                        isAnimationActive={true}
                        animationDuration={800}
                        animationEasing="ease-out"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Collection by Condition */}
          <Card>
            <CardHeader>
              <CardTitle>{t("statistics.byCondition")}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
              {conditionChartData.length === 0 ? (
                <div className="h-[280px] w-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                  <p className="text-sm font-medium">
                    {t("statistics.noData")}
                  </p>
                  <p className="text-xs mt-1">
                    {t("statistics.addShirtsConditions")}
                  </p>
                </div>
              ) : (
                <ChartContainer
                  config={{
                    count: {
                      label: "Shirts",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[280px] w-full animate-in fade-in duration-500"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Pie
                        data={conditionChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="var(--color-count)"
                        dataKey="count"
                        isAnimationActive={true}
                        animationBegin={0}
                        animationDuration={800}
                        animationEasing="ease-out"
                      >
                        {conditionChartData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <ChartLegend
                        content={
                          <ChartLegendContent
                            payload={conditionChartData.map((entry, index) => ({
                              value: entry.condition,
                              type: "square",
                              color: COLORS[index % COLORS.length],
                            }))}
                          />
                        }
                        verticalAlign="bottom"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Collection by Competition */}
          <Card>
            <CardHeader>
              <CardTitle>{t("statistics.byCompetition")}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px] overflow-hidden">
              {competitionChartData.length === 0 ? (
                <div className="h-[300px] w-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                  <p className="text-sm font-medium">
                    {t("statistics.noData")}
                  </p>
                  <p className="text-xs mt-1">
                    {t("statistics.addShirtsCompetitions")}
                  </p>
                </div>
              ) : (
                <ChartContainer
                  config={{
                    count: {
                      label: "Shirts",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px] w-full min-h-[300px] animate-in fade-in duration-500"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={competitionChartData}
                      layout="vertical"
                      margin={{ left: 10, right: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis
                        dataKey="competition"
                        type="category"
                        width={axisWidth}
                        tick={{ fontSize: 12 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="count"
                        fill="var(--color-count)"
                        radius={[0, 4, 4, 0]}
                        isAnimationActive={true}
                        animationDuration={800}
                        animationEasing="ease-out"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Collection by Size */}
          <Card>
            <CardHeader>
              <CardTitle>{t("statistics.bySize")}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
              {sizeChartData.length === 0 ? (
                <div className="h-[280px] w-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                  <p className="text-sm font-medium">
                    {t("statistics.noData")}
                  </p>
                  <p className="text-xs mt-1">
                    {t("statistics.addShirtsSizes")}
                  </p>
                </div>
              ) : (
                <ChartContainer
                  config={{
                    count: {
                      label: "Shirts",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[280px] w-full animate-in fade-in duration-500"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sizeChartData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="size" />
                      <YAxis allowDecimals={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="count"
                        fill="var(--color-count)"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={true}
                        animationDuration={800}
                        animationEasing="ease-out"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Most Teams */}
          <Card>
            <CardHeader>
              <CardTitle>{t("statistics.mostCollectedTeams")}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
              {mostTeamsChartData.length === 0 ? (
                <div className="h-[300px] w-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                  <p className="text-sm font-medium">
                    {t("statistics.noData")}
                  </p>
                  <p className="text-xs mt-1">
                    {t("statistics.addShirtsTeams")}
                  </p>
                </div>
              ) : (
                <ChartContainer
                  config={{
                    count: {
                      label: "Shirts",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px] w-full min-h-[300px] animate-in fade-in duration-500"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mostTeamsChartData}
                      layout="vertical"
                      margin={{ top: 20, right: 60, bottom: 20, left: 20 }}
                    >
                      <XAxis type="number" allowDecimals={false} hide />
                      <YAxis
                        dataKey="team"
                        type="category"
                        width={axisWidth}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                      />
                      <Bar
                        dataKey="count"
                        fill="var(--color-count)"
                        radius={[0, 4, 4, 0]}
                        isAnimationActive={true}
                        animationDuration={800}
                        animationEasing="ease-out"
                        label={{
                          position: "right",
                          fill: "hsl(var(--foreground))",
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Most Valuable Shirts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {t("statistics.mostValuable")}
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[300px] overflow-y-auto">
              <div className="space-y-3">
                {valuableShirts.length === 0 ? (
                  <div className="h-[300px] w-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                    <p className="text-sm font-medium">
                      {t("statistics.noData")}
                    </p>
                    <p className="text-xs mt-1">
                      {t("statistics.addShirtsValuable")}
                    </p>
                  </div>
                ) : (
                  valuableShirts.map((shirt, index) => (
                    <div
                      key={shirt._id}
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                      <div className="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-900 rounded-full font-bold text-sm text-slate-600 dark:text-slate-400 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-lg overflow-hidden flex-shrink-0">
                        {shirt.images && shirt.images[0] ? (
                          <img
                            src={getImageThumbnail(shirt.images[0])}
                            alt={shirt.teamName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {shirt.teamName}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {shirt.season} • {shirt.type}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-green-600 dark:text-green-500">
                          {formatCurrency(shirt.currentValue)}
                        </p>
                        {shirt.purchasePrice > 0 && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {t("statistics.bought")}:{" "}
                            {formatCurrency(shirt.purchasePrice)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      </div>
    </>
  );
};

export default Statistics;
