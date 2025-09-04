import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { handleDemo } from "./routes/demo";
import { handleChat } from "./routes/chat";
import { createGroup, joinGroup, listResources, addResource } from "./routes/groups";
import { deleteResource } from "./routes/groups.delete";
import { upload, handleUpload, handleDownload } from "./routes/files";
import { register, login, me } from "./routes/auth";
import { authRequired } from "./middleware/auth";

export function createServer() {
  const app = express();
  app.set('trust proxy', 1);

  // Security & middleware
  const allowlist = (process.env.ALLOWED_ORIGINS || "").split(",").map(s=>s.trim()).filter(Boolean);
  const corsOptions: cors.CorsOptions = {
    origin(origin, callback){
      if (!origin) return callback(null, true);
      if (allowlist.length === 0) return callback(null, true);
      if (allowlist.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  };
  app.use(cors(corsOptions));
  const isProd = process.env.NODE_ENV === 'production';
  app.use(helmet(isProd ? {} : { contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  const limiter = rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false });
  app.use('/api/', limiter);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // AI Chat endpoint
  app.post("/api/chat", handleChat);

  // Auth
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.get("/api/auth/me", authRequired, me);

  // Groups & shared resources (auth required)
  app.post("/api/groups", authRequired, createGroup);
  app.post("/api/groups/join", authRequired, joinGroup);
  app.get("/api/groups/:groupId/resources", authRequired, listResources);
  app.post("/api/groups/:groupId/resources", authRequired, addResource);
  app.delete("/api/groups/:groupId/resources/:resId", authRequired, deleteResource);

  // File uploads (GridFS)
  app.post("/api/upload", authRequired, upload.single('file'), handleUpload);
  app.get("/api/files/:id", handleDownload);

  // Health check for dev server and integrations
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  return app;
}
