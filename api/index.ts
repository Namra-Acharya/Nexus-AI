import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import route handlers and middleware directly to ensure bundler includes them
import { handleDemo } from "../server/routes/demo";
import { handleChat } from "../server/routes/chat";
import { createGroup, joinGroup, listResources, addResource } from "../server/routes/groups";
import { deleteResource } from "../server/routes/groups.delete";
import { upload, handleUpload, handleDownload } from "../server/routes/files";
import { register, login, me } from "../server/routes/auth";
import { authRequired } from "../server/middleware/auth";

function createServer() {
  const app = express();
  app.set("trust proxy", 1);

  const allowlist = (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
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

  // Health + demo
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);

  // AI Chat
  app.post("/api/chat", handleChat);

  // Auth
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.get("/api/auth/me", authRequired, me);

  // Groups & resources
  app.post("/api/groups", authRequired, createGroup);
  app.post("/api/groups/join", authRequired, joinGroup);
  app.get("/api/groups/:groupId/resources", authRequired, listResources);
  app.post("/api/groups/:groupId/resources", authRequired, addResource);
  app.delete("/api/groups/:groupId/resources/:resId", authRequired, deleteResource);

  // File uploads (GridFS)
  app.post("/api/upload", authRequired, upload.single('file'), handleUpload);
  app.get("/api/files/:id", handleDownload);

  return app;
}

let handler: any;
try {
  const app = createServer();
  handler = serverless(app);
} catch (err) {
  console.error("Failed to initialize server for serverless handler:", err);
  handler = (req: any, res: any) => {
    console.error("Server handler invoked but initialization failed");
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Server initialization error" }));
  };
}

const safeHandler = async (req: any, res: any) => {
  try {
    return await handler(req, res);
  } catch (err) {
    console.error("Unhandled error in serverless handler:", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ success: false, error: "Internal server error" }));
    }
  }
};

export default safeHandler;
