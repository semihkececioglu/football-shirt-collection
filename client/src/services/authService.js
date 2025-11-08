import API from "./api";

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await API.post("/auth/register", userData);
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await API.post("/auth/login", credentials);
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Get profile
  getProfile: async () => {
    const response = await API.get("/auth/profile");
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await API.put("/auth/profile", userData);
    return response.data;
  },
};

export default authService;
