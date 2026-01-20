import { useQuery } from "@tanstack/react-query";
import statsService from "../services/statsService";

// Cache configuration - stats don't change frequently
const STATS_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const STATS_GC_TIME = 10 * 60 * 1000; // 10 minutes

export const useOverviewStats = () => {
  return useQuery({
    queryKey: ["stats", "overview"],
    queryFn: statsService.getOverview,
    staleTime: STATS_STALE_TIME,
    gcTime: STATS_GC_TIME,
  });
};

export const useTypeStats = () => {
  return useQuery({
    queryKey: ["stats", "by-type"],
    queryFn: statsService.getByType,
    staleTime: STATS_STALE_TIME,
    gcTime: STATS_GC_TIME,
  });
};

export const useSeasonStats = () => {
  return useQuery({
    queryKey: ["stats", "by-season"],
    queryFn: statsService.getBySeason,
    staleTime: STATS_STALE_TIME,
    gcTime: STATS_GC_TIME,
  });
};

export const useBrandStats = () => {
  return useQuery({
    queryKey: ["stats", "by-brand"],
    queryFn: statsService.getByBrand,
    staleTime: STATS_STALE_TIME,
    gcTime: STATS_GC_TIME,
  });
};

export const useConditionStats = () => {
  return useQuery({
    queryKey: ["stats", "by-condition"],
    queryFn: statsService.getByCondition,
    staleTime: STATS_STALE_TIME,
    gcTime: STATS_GC_TIME,
  });
};

export const useRecentShirts = (limit = 5) => {
  return useQuery({
    queryKey: ["stats", "recent", limit],
    queryFn: () => statsService.getRecent(limit),
    staleTime: STATS_STALE_TIME,
    gcTime: STATS_GC_TIME,
  });
};

export const useMostValuable = (limit = 5) => {
  return useQuery({
    queryKey: ["stats", "most-valuable", limit],
    queryFn: () => statsService.getMostValuable(limit),
    staleTime: STATS_STALE_TIME,
    gcTime: STATS_GC_TIME,
  });
};

export const useCompetitionStats = () => {
  return useQuery({
    queryKey: ["stats", "by-competition"],
    queryFn: statsService.getByCompetition,
    staleTime: STATS_STALE_TIME,
    gcTime: STATS_GC_TIME,
  });
};

export const useSizeStats = () => {
  return useQuery({
    queryKey: ["stats", "by-size"],
    queryFn: statsService.getBySize,
    staleTime: STATS_STALE_TIME,
    gcTime: STATS_GC_TIME,
  });
};

export const useMostTeamsStats = (limit = 10) => {
  return useQuery({
    queryKey: ["stats", "most-teams", limit],
    queryFn: () => statsService.getMostTeams(limit),
    staleTime: STATS_STALE_TIME,
    gcTime: STATS_GC_TIME,
  });
};

export const useExportStats = () => {
  return useQuery({
    queryKey: ["stats", "export"],
    queryFn: statsService.exportAll,
    enabled: false, // Only fetch when explicitly called
  });
};
