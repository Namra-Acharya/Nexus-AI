import serverless from "serverless-http";
import { createServer } from "../server/index";

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

// Wrap the handler to catch unexpected runtime errors and log them
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
