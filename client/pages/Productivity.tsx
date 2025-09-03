import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CheckSquare,
  Search,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import ToDoList from "./productivity/ToDoList";
import GlobalSearch from "./productivity/GlobalSearch";
import GroupHub from "./productivity/GroupHub";
import { useEffect, useMemo, useState } from "react";
import Seo from "@/components/Seo";

export default function Productivity() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [initialQ, setInitialQ] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#search')) {
      const params = new URLSearchParams(window.location.hash.split('?')[1] || "");
      const q = params.get('q') || "";
      setInitialQ(q);
      setSearchOpen(true);
    }
  }, []);

  const productivityTools = [
    {
      title: "To-Do List Manager",
      description: "Organize tasks with smart prioritization and reminders",
      icon: CheckSquare,
      badge: "Essential",
      color: "bg-green-100 text-green-700 border-green-200"
    },
    {
      title: "Global Search",
      description: "Search the web or YouTube",
      icon: Search,
      badge: "Utility",
      color: "bg-purple-100 text-purple-700 border-purple-200"
    }
  ];

  return (
    <Layout>
      <Seo title="Productivity – Nexus AI" description="To‑Do manager and global search to keep you organized and fast." path="/productivity" />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Calendar className="w-4 h-4" />
              Productivity & Organization
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📅 Productivity
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay organized, focused, and on track with powerful productivity tools designed for students
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productivityTools.map((tool, index) => (
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
                  {tool.title === "To-Do List Manager" ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" variant="brand">Open To-Do List</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                        <DialogTitle className="sr-only">To-Do List</DialogTitle>
                        <ToDoList />
                      </DialogContent>
                    </Dialog>
                  ) : tool.title === "Global Search" ? (
                    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full" variant="brand">Open Search</Button>
                      </DialogTrigger>
                      <DialogContent className="w-[96vw] sm:w-auto sm:max-w-[90vw] lg:max-w-[900px] xl:max-w-[1000px] max-h-[90vh] overflow-y-auto">
                        <DialogTitle className="sr-only">Global Search</DialogTitle>
                        <GlobalSearch initialQuery={initialQ} />
                      </DialogContent>
                    </Dialog>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Productivity Tips Section */}
          <div className="mt-16 bg-gradient-to-r from-pink-500 to-pink-700 rounded-2xl p-8 text-white text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Target className="w-4 h-4" />
              Productivity Tips
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Master Your Study Routine
            </h2>
            <p className="text-xl text-pink-100 mb-6 max-w-2xl mx-auto">
              Learn proven techniques and strategies to maximize your productivity, 
              manage time effectively, and achieve your academic goals.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Time Blocking</h3>
                <p className="text-sm text-pink-100">Schedule specific blocks for different subjects</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Active Recall</h3>
                <p className="text-sm text-pink-100">Test yourself regularly to improve retention</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Spaced Repetition</h3>
                <p className="text-sm text-pink-100">Review material at increasing intervals</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
