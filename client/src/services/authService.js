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

  // Google OAuth login/register
  googleAuth: async (credential) => {
    const response = await API.post("/auth/google", { credential });
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Check if username is available
  checkUsername: async (username) => {
    const response = await API.get(`/auth/check-username/${username}`);
    return response.data;
  },

  // Set username (for Google auth users)
  setUsername: async (username) => {
    const response = await API.put("/auth/set-username", { username });
    if (response.data.success) {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = { ...currentUser, ...response.data.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
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
    if (response.data.success) {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = { ...currentUser, ...response.data.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    return response.data;
  },

  // Update avatar
  updateAvatar: async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await API.put("/auth/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.success) {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = { ...currentUser, avatar: response.data.data.avatar };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    return response.data;
  },
};

export default authService;
