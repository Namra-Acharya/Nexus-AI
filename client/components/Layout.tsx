import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Calculator,
  ArrowRightLeft,
  BookOpen,
  Bot,
  Calendar,
  Sparkles,
  MessageCircle,
  Menu,
  X,
  Users,
  ChevronDown
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { AuthActions } from "./auth/AuthActions";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: "/group", label: "Groups", icon: Users },
    { path: "/calculators", label: "Calculators", icon: Calculator },
    { path: "/converters", label: "Converters", icon: ArrowRightLeft },
    { path: "/study-tools", label: "Study Tools", icon: BookOpen },
    { path: "/ai-tools", label: "AI Tools", icon: Bot },
    { path: "/productivity", label: "Productivity", icon: Calendar },
    { path: "/extras", label: "Extras", icon: Sparkles },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-50 via-white to-brand-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-brand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Nexus AI</h1>
                <p className="text-xs text-gray-500">Your Smart Assistant</p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              <Button variant={isActive("/chat") ? "default" : "brand"} size="sm" className="px-4" asChild>
                <Link to="/chat" className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat</span>
                </Link>
              </Button>
              <Button variant={isActive("/group") ? "default" : "ghost"} size="sm" className={isActive("/group")?"bg-brand-600 hover:bg-brand-700":""} asChild>
                <Link to="/group" className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Groups</span>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-brand-300 text-brand-700 hover:bg-brand-50">
                    Tools <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>All Tools</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/calculators" className="flex items-center gap-2"><Calculator className="w-4 h-4" /> Calculators</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/converters" className="flex items-center gap-2"><ArrowRightLeft className="w-4 h-4" /> Converters</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/study-tools" className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Study Tools</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/ai-tools" className="flex items-center gap-2"><Bot className="w-4 h-4" /> AI Tools</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/productivity" className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Productivity</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/extras" className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Extras</Link></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <AuthActions />
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-brand-200">
              <div className="grid grid-cols-2 gap-2">
                <Button variant={isActive("/chat")?"default":"brand"} size="sm" className="justify-start col-span-2" asChild onClick={()=>setIsMobileMenuOpen(false)}>
                  <Link to="/chat" className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat</span>
                  </Link>
                </Button>
                <Button variant={isActive("/group")?"default":"ghost"} size="sm" className={`justify-start ${isActive("/group")?"bg-brand-600 hover:bg-brand-700":""}`} asChild onClick={()=>setIsMobileMenuOpen(false)}>
                  <Link to="/group" className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Groups</span>
                  </Link>
                </Button>
                <Button variant={isActive("/calculators")?"default":"ghost"} size="sm" className={`justify-start ${isActive("/calculators")?"bg-brand-600 hover:bg-brand-700":""}`} asChild onClick={()=>setIsMobileMenuOpen(false)}>
                  <Link to="/calculators" className="flex items-center space-x-2">
                    <Calculator className="w-4 h-4" />
                    <span>Calculators</span>
                  </Link>
                </Button>
                <Button variant={isActive("/converters")?"default":"ghost"} size="sm" className={`justify-start ${isActive("/converters")?"bg-brand-600 hover:bg-brand-700":""}`} asChild onClick={()=>setIsMobileMenuOpen(false)}>
                  <Link to="/converters" className="flex items-center space-x-2">
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Converters</span>
                  </Link>
                </Button>
                <Button variant={isActive("/study-tools")?"default":"ghost"} size="sm" className={`justify-start ${isActive("/study-tools")?"bg-brand-600 hover:bg-brand-700":""}`} asChild onClick={()=>setIsMobileMenuOpen(false)}>
                  <Link to="/study-tools" className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Study Tools</span>
                  </Link>
                </Button>
                <Button variant={isActive("/ai-tools")?"default":"ghost"} size="sm" className={`justify-start ${isActive("/ai-tools")?"bg-brand-600 hover:bg-brand-700":""}`} asChild onClick={()=>setIsMobileMenuOpen(false)}>
                  <Link to="/ai-tools" className="flex items-center space-x-2">
                    <Bot className="w-4 h-4" />
                    <span>AI Tools</span>
                  </Link>
                </Button>
                <Button variant={isActive("/productivity")?"default":"ghost"} size="sm" className={`justify-start ${isActive("/productivity")?"bg-brand-600 hover:bg-brand-700":""}`} asChild onClick={()=>setIsMobileMenuOpen(false)}>
                  <Link to="/productivity" className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Productivity</span>
                  </Link>
                </Button>
                <Button variant={isActive("/extras")?"default":"ghost"} size="sm" className={`justify-start ${isActive("/extras")?"bg-brand-600 hover:bg-brand-700":""}`} asChild onClick={()=>setIsMobileMenuOpen(false)}>
                  <Link to="/extras" className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Extras</span>
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
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
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/support" className="hover:text-white transition-colors">Support</Link>
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
