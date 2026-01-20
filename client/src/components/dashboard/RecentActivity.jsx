import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ShirtIcon, Plus, ChevronRight } from "lucide-react";

const RecentActivity = ({ shirts }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!shirts || shirts.length === 0) {
    return (
      <Card className="dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">{t("dashboard.recentAdditions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-700">
              <ShirtIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">{t("dashboard.noRecentActivity")}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t("dashboard.startByAdding")}</p>
            <Button onClick={() => navigate("/collection/add")} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              {t("collection.addShirt")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-100">{t("dashboard.recentAdditions")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {shirts.map((shirt, index) => (
            <motion.div
              key={shirt._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              onClick={() => navigate(`/collection/${shirt._id}`)}
              className="group p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 flex items-center justify-between"
            >
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {shirt.teamName}
                </h4>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span>{shirt.season}</span>
                  <span>•</span>
                  <span className="capitalize">{shirt.type}</span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(shirt.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
