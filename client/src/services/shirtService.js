import API from "./api";

const shirtService = {
  // Get all shirts with filters
  getShirts: async (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value);
      }
    });

    const response = await API.get(`/shirts?${params.toString()}`);
    return response.data;
  },

  // Get single shirt
  getShirtById: async (id) => {
    const response = await API.get(`/shirts/${id}`);
    return response.data;
  },

  // Create new shirt
  createShirt: async (formData) => {
    const response = await API.post("/shirts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update shirt
  updateShirt: async (id, formData) => {
    const response = await API.put(`/shirts/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete shirt
  deleteShirt: async (id) => {
    const response = await API.delete(`/shirts/${id}`);
    return response.data;
  },

  // Toggle favorite
  toggleFavorite: async (id) => {
    const response = await API.patch(`/shirts/${id}/favorite`);
    return response.data;
  },

  // Get filter options
  getFilterOptions: async () => {
    const response = await API.get("/shirts/filters/options");
    return response.data;
  },
};

export default shirtService;
