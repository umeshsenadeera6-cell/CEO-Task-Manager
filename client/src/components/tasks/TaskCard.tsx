"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MessageSquare, Paperclip } from "lucide-react";
import { Task } from "@/types";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Partial<Task>;
}

export function TaskCard({ task }: TaskCardProps) {
  const priorityColor = {
    LOW: "bg-blue-500",
    MEDIUM: "bg-primary",
    HIGH: "bg-orange-500",
    URGENT: "bg-red-500",
  }[task.priority || "MEDIUM"];

  return (
    <Card className="p-4 rounded-xl border-none glass hover:shadow-xl transition-all duration-300 cursor-grab active:cursor-grabbing group">
      <div className="flex items-center justify-between mb-3">
        <Badge variant="secondary" className={cn("text-[10px] text-white border-none", priorityColor)}>
          {task.priority}
        </Badge>
        <span className="text-[10px] text-muted-foreground font-medium">{task.department?.name || "Dept"}</span>
      </div>

      <h4 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">{task.title}</h4>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{task.description || "No description provided."}</p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="text-[10px]">2d left</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span className="text-[10px]">4</span>
          </div>
          <div className="flex items-center gap-1">
            <Paperclip className="w-3 h-3" />
            <span className="text-[10px]">2</span>
          </div>
        </div>

        <Avatar className="w-6 h-6 border-2 border-background">
          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">JD</AvatarFallback>
        </Avatar>
      </div>
    </Card>
  );
}
