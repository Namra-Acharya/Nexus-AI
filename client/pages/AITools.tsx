import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  MessageCircle, 
  FileEdit, 
  Code, 
  Languages, 
  Zap,
  Sparkles,
  Brain
} from "lucide-react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import Translator from "./ai/Translator";

export default function AITools() {
  const aiTools = [
    {
      title: "AI Study Assistant",
      description: "Get personalized help with any subject or topic",
      icon: MessageCircle,
      badge: "Featured",
      color: "bg-blue-100 text-blue-700 border-blue-200",
      available: true,
      link: "/chat"
    },
    {
      title: "AI Translator",
      description: "Multi-language text translation with context",
      icon: Languages,
      badge: "Language",
      color: "bg-orange-100 text-orange-700 border-orange-200",
      available: true
    }
  ];

  return (
    <Layout>
      <Seo title="AI Tools – Nexus AI" description="AI chat, translator, and smart assistants for learning and productivity." path="/ai-tools" />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Bot className="w-4 h-4" />
              AI-Powered Intelligence
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🤖 AI-Powered Tools
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Intelligent assistance powered by advanced AI to help you learn, create, and solve problems
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiTools.map((tool, index) => (
              <Card 
                key={tool.title}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-xl ${tool.color}`}>
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <Badge variant={tool.available ? "default" : "secondary"}>
                      {tool.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {tool.title === "AI Study Assistant" ? (
                    <Button
                      className="w-full bg-brand-600 hover:bg-brand-700"
                      asChild
                    >
                      <Link to={tool.link!}>
                        Start Using
                      </Link>
                    </Button>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" variant="brand">Open Translator</Button>
                      </DialogTrigger>
                      <DialogContent className="w-[96vw] max-w-[96vw] sm:max-w-3xl">
                        <DialogTitle className="sr-only">AI Translator</DialogTitle>
                        <Translator />
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Featured AI Chat Section */}
          <div className="mt-16 bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 text-white text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Available Now
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Chat with Your AI Study Buddy
            </h2>
            <p className="text-xl text-brand-100 mb-6 max-w-2xl mx-auto">
              Get instant help with homework, explanations of complex topics, 
              study tips, and personalized learning guidance.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-brand-700 hover:bg-brand-50 px-8 py-3 rounded-xl text-lg font-semibold"
              asChild
            >
              <Link to="/chat">
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chatting Now
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </Layout>
  );
}
