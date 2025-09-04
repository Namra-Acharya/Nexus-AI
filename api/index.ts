import { createServer } from "../server";

// Export Express app directly for Vercel Node functions compatibility
const app = createServer();
export default app;
