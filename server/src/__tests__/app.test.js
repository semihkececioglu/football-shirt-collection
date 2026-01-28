import request from "supertest";
import app from "../app.js";

describe("App", () => {
  describe("GET /", () => {
    it("should return API info", async () => {
      const res = await request(app).get("/");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("⚽ Football Shirt Collection API");
      expect(res.body.version).toBe("1.0.0");
      expect(res.body.status).toBe("Running");
    });
  });

  describe("GET /health", () => {
    it("should return healthy status", async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe("healthy");
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe("404 Handler", () => {
    it("should return 404 for unknown routes", async () => {
      const res = await request(app).get("/api/unknown-route");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Route not found");
    });
  });
});
