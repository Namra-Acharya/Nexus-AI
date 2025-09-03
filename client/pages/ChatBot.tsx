import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage, ChatRequest, ChatResponse } from "@shared/chat";
import {
  Send,
  User,
  Bot,
  AlertCircle,
  RefreshCw,
  StopCircle,
  RotateCcw,
  Trash2
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  error?: boolean;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm Nexus, your AI assistant. I can help you with questions, solve problems, provide explanations, assist with tasks, and much more. What can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }
  };

  // Load persisted messages on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nexus_chat_messages");
      if (saved) {
        const parsed = JSON.parse(saved) as (Omit<Message, "timestamp"> & { timestamp: string })[];
        const restored = parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) })) as Message[];
        if (restored.length > 0) setMessages(restored);
      }
    } catch {}
  }, []);

  // Persist messages and keep scroll at bottom
  useEffect(() => {
    try {
      localStorage.setItem("nexus_chat_messages", JSON.stringify(messages));
    } catch {}
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      // Convert UI messages to API format, excluding error messages
      const apiMessages: ChatMessage[] = [...messages, userMessage]
        .filter(msg => msg.type !== 'bot' || !msg.error)
        .filter(msg => msg.content && msg.content.trim().length > 0) // Filter out empty messages
        .map(msg => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content.trim()
        }));

      // Validate that we have at least one message
      if (apiMessages.length === 0) {
        throw new Error('No valid messages to send');
      }

      const requestBody: ChatRequest = {
        messages: apiMessages
      };

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      if (data.success && data.message) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response from AI');
      }
    } catch (error) {
      console.error('Chat error:', error);

      let errorContent = "I'm sorry, I'm experiencing some technical difficulties right now. Please try again in a moment.";

      // Provide more specific error messages based on the error type
      if (error instanceof DOMException && error.name === 'AbortError') {
        errorContent = "Request timed out. The AI service is taking too long to respond. Please try again.";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorContent = "Unable to connect to the AI service. Please check your internet connection and try again.";
      } else if (error instanceof Error && error.message.includes('HTTP error')) {
        errorContent = "The AI service is temporarily unavailable. Please try again in a few moments.";
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: errorContent,
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const retryLastMessage = () => {
    const lastUserMessage = [...messages].reverse().find(msg => msg.type === 'user');
    if (lastUserMessage) {
      setInputMessage(lastUserMessage.content);
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.error) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    }
  };

  const stopGenerating = () => {
    abortControllerRef.current?.abort();
  };

  const regenerateResponse = () => {
    const lastUserIndex = [...messages].map((m, i) => ({ ...m, i })).reverse().find(m => m.type === 'user')?.i;
    const lastBotIndex = [...messages].map((m, i) => ({ ...m, i })).reverse().find(m => m.type === 'bot' && !m.error)?.i;
    if (lastUserIndex != null) {
      const lastUserMsg = messages[lastUserIndex];
      setInputMessage(lastUserMsg.content);
      if (lastBotIndex != null && lastBotIndex > lastUserIndex) {
        setMessages(prev => prev.filter((_, i) => i !== lastBotIndex));
      }
      setTimeout(() => sendMessage(), 0);
    }
  };

  const clearChat = () => {
    const welcome: Message = {
      id: '1',
      type: 'bot',
      content: "Hi! I'm Nexus, your AI assistant. I can help you with questions, solve problems, provide explanations, assist with tasks, and much more. What can I help you with today?",
      timestamp: new Date()
    };
    setMessages([welcome]);
  };


  return (
    <Layout>
      <Seo title="Nexus AI Chat" description="Ask anything and get instant answers, explanations, and help across subjects." path="/chat" />
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-[calc(100dvh-120px)] flex flex-col">
          <Card className="flex-1 flex flex-col bg-white/90 sm:bg-white/80 backdrop-blur-sm border-0 shadow-lg min-h-0">
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 sm:px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nexus AI</p>
                    <p className="text-xs text-gray-500">Ask anything. Get instant help.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center sm:gap-2">
                  {isTyping ? (
                    <Button variant="outline" size="sm" className="h-8" onClick={stopGenerating}>
                      <StopCircle className="w-3.5 h-3.5 mr-1" /> Stop
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="h-8" onClick={regenerateResponse}>
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Regenerate
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="h-8" onClick={clearChat}>
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> New chat
                  </Button>
                </div>
              </div>
              {/* Messages Area */}
              <div ref={listRef} className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 space-y-3 sm:space-y-4 min-h-0 max-h-full overscroll-contain" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'hsl(var(--brand-400)) hsl(var(--muted))'
              }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className="flex flex-col max-w-[85%]">
                      <div
                        onDoubleClick={() => navigator.clipboard && navigator.clipboard.writeText(message.content)}
                        className={`p-4 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-brand-600 text-white'
                            : message.error
                            ? 'bg-red-50 text-red-900 border border-red-200'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.error && (
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-medium text-red-600">Connection Error</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.type === 'user' 
                            ? 'text-brand-100' 
                            : message.error 
                            ? 'text-red-500' 
                            : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      
                      {message.error && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 text-xs h-8"
                          onClick={retryLastMessage}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Retry
                        </Button>
                      )}
                    </div>

                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 p-4 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">Nexus is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                {/* end marker removed; we scroll container instead */}
              </div>


              {/* Input Area */}
              <div className="p-3 sm:p-6 border-t border-gray-200 pb-[calc(env(safe-area-inset-bottom)+12px)]">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder="Ask me anything..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="pr-28 sm:pr-32 rounded-xl border-gray-200 focus:border-brand-500 focus:ring-brand-500 min-h-[52px] sm:min-h-[56px] max-h-40"
                      disabled={isTyping}
                    />
                  </div>
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-brand-600 hover:bg-brand-700 px-5 sm:px-6 py-3 rounded-xl self-end"
                  >
                    {isTyping ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-2 text-center">
                  Press Enter to send • Shift+Enter for new line
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </Layout>
  );
}
