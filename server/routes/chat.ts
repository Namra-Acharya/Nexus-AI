import { RequestHandler } from "express";

// Avoid running potentially-failing imports at module-load time in serverless environments.
// We'll lazy-load external SDKs (Mistral) and polyfills inside the handler to prevent crashes
// during module initialization.

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  success: boolean;
  error?: string;
}

// Fallback AI responses for testing
const generateFallbackResponse = (userMessage: string): string => {
  const lowercaseMessage = (userMessage || "").toLowerCase();

  if (!lowercaseMessage) return "Hi — what can I help you with today?";

  if (lowercaseMessage.includes('math') || lowercaseMessage.includes('calculate') || lowercaseMessage.includes('equation')) {
    return "I'd be happy to help you with math! Please share the specific problem or equation.";
  }

  if (lowercaseMessage.includes('code') || lowercaseMessage.includes('programming') || lowercaseMessage.includes('python') || lowercaseMessage.includes('javascript')) {
    return "I can help with programming questions. Share the code or error and I'll assist.";
  }

  if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hey')) {
    return "Hello! I'm Nexus, your AI assistant. What can I help you with today?";
  }

  return "Thanks for your question — can you provide a bit more detail?";
};

// Safe helper to ensure fetch is available in this environment
async function ensureFetch() {
  if (typeof globalThis.fetch === 'function') return;
  try {
    // Dynamically import node-fetch only if needed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { default: fetch } = await import('node-fetch');
    // @ts-ignore
    globalThis.fetch = fetch;
  } catch (e) {
    console.warn('Could not polyfill fetch; remote API calls may fail', e);
  }
}

export const handleChat: RequestHandler = async (req, res) => {
  // Wrap everything in a top-level try/catch to prevent crashes
  try {
    const { messages }: ChatRequest = (req.body ?? {}) as ChatRequest;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, error: "Messages array is required and cannot be empty", message: "" });
    }

    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage?.content || "";

    // Build system message
    const systemMessage: ChatMessage = {
      role: "system",
      content: `You are Nexus, an advanced AI assistant designed to help with a wide variety of tasks and questions. Be helpful, concise and safe.`,
    };

    const apiMessages = [systemMessage, ...messages].map(m => ({ role: m.role, content: m.content }));

    // Ensure fetch exists before making outbound HTTP calls
    await ensureFetch();

    // Try OpenRouter if configured
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    if (openrouterKey) {
      try {
        const orModel = process.env.OPENROUTER_MODEL || "mistralai/mistral-7b-instruct:free";
        const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openrouterKey}`,
            "Content-Type": "application/json",
            ...(process.env.SITE_URL ? { "HTTP-Referer": process.env.SITE_URL } : {}),
            ...(process.env.SITE_TITLE ? { "X-Title": process.env.SITE_TITLE } : {}),
          },
          body: JSON.stringify({ model: orModel, messages: apiMessages }),
          // timeout not available on global fetch; rely on platform
        });

        if (!resp.ok) {
          const txt = await resp.text().catch(() => "(no body)");
          console.warn(`OpenRouter returned non-ok status ${resp.status}: ${txt}`);
          throw new Error(`OpenRouter status ${resp.status}`);
        }

        const data = await resp.json().catch(() => null);
        const responseContent = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || null;
        if (responseContent) {
          return res.json({ success: true, message: responseContent });
        }
        console.warn('OpenRouter response did not contain content, falling back.');
      } catch (e) {
        console.warn('OpenRouter call failed:', e);
      }
    }

    // Try Mistral SDK only if API key is present — lazy-load to avoid import-time crashes
    const mistralKey = process.env.MISTRAL_API_KEY;
    if (mistralKey) {
      try {
        const { Mistral } = await import('@mistralai/mistralai');
        const client = new Mistral({ apiKey: mistralKey });
        const model = process.env.MISTRAL_MODEL || 'mistral-large-latest';

        try {
          // Some SDKs return different shapes; be defensive
          const chatResponse: any = await client.chat.complete({ model, messages: apiMessages, temperature: 0.7, maxTokens: 1000 });
          const responseContent = chatResponse?.choices?.[0]?.message?.content || chatResponse?.output || null;
          if (responseContent) return res.json({ success: true, message: responseContent });
          console.warn('Mistral returned no content, falling back.');
        } catch (innerErr) {
          console.warn('Mistral client call failed:', innerErr);
        }
      } catch (e) {
        console.warn('Failed to load or initialize Mistral SDK:', e);
      }
    }

    // Final local fallback
    const fallbackResponse = generateFallbackResponse(userMessage);
    return res.json({ success: true, message: fallbackResponse });

  } catch (error) {
    console.error('Unhandled error in /api/chat:', error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
};
