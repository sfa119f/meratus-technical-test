import dotenv from "dotenv";
import app from "./app";
import { prisma } from "./database/connection";

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3000;

// Start server
const server = app.listen(port, () => {
  console.log(`🚀 Order Management API is running on http://localhost:${port}`);
  console.log(
    `📚 API Documentation available at http://localhost:${port}/api-docs`
  );
  console.log(`🔍 Health check available at http://localhost:${port}/health`);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received, shutting down gracefully...`);

  server.close(async () => {
    console.log("HTTP server closed");

    try {
      await prisma.$disconnect();
      console.log("Database connection closed");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default server;
