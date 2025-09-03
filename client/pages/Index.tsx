import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calculator,
  ArrowRightLeft,
  BookOpen,
  Bot,
  Calendar,
  Sparkles,
  Search,
  MessageCircle,
  Lightbulb,
  GraduationCap,
  Zap,
  Stars,
  ChevronRight,
  Play,
  Users,
} from "lucide-react";
import { FeaturedCard } from "@/components/home/FeaturedCard";
import { CategoryCard } from "@/components/home/CategoryCard";
import { useAuth } from "@/context/AuthContext";
import Seo from "@/components/Seo";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const categories = [
    {
      id: "ai-tools",
      title: "🤖 AI-Powered Tools",
      description: "Intelligent assistance for everything",
      icon: Bot,
      color: "bg-orange-100 text-orange-700 border-orange-200",
      features: [
        "AI Study Assistant",
        "Essay Rewriter",
        "Code Helper",
        "AI Translator",
        "Smart Q&A",
      ],
    },
    {
      id: "study-tools",
      title: "📖 Study Tools",
      description: "Enhance your learning experience",
      icon: BookOpen,
      color: "bg-purple-100 text-purple-700 border-purple-200",
      features: ["Smart Notes", "Dictionary & Thesaurus", "Text Summarizer"],
    },
    {
      id: "productivity",
      title: "📅 Productivity",
      description: "Stay organized and focused",
      icon: Calendar,
      color: "bg-pink-100 text-pink-700 border-pink-200",
      features: ["To-Do List", "Global Search", "Quick Notes"],
    },
    {
      id: "calculators",
      title: "🔢 Calculators",
      description: "All calculation tools you need",
      icon: Calculator,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      features: [
        "Normal Calculator",
        "Scientific Calculator",
        "GPA/CGPA Calculator",
        "Percentage & Grade Calculator",
        "Age Calculator",
      ],
    },
    {
      id: "converters",
      title: "🌍 Converters",
      description: "Convert anything to anything",
      icon: ArrowRightLeft,
      color: "bg-green-100 text-green-700 border-green-200",
      features: ["Unit Converters", "Temperature Converter", "File Converter"],
    },
    {
      id: "extras",
      title: "🎓 Extra Features",
      description: "Fun and useful student tools",
      icon: Sparkles,
      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
      features: ["QR Code Generator", "Meme Generator"],
    },
  ];

  const normalized = searchQuery.trim().toLowerCase();
  const filteredCategories = normalized
    ? categories.filter(
        (c) =>
          c.title.toLowerCase().includes(normalized) ||
          (c.features || []).some((f) => f.toLowerCase().includes(normalized))
      )
    : categories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      <Seo title="Nexus AI – Your AI-Powered Smart Assistant" description="AI chat, study tools, calculators, converters, and productivity features built for students." path="/" image="/placeholder.svg" />
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-brand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Nexus AI</h1>
                <p className="text-xs text-gray-500">Your Smart Assistant</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <a href="#features">Tools</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/group">Groups</Link>
              </Button>
              {!user ? (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Sign in</Link>
                  </Button>
                  <Button variant="brand" size="sm" asChild>
                    <Link to="/signup">Create account</Link>
                  </Button>
                </>
              ) : (
                <Button size="sm" className="bg-brand-600 hover:bg-brand-700" asChild>
                  <Link to="/chat">Get Started</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Powered by Advanced AI
              <Badge variant="secondary" className="bg-brand-200 text-brand-900">
                NEW
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Your AI-Powered
              <span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent block">
                Smart Assistant
              </span>
            </h1>

            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed px-2">
              Meet Nexus - your intelligent AI companion with powerful tools for calculations,
              conversions, productivity, and much more. Everything you need to work smarter and get things done.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-10 sm:mb-12 px-4">
              <Button
                size="lg"
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                asChild
              >
                <Link to={user ? "/chat" : "/login"}>
                  <Play className="w-5 h-5 mr-2" />
                  Start Using Nexus
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-brand-300 text-brand-700 hover:bg-brand-50 px-6 py-3 rounded-xl text-base sm:text-lg font-semibold w-full sm:w-auto"
                asChild
              >
                <Link to="/group">
                  <Users className="w-5 h-5 mr-2" />
                  Go to Groups
                </Link>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-full sm:max-w-2xl sm:mx-auto mx-0 relative px-4 text-left">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for any tool or ask a question..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { window.location.href = `/productivity#search?q=${encodeURIComponent(searchQuery)}`; } }}
                  className="pl-12 pr-12 h-12 sm:h-14 text-base sm:text-lg rounded-full border-brand-200 bg-white/95 sm:bg-white/80 shadow-sm"
                />
                <Button size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand-600 hover:bg-brand-700 rounded-lg h-9 w-9 p-0 items-center justify-center flex" onClick={() => { window.location.href = `/productivity#search?q=${encodeURIComponent(searchQuery)}`; }}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Groups Spotlight */}
      <section className="py-8 sm:py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0 justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold">Study together in Groups</h3>
              <p className="text-blue-100">Create a group, share notes, links, and files in one place.</p>
            </div>
            <Button variant="brand" asChild className="w-full md:w-auto bg-white text-blue-700 hover:bg-blue-50">
              <Link to="/group">Open Group Hub</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to <span className="text-brand-600">Excel</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive suite of AI-powered tools designed specifically for students
            </p>
          </div>

          {!normalized && (
            <div className="mb-8 sm:mb-12 px-4">
              <div className="flex items-center justify-between mb-4 px-4 sm:px-0">
                <h3 className="text-lg font-semibold text-gray-900">Featured</h3>
                <span className="text-sm text-gray-500">Most used by students</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <FeaturedCard
                  to="/chat"
                  title="Nexus AI Chat"
                  description="Ask anything, get instant answers, explanations, and help across subjects."
                  icon={MessageCircle}
                  gradientFrom="from-brand-600"
                  gradientTo="to-brand-800"
                  cta="Open Chat"
                  badge="Top pick"
                />
                <FeaturedCard
                  to="/group"
                  title="Study Group Hub"
                  description="Create or join groups, share notes, links, and files with your classmates."
                  icon={Users}
                  gradientFrom="from-blue-600"
                  gradientTo="to-indigo-700"
                  cta="Open Groups"
                  badge="Collaboration"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-3 sm:mb-4 px-4 sm:px-0">
            <h3 className="text-lg font-semibold text-gray-900">Browse tools</h3>
            {normalized ? (
              <span className="text-sm text-gray-500">
                Showing results for "{searchQuery}"
              </span>
            ) : (
              <span className="text-sm text-gray-500">All categories</span>
            )}
          </div>

          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
              {filteredCategories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />)
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
              <div className="mx-auto mb-2 w-10 h-10 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-gray-900 font-medium">No tools found</p>
              <p className="text-gray-500 text-sm">
                Try different keywords like "calculator", "notes", or "converter".
              </p>
            </div>
          )}
        </div>
      </section>

      {/* AI Chat Section */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-brand-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Stars className="w-4 h-4" />
              AI-Powered Intelligence
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Chat with Your AI Assistant
            </h2>

            <p className="text-xl text-brand-100 mb-8 leading-relaxed">
              Ask questions, get explanations, solve problems, and get help with any task.
              Our AI understands your needs and provides personalized assistance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-brand-50 px-8 py-3 rounded-xl text-lg font-semibold" asChild>
                <Link to="/chat">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start Chatting
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white px-8 py-3 rounded-xl text-lg font-semibold"
                asChild
              >
                <Link to="/ai-tools">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  See Examples
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Nexus AI</span>
            </div>
            <p className="text-gray-400 mb-6">
              Empowering everyone with AI-powered tools for productivity and success
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/support" className="hover:text-white transition-colors">
                Support
              </Link>
              <Link to="/about" className="hover:text-white transition-colors">
                About
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
