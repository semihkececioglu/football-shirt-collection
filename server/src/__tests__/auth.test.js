import request from "supertest";
import app from "../app.js";
import User from "../models/Users.js";

describe("Auth API", () => {
  const testUser = {
    name: "Test User",
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  };

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
      expect(res.body.data.name).toBe(testUser.name);
      expect(res.body.data.username).toBe(testUser.username);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.password).toBeUndefined();
    });

    it("should not register user with existing email", async () => {
      // First registration
      await request(app).post("/api/auth/register").send(testUser);

      // Try to register again with same email
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("User already exists");
    });

    it("should not register user with existing username", async () => {
      // First registration
      await request(app).post("/api/auth/register").send(testUser);

      // Try to register with same username but different email
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          ...testUser,
          email: "different@example.com",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Username is already taken");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a user before login tests
      await request(app).post("/api/auth/register").send(testUser);
    });

    it("should login with valid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
      expect(res.body.data.token).toBeDefined();
    });

    it("should not login with wrong password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "wrongpassword",
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid credentials");
    });

    it("should not login with non-existent email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: testUser.password,
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid credentials");
    });

    it("should not login without email or password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Please provide email and password");
    });
  });

  describe("GET /api/auth/profile", () => {
    let authToken;

    beforeEach(async () => {
      // Register and get token
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);
      authToken = res.body.data.token;
    });

    it("should get profile with valid token", async () => {
      const res = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
    });

    it("should not get profile without token", async () => {
      const res = await request(app).get("/api/auth/profile");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Not authorized, no token");
    });

    it("should not get profile with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Not authorized, token failed");
    });
  });

  describe("GET /api/auth/check-username/:username", () => {
    it("should return available for unused username", async () => {
      const res = await request(app).get("/api/auth/check-username/newuser");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.available).toBe(true);
    });

    it("should return unavailable for taken username", async () => {
      // Register user first
      await request(app).post("/api/auth/register").send(testUser);

      const res = await request(app).get(
        `/api/auth/check-username/${testUser.username}`
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.available).toBe(false);
    });

    it("should reject username shorter than 3 chars", async () => {
      const res = await request(app).get("/api/auth/check-username/ab");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.available).toBe(false);
    });
  });
});
