import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { ShirtIcon } from "lucide-react";

// Unified blue color scheme matching Statistics page
const COLORS = [
  "hsl(217 91% 60%)", // Primary blue
  "hsl(217 91% 55%)", // Slightly darker
  "hsl(217 91% 50%)", // Darker
  "hsl(217 91% 45%)", // Even darker
  "hsl(217 91% 65%)", // Lighter
];

const LABELS = {
  home: "Home",
  away: "Away",
  third: "Third",
  goalkeeper: "Goalkeeper",
  special: "Special",
};

const CollectionChart = ({ data }) => {
  const { t } = useTranslation();
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item, index) => ({
      name: LABELS[item._id] || item._id.charAt(0).toUpperCase() + item._id.slice(1),
      count: item.count,
      fill: COLORS[index % COLORS.length],
    }));
  }, [data]);

  const totalShirts = useMemo(
    () => chartData.reduce((sum, item) => sum + item.count, 0),
    [chartData]
  );

  if (!data || data.length === 0) {
    return (
      <Card className="dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">{t("statistics.byType")}</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            {t("dashboard.breakdownOfCollection")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="h-[300px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-700">
              <ShirtIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t("dashboard.noShirtsYet")}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t("dashboard.addFirstToSeeStats")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-slate-800 border-slate-200 dark:border-slate-700 flex flex-col">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-100">{t("statistics.byType")}</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          {totalShirts === 1
            ? t("dashboard.shirtInCollection")
            : t("dashboard.shirtsInCollection", { count: totalShirts })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center flex-1 pb-4 h-[300px]">
        <ChartContainer
          config={{
            count: {
              label: "Shirts",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px] w-full min-h-[300px] animate-in fade-in duration-500"
        >
          <ResponsiveContainer width="100%" height="100%" debounce={100}>
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={chartData}
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
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={
                  <ChartLegendContent
                    payload={chartData.map((entry, index) => ({
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
      </CardContent>
    </Card>
  );
};

export default CollectionChart;
