import API from "./api";

const statsService = {
  // Get overview statistics
  getOverview: async () => {
    const response = await API.get("/stats/overview");
    return response.data;
  },

  // Get by type
  getByType: async () => {
    const response = await API.get("/stats/by-type");
    return response.data;
  },

  // Get by season
  getBySeason: async () => {
    const response = await API.get("/stats/by-season");
    return response.data;
  },

  // Get by brand
  getByBrand: async () => {
    const response = await API.get("/stats/by-brand");
    return response.data;
  },

  // Get by condition
  getByCondition: async () => {
    const response = await API.get("/stats/by-condition");
    return response.data;
  },

  // Get recent shirts
  getRecent: async (limit = 5) => {
    const response = await API.get(`/stats/recent?limit=${limit}`);
    return response.data;
  },

  // Get most valuable
  getMostValuable: async (limit = 5) => {
    const response = await API.get(`/stats/most-valuable?limit=${limit}`);
    return response.data;
  },

  // Get by competition
  getByCompetition: async () => {
    const response = await API.get("/stats/by-competition");
    return response.data;
  },

  // Get by size
  getBySize: async () => {
    const response = await API.get("/stats/by-size");
    return response.data;
  },

  // Get most teams
  getMostTeams: async (limit = 10) => {
    const response = await API.get(`/stats/most-teams?limit=${limit}`);
    return response.data;
  },

  // Export all shirts
  exportAll: async () => {
    const response = await API.get("/stats/export");
    return response.data;
  },
};

export default statsService;
