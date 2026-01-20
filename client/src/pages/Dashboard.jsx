import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "@/components/common/SEO";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import {
  Plus,
  TrendingUp,
  DollarSign,
  Heart,
  ShirtIcon,
  Star,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Navbar from "@/components/layout/Navbar";
import StatsCard from "@/components/dashboard/StatsCard";
import CollectionChart from "@/components/dashboard/CollectionChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import {
  useOverviewStats,
  useTypeStats,
  useRecentShirts,
} from "@/hooks/useStats";
import { useCurrency } from "@/context/CurrencyContext";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();

  const { data: overviewData, isLoading: overviewLoading } = useOverviewStats();
  const { data: typeData, isLoading: typeLoading } = useTypeStats();
  const { data: recentData, isLoading: recentLoading } = useRecentShirts(5);

  const overview = overviewData?.data || {};
  const typeStats = typeData?.data || [];
  const recentShirts = recentData?.data || [];

  return (
    <>
      <SEO
        title="Dashboard"
        description="View your football shirt collection statistics, recent additions, and collection overview."
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {t("dashboard.title")}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {t("dashboard.overview")}
              </p>
            </div>
            <RainbowButton
              onClick={() => navigate("/collection/add")}
              className="h-10 px-5 rounded-full"
            >
              <Plus className="w-4 h-4 mr-1.5 transition-transform duration-200 group-hover:rotate-90" />
              {t("collection.addShirt")}
            </RainbowButton>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Stats Cards */}
        {overviewLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white dark:bg-slate-800 rounded-lg skeleton border-2 border-slate-200 dark:border-slate-700"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <StatsCard
              title={t("dashboard.totalShirts")}
              value={overview.totalShirts || 0}
              subtitle={t("dashboard.inCollection")}
              icon={ShirtIcon}
              index={0}
            />
            <StatsCard
              title={t("dashboard.totalInvestment")}
              value={formatCurrency((overview.totalInvestment || 0).toFixed(2))}
              subtitle={t("dashboard.amountSpent")}
              icon={DollarSign}
              index={1}
            />
            <StatsCard
              title={t("dashboard.currentValue")}
              value={formatCurrency(
                (overview.totalCurrentValue || 0).toFixed(2)
              )}
              subtitle={t("dashboard.collectionWorth")}
              icon={TrendingUp}
              trend={overview.valueChangePercent}
              index={2}
            />
            <StatsCard
              title={t("dashboard.favorites")}
              value={overview.favoritesCount || 0}
              subtitle={t("dashboard.markedFavorite")}
              icon={Star}
              index={3}
            />
          </div>
        )}

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collection Chart */}
          {typeLoading ? (
            <div className="h-96 bg-white rounded-lg animate-pulse"></div>
          ) : (
            <CollectionChart data={typeStats} />
          )}

          {/* Recent Activity */}
          {recentLoading ? (
            <div className="h-96 bg-white rounded-lg animate-pulse"></div>
          ) : (
            <RecentActivity shirts={recentShirts} />
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 md:mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
            {t("dashboard.quickActions")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            <Button
              variant="outline"
              className="h-auto py-6 md:py-4 flex-col hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 border-slate-300 dark:border-slate-600"
              onClick={() => navigate("/collection")}
            >
              <ShirtIcon className="w-7 h-7 md:w-6 md:h-6 mb-2 text-slate-700 dark:text-slate-300" />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {t("dashboard.viewCollection")}
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 md:py-4 flex-col hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 border-slate-300 dark:border-slate-600"
              onClick={() => navigate("/collection/add")}
            >
              <Plus className="w-7 h-7 md:w-6 md:h-6 mb-2 text-slate-700 dark:text-slate-300" />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {t("collection.addShirt")}
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 md:py-4 flex-col hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 border-slate-300 dark:border-slate-600"
              onClick={() => navigate("/collection?isFavorite=true")}
            >
              <Star className="w-7 h-7 md:w-6 md:h-6 mb-2 text-slate-700 dark:text-slate-300" />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {t("dashboard.favorites")}
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 md:py-4 flex-col hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 border-slate-300 dark:border-slate-600"
              onClick={() => navigate("/wishlist")}
            >
              <Heart className="w-7 h-7 md:w-6 md:h-6 mb-2 text-slate-700 dark:text-slate-300" />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {t("nav.wishlist")}
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 md:py-4 flex-col hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 border-slate-300 dark:border-slate-600"
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-7 h-7 md:w-6 md:h-6 mb-2 text-slate-700 dark:text-slate-300" />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {t("nav.settings")}
              </span>
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="block w-full">
                    <Button
                      variant="outline"
                      className="w-full h-auto py-6 md:py-4 flex-col hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 border-slate-300 dark:border-slate-600 opacity-60 cursor-not-allowed relative pointer-events-none"
                    >
                      <Badge className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 bg-amber-500 text-white border-0">
                        {t("common.soon")}
                      </Badge>
                      <ShieldCheck className="w-7 h-7 md:w-6 md:h-6 mb-2 text-slate-700 dark:text-slate-300" />
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {t("dashboard.authenticityCheck")}
                      </span>
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-center">
                  <p>{t("dashboard.authenticityCheckTooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </main>
      </div>
    </>
  );
};

export default Dashboard;
