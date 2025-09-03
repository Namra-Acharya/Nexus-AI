import { RequestHandler } from "express";
import 'dotenv/config';
import { Mistral } from "@mistralai/mistralai";

const openrouterKey = process.env.OPENROUTER_API_KEY;
const mistralKey = process.env.MISTRAL_API_KEY;
const model = "mistral-large-latest";

const client = mistralKey ? new Mistral({ apiKey: mistralKey }) : null;

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
  const lowercaseMessage = userMessage.toLowerCase();

  // Math-related responses
  if (lowercaseMessage.includes('math') || lowercaseMessage.includes('calculate') || lowercaseMessage.includes('equation')) {
    return "I'd be happy to help you with math! I can assist with algebra, calculus, geometry, statistics, and more. What specific math problem or concept would you like help with? Feel free to share the equation or problem you're working on.";
  }

  // Programming-related responses
  if (lowercaseMessage.includes('code') || lowercaseMessage.includes('programming') || lowercaseMessage.includes('python') || lowercaseMessage.includes('javascript')) {
    return "Great! I love helping with programming. I can assist with Python, JavaScript, HTML/CSS, React, and many other languages. What programming challenge are you facing? Share your code and I'll help debug it or explain concepts step by step.";
  }

  // Learning and productivity responses
  if (lowercaseMessage.includes('learn') || lowercaseMessage.includes('tips') || lowercaseMessage.includes('productive')) {
    return "Here are some effective learning and productivity techniques:\n\n1. **Break tasks into smaller chunks** - Makes large projects manageable\n2. **Use the Pomodoro Technique** - Work in focused 25-minute sessions\n3. **Active engagement** - Take notes, ask questions, practice regularly\n4. **Set clear goals** - Define what you want to achieve\n5. **Regular breaks** - Help maintain focus and prevent burnout\n\nWhat specific area would you like to improve or learn about?";
  }

  // Science-related responses
  if (lowercaseMessage.includes('science') || lowercaseMessage.includes('physics') || lowercaseMessage.includes('chemistry') || lowercaseMessage.includes('biology')) {
    return "Science is fascinating! I can help explain complex scientific concepts in simple terms. Whether it's physics formulas, chemical reactions, biological processes, or scientific methods - I'm here to break it down step by step. What specific science topic interests you?";
  }

  // Writing help
  if (lowercaseMessage.includes('write') || lowercaseMessage.includes('writing') || lowercaseMessage.includes('essay')) {
    return "I can definitely help with writing! Here's my approach:\n\n1. **Clear structure** - Organize your ideas logically\n2. **Strong opening** - Hook your readers from the start\n3. **Supporting evidence** - Back up your points with examples\n4. **Smooth transitions** - Connect your ideas seamlessly\n5. **Revision and editing** - Polish your work for clarity\n\nWhat type of writing project are you working on? I can provide specific guidance!";
  }

  // General greeting responses
  if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hey')) {
    return "Hello! I'm Nexus, your AI assistant. I'm here to help with a wide variety of tasks - from answering questions and solving problems to providing explanations and creative assistance. What can I help you with today?";
  }

  // Default helpful response
  return "That's an interesting question! I'm here to help with a wide variety of topics and tasks. Could you provide a bit more detail about what you're looking for? Whether it's answering questions, solving problems, explaining concepts, or creative assistance - I'm ready to help!";
};

export const handleChat: RequestHandler = async (req, res) => {
  try {
    const { messages }: ChatRequest = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Messages array is required and cannot be empty",
        message: ""
      });
    }

    // Get the last user message for generating response
    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage?.content || "";

    try {
      // Add system prompt for general-purpose AI assistant behavior
      const systemMessage: ChatMessage = {
        role: "system",
        content: `You are Nexus, an advanced AI assistant designed to help with a wide variety of tasks and questions. Your personality traits:

- Intelligent and knowledgeable across many domains
- Helpful and supportive in all interactions
- Clear and articulate in explanations
- Adaptable to different types of conversations and needs
- Professional yet approachable

Your capabilities include:
- Answering questions on virtually any topic
- Helping with writing, editing, and creative tasks
- Providing explanations and tutorials
- Assisting with problem-solving and analysis
- Offering advice and suggestions
- Engaging in thoughtful conversations
- Supporting productivity and organization
- Helping with technical and programming tasks

Always:
- Provide accurate and helpful information
- Be clear and concise in your responses
- Adapt your communication style to the user's needs
- Offer practical solutions and actionable advice
- Be honest about limitations or uncertainties
- Maintain a friendly and professional tone

Never:
- Provide harmful, illegal, or unethical advice
- Make up information when uncertain
- Be dismissive or condescending
- Share personal information or make assumptions about users`
      };

      // Prepare OpenAI-style messages
      const apiMessages = [systemMessage, ...messages].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Prefer OpenRouter if configured
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
            body: JSON.stringify({ model: orModel, messages: apiMessages })
          });

          if (!resp.ok) throw new Error(`OpenRouter error: ${resp.status}`);
          const data = await resp.json();
          const responseContent = data.choices?.[0]?.message?.content;
          if (responseContent) {
            return res.json({ success: true, message: responseContent });
          }
          throw new Error("No response content from OpenRouter");
        } catch (e) {
          console.warn("OpenRouter failed, attempting Mistral fallback", e);
        }
      }

      // Fallback to Mistral if available
      if (client) {
        try {
          const chatResponse = await client.chat.complete({
            model,
            messages: apiMessages,
            temperature: 0.7,
            maxTokens: 1000,
          });
          const responseContent = chatResponse.choices?.[0]?.message?.content;
          if (responseContent) {
            return res.json({ success: true, message: responseContent });
          }
          throw new Error("No response content received from Mistral AI");
        } catch (e) {
          console.warn("Mistral failed, using local fallback", e);
        }
      }

      // Final local fallback
      const fallbackResponse = generateFallbackResponse(userMessage);
      return res.json({ success: true, message: fallbackResponse });

    } catch (apiError) {
      // Outer catch for unexpected errors
      console.error("Chat handler error:", apiError);
      const fallbackResponse = generateFallbackResponse(userMessage);
      res.json({ success: true, message: fallbackResponse });
    }

  } catch (error) {
    console.error("Chat API Error:", error);

    // Ensure we don't send a response if one was already sent
    if (res.headersSent) {
      return;
    }

    // Send a fallback response
    res.status(500).json({
      success: false,
      error: "I'm experiencing some technical difficulties right now. Please try again in a moment.",
      message: "I apologize, but I'm having trouble processing your request at the moment. Please try asking your question again, and I'll do my best to help you!"
    });
  }
};
