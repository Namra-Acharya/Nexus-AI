import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  StickyNote,
  Search,
  FileText,
  Shield,
  Zap,
  Lightbulb
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import Seo from "@/components/Seo";
import SmartNotes from "./study/SmartNotes";
import DictionaryThesaurus from "./study/DictionaryThesaurus";
import TextSummarizer from "./study/TextSummarizer";

export default function StudyTools() {
  const studyTools = [
    {
      title: "Smart Notes",
      description: "Upload, share, or write notes online with AI organization",
      icon: StickyNote,
      badge: "Essential",
      color: "bg-purple-100 text-purple-700 border-purple-200"
    },
    {
      title: "Dictionary & Thesaurus",
      description: "Comprehensive word definitions and synonyms",
      icon: Search,
      badge: "Reference",
      color: "bg-blue-100 text-blue-700 border-blue-200"
    },
    {
      title: "Text Summarizer",
      description: "Shorten long text and extract key points",
      icon: FileText,
      badge: "AI-Powered",
      color: "bg-green-100 text-green-700 border-green-200"
    }
  ];

  return (
    <Layout>
      <Seo title="Study Tools – Nexus AI" description="Smart Notes, Dictionary & Thesaurus, and Text Summarizer to enhance learning." path="/study-tools" />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Learning Enhancement
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📖 Study Tools
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enhance your learning experience with powerful study aids and academic tools
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyTools.map((tool) => {
              const isNotes = tool.title === "Smart Notes";
              const isDict = tool.title === "Dictionary & Thesaurus";
              const isSumm = tool.title === "Text Summarizer";
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
                    {isNotes ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="brand">Open Notes</Button>
                        </DialogTrigger>
                        <DialogContent className="w-[96vw] sm:w-auto sm:max-w-[90vw] lg:max-w-[1100px] xl:max-w-[1200px] max-h-[92vh] overflow-y-auto">
                          <DialogTitle className="sr-only">Smart Notes</DialogTitle>
                          <SmartNotes />
                        </DialogContent>
                      </Dialog>
                    ) : isDict ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="brand">Open Dictionary</Button>
                        </DialogTrigger>
                        <DialogContent className="w-[96vw] sm:w-auto sm:max-w-[90vw] lg:max-w-[900px] xl:max-w-[1000px] max-h-[92vh] overflow-y-auto">
                          <DialogTitle className="sr-only">Dictionary & Thesaurus</DialogTitle>
                          <DictionaryThesaurus />
                        </DialogContent>
                      </Dialog>
                    ) : isSumm ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="brand">Open Summarizer</Button>
                        </DialogTrigger>
                        <DialogContent className="w-[96vw] sm:w-auto sm:max-w-[90vw] lg:max-w-[1000px] xl:max-w-[1100px] max-h-[92vh] overflow-y-auto">
                          <DialogTitle className="sr-only">Text Summarizer</DialogTitle>
                          <TextSummarizer />
                        </DialogContent>
                      </Dialog>
) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      </div>
    </Layout>
  );
}
