import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  QrCode,
  Smile,
  FileText,
  Zap,
  Gift,
  Star
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import QRCodeGenerator from "./extras/QRCodeGenerator";
import MemeQuoteGenerator from "./extras/MemeQuoteGenerator";
import QuickExport from "./extras/QuickExport";
import Seo from "@/components/Seo";

export default function Extras() {
  const extraTools = [
    {
      title: "QR Code Generator",
      description: "Quickly generate QR codes for sharing links and notes",
      icon: QrCode,
      badge: "Popular",
      color: "bg-indigo-100 text-indigo-700 border-indigo-200"
    },
    {
      title: "Meme & Quote Generator",
      description: "Create fun memes and motivational quotes",
      icon: Smile,
      badge: "Fun",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200"
    },
    {
      title: "Quick Export",
      description: "Paste any answer → export PDF/DOCX/MD",
      icon: FileText,
      badge: "New",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200"
    }
  ];

  const funFeatures = [
    "Daily Study Motivation",
    "Progress Celebrations",
    "Achievement Badges",
    "Study Streak Rewards",
    "Personalized Quotes",
    "Study Buddy Matching"
  ];

  return (
    <Layout>
      <Seo title="Extra Features – Nexus AI" description="QR codes, memes, quick export and more to make studying fun." path="/extras" />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Extra Features & Fun Tools
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎓 Extra Features
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fun and useful tools that make studying more enjoyable and help you stay motivated
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extraTools.map((tool) => {
              const isQR = tool.title === "QR Code Generator";
              const isMeme = tool.title === "Meme & Quote Generator";
              const isExport = tool.title === "Quick Export";
              return (
                <Card
                  key={tool.title}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-xl ${tool.color}`}>
                        <tool.icon className="w-6 h-6" />
                      </div>
                      <Badge variant="secondary">{tool.badge}</Badge>
                    </div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isQR ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="brand">
                            Open Generator
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[96vw] max-w-[96vw] sm:max-w-3xl">
                          <DialogTitle className="sr-only">QR Code Generator</DialogTitle>
                          <QRCodeGenerator />
                        </DialogContent>
                      </Dialog>
                    ) : isMeme ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="brand">
                            Open Generator
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[96vw] max-w-[96vw] sm:max-w-5xl">
                          <DialogTitle className="sr-only">Meme & Quote Generator</DialogTitle>
                          <MemeQuoteGenerator />
                        </DialogContent>
                      </Dialog>
                    ) : isExport ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="brand">
                            Open Exporter
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[96vw] max-w-[96vw] sm:max-w-3xl">
                          <DialogTitle className="sr-only">Quick Export</DialogTitle>
                          <QuickExport />
                        </DialogContent>
                      </Dialog>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Fun Features Section */}
          <div className="mt-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Gift className="w-4 h-4" />
              Motivation & Gamification
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Make Studying Fun & Rewarding
            </h2>
            <p className="text-xl text-indigo-100 mb-6 max-w-2xl mx-auto">
              Discover features designed to keep you motivated, engaged, 
              and excited about your learning journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {funFeatures.map((feature, index) => (
                <div key={feature} className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-300" />
                    <span className="font-medium">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student-Favorite Tools */}
          <div className="mt-16 text-center bg-white/50 rounded-2xl p-8">
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Most Requested
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tools Students Love Most
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Based on student feedback, these are the extra features that make the biggest 
              difference in academic success and study enjoyment.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Badge variant="outline">Note Templates</Badge>
              <Badge variant="outline">Study Music</Badge>
              <Badge variant="outline">Break Reminders</Badge>
              <Badge variant="outline">Focus Sounds</Badge>
              <Badge variant="outline">Collaboration Tools</Badge>
              <Badge variant="outline">Study Groups</Badge>
              <Badge variant="outline">Virtual Study Rooms</Badge>
              <Badge variant="outline">Peer Reviews</Badge>
            </div>
            <Button className="bg-brand-600 hover:bg-brand-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Vote for Next Feature
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
