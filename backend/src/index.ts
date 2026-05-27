import "dotenv/config";
import express from "express";
import cors from "cors";
import { todosRouter } from "./routes/todos.route.js";
import { categoriesRouter } from "./routes/categories.route.js";
import { prisma } from "./db.js";
import { HttpStatus } from "./types/enums/http-status.enum.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());

app.use("/todos", todosRouter);
app.use("/categories", categoriesRouter);

app.get("/health", (_req, res) => {
  res
    .status(HttpStatus.OK)
    .json({ status: "ok", timestamp: new Date().toISOString() });
});

const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

async function shutdown(signal: string): Promise<void> {
  console.log(`\n${signal} received — shutting down gracefully...`);

  server.close(async (err) => {
    if (err) {
      console.error("Error closing HTTP server:", err);
      process.exit(1);
    }

    try {
      await prisma.$disconnect();
      console.log("DB disconnected.");
      process.exit(0);
    } catch (disconnectErr) {
      console.error("Error disconnecting DB:", disconnectErr);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error("Shutdown timeout exceeded — forcing exit.");
    process.exit(1);
  }, 10_000).unref();
}
