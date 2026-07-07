import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "API Running..." });
});

app.get("/api/test", (_req, res) => {
  res.json({ message: "Server working" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Alphabit-AI API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/chat", aiRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is not defined in server/.env");
    process.exit(1);
  }

  try {
    await connectDB();
  } catch {
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} is already in use.`);
      console.error(
        `   Change PORT in server/.env or run: npm run kill-port --prefix server`
      );
      process.exit(1);
      return;
    }

    console.error(`❌ Server failed to start: ${error.message}`);
    process.exit(1);
  });
}

start().catch((error) => {
  console.error(`❌ Failed to start server: ${error.message}`);
  process.exit(1);
});
