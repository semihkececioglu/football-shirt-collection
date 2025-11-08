import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import shirtService from "../services/shirtService";
import { toast } from "react-hot-toast";

export const useShirts = (filters = {}) => {
  return useQuery({
    queryKey: ["shirts", filters],
    queryFn: () => shirtService.getShirts(filters),
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
      toast.success("Shirt added successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add shirt");
    },
  });
};

export const useUpdateShirt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) => shirtService.updateShirt(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["shirts"]);
      toast.success("Shirt updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update shirt");
    },
  });
};

export const useDeleteShirt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shirtService.deleteShirt,
    onSuccess: () => {
      queryClient.invalidateQueries(["shirts"]);
      toast.success("Shirt deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete shirt");
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
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update favorite");
    },
  });
};

export const useFilterOptions = () => {
  return useQuery({
    queryKey: ["filterOptions"],
    queryFn: shirtService.getFilterOptions,
  });
};
