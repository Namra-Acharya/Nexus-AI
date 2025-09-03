import serverless from "serverless-http";
import { createServer } from "../server";

// Export a Vercel-compatible serverless function that wraps our Express app
const handler = serverless(createServer());
export default handler;
