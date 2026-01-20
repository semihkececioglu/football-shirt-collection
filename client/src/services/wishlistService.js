import API from "./api";

const wishlistService = {
  // Get all wishlist items
  getAll: async () => {
    const response = await API.get("/wishlist");
    return response.data;
  },

  // Get single wishlist item
  getById: async (id) => {
    const response = await API.get(`/wishlist/${id}`);
    return response.data;
  },

  // Create wishlist item
  create: async (data) => {
    const response = await API.post("/wishlist", data);
    return response.data;
  },

  // Update wishlist item
  update: async (id, data) => {
    const response = await API.put(`/wishlist/${id}`, data);
    return response.data;
  },

  // Delete wishlist item
  delete: async (id) => {
    const response = await API.delete(`/wishlist/${id}`);
    return response.data;
  },
};

export default wishlistService;
