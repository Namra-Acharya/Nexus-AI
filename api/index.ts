import { createServer } from "../server";

// Export the Express app directly; Vercel will invoke it as a handler
const app = createServer();
export default app;
