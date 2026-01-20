import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import shirtService from "../services/shirtService";

export const useShirts = (filters = {}) => {
  return useQuery({
    queryKey: [
      "shirts",
      filters.search,
      filters.team,
      filters.type,
      filters.season,
      filters.condition,
      filters.brand,
      filters.competition,
      filters.size,
      filters.color,
      filters.isFavorite,
      filters.signed,
      filters.matchWorn,
      filters.playerIssue,
      filters.dateFrom,
      filters.dateTo,
      filters.sort,
      filters.page,
      filters.limit,
    ],
    queryFn: () => shirtService.getShirts(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 60000, // Consider data fresh for 1 minute
    gcTime: 300000, // Keep in cache for 5 minutes
  });
};

export const useShirt = (id) => {
  return useQuery({
    queryKey: ["shirt", id],
    queryFn: () => shirtService.getShirtById(id),
    enabled: !!id,
  });
};

export const useCreateShirt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shirtService.createShirt,
    onSuccess: () => {
      queryClient.invalidateQueries(["shirts"]);
    },
  });
};

export const useUpdateShirt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) => shirtService.updateShirt(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["shirts"]);
    },
  });
};

export const useDeleteShirt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shirtService.deleteShirt,
    onSuccess: () => {
      queryClient.invalidateQueries(["shirts"]);
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shirtService.toggleFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries(["shirts"]);
    },
  });
};

export const useFilterOptions = () => {
  return useQuery({
    queryKey: ["filterOptions"],
    queryFn: shirtService.getFilterOptions,
    staleTime: 300000, // Consider fresh for 5 minutes
    gcTime: 600000, // Keep in cache for 10 minutes
  });
};
