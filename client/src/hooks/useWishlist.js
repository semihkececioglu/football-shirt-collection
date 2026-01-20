import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import wishlistService from "../services/wishlistService";

// Cache configuration
const WISHLIST_STALE_TIME = 2 * 60 * 1000; // 2 minutes
const WISHLIST_GC_TIME = 5 * 60 * 1000; // 5 minutes

export const useWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getAll,
    staleTime: WISHLIST_STALE_TIME,
    gcTime: WISHLIST_GC_TIME,
  });
};

export const useWishlistItem = (id) => {
  return useQuery({
    queryKey: ["wishlist", id],
    queryFn: () => wishlistService.getById(id),
    enabled: !!id,
    staleTime: WISHLIST_STALE_TIME,
    gcTime: WISHLIST_GC_TIME,
  });
};

export const useCreateWishlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishlistService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

export const useUpdateWishlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => wishlistService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

export const useDeleteWishlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishlistService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};
