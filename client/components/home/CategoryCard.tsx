import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

export interface CategoryItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string; // utility classes for icon bubble
  features: string[];
}

interface Props {
  category: CategoryItem;
  index: number;
}

export function CategoryCard({ category, index }: Props) {
  return (
    <Link to={`/${category.id}`} className="group block focus:outline-none" aria-label={category.title}>
      <div
        className="relative rounded-2xl p-[1px] bg-gradient-to-br from-brand-200/70 to-transparent hover:from-brand-300 hover:to-brand-100 transition-all duration-300 animate-slide-up"
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        <Card className="relative rounded-[1rem] border border-brand-100 bg-white/90 sm:bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 group-hover:bg-white group-hover:-translate-y-1 group-hover:shadow-2xl">
          <CardHeader className="p-4 sm:p-6 pb-3 relative">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className={`p-2.5 sm:p-3 rounded-xl ${category.color}`}>
                <category.icon className="w-6 h-6" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
              </div>
            </div>
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">{category.title}</CardTitle>
            <CardDescription className="text-gray-600 text-sm sm:text-base">{category.description}</CardDescription>
            <div className="absolute right-4 top-4 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-200">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xs sm:text-sm text-gray-500">
              Tap to explore
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
