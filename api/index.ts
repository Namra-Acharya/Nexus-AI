import serverless from "serverless-http";
import { createServer } from "../server";

// Wrap Express app with serverless-http for Vercel Node functions
const handler = serverless(createServer());
export default handler;
