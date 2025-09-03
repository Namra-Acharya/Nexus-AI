import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface FeaturedCardProps {
  to: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  cta?: string;
  badge?: string;
}

export function FeaturedCard({ to, title, description, icon: Icon, gradientFrom, gradientTo, cta = "Open", badge }: FeaturedCardProps) {
  return (
    <Card className={`relative overflow-hidden rounded-2xl border-0 shadow-lg bg-gradient-to-r ${gradientFrom} ${gradientTo}`}>
      <div className="relative p-5 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 p-3 rounded-xl bg-white/20 backdrop-blur">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              {badge ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20">
                  {badge}
                </span>
              ) : null}
            </div>
            <h3 className="text-xl sm:text-3xl font-bold leading-tight">{title}</h3>
            <p className="text-white/90 mt-2 max-w-xl text-sm sm:text-base">{description}</p>
          </div>
        </div>
        <Button size="lg" asChild className="w-full sm:w-auto bg-white text-gray-900 hover:bg-white/90">
          <Link to={to}>{cta}</Link>
        </Button>
      </div>
    </Card>
  );
}
