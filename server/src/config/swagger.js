import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Football Shirt Collection API",
      version: "1.0.0",
      description: "API for managing football shirt collections, wishlists, and user authentication",
      contact: {
        name: "Semih Kececioglu",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            name: { type: "string", example: "John Doe" },
            username: { type: "string", example: "johndoe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            avatar: { type: "string", example: "https://example.com/avatar.jpg" },
            authProvider: { type: "string", enum: ["local", "google"] },
            isProfileComplete: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Shirt: {
          type: "object",
          properties: {
            _id: { type: "string" },
            teamName: { type: "string", example: "Manchester United" },
            season: { type: "string", example: "2023/24" },
            type: { type: "string", enum: ["home", "away", "third", "fourth", "fifth", "goalkeeper", "special", "anniversary"] },
            brand: { type: "string", example: "Adidas" },
            size: { type: "string", enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "+4XL"] },
            condition: { type: "string", enum: ["brandNewTags", "brandNew", "mint", "excellent", "good", "fair", "poor"] },
            playerName: { type: "string", example: "Rashford" },
            playerNumber: { type: "integer", example: 10 },
            purchasePrice: { type: "number", example: 89.99 },
            currentValue: { type: "number", example: 120.00 },
            images: { type: "array", items: { type: "string" } },
            isFavorite: { type: "boolean" },
          },
        },
        WishlistItem: {
          type: "object",
          properties: {
            _id: { type: "string" },
            teamName: { type: "string", example: "Real Madrid" },
            season: { type: "string", example: "2024/25" },
            type: { type: "string" },
            priority: { type: "string", enum: ["low", "medium", "high"] },
            notes: { type: "string" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Shirts", description: "Shirt collection management" },
      { name: "Wishlist", description: "Wishlist management" },
      { name: "Stats", description: "Collection statistics" },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
