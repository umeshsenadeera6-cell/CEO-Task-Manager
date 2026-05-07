"use client";

import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color: string;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, color }: StatCardProps) {
  return (
    <Card className="p-6 rounded-2xl border-none shadow-sm hover:shadow-md transition-all duration-300 glass group">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-xl", color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full",
            trendUp ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          )}>
            {trend}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</h3>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
      </div>
    </Card>
  );
}
