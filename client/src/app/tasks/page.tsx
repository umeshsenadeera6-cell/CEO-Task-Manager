"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search, LayoutGrid, List, Calendar } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/taskService";
import { toast } from "sonner";
import { Status } from "@/types";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { useState } from "react";

const columns = [
  { id: "PENDING", title: "Pending" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "UNDER_REVIEW", title: "Under Review" },
  { id: "COMPLETED", title: "Completed" },
];

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.getTasks(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: Status }) => 
      taskService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Task status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  if (isLoading) return <DashboardLayout><div>Loading tasks...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground mt-1">Manage and track company-wide tasks.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="rounded-xl gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Tabs defaultValue="kanban" className="w-full sm:w-auto">
            <TabsList className="bg-secondary/50 rounded-xl p-1">
              <TabsTrigger value="kanban" className="rounded-lg gap-2">
                <LayoutGrid className="w-4 h-4" />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="table" className="rounded-lg gap-2">
                <List className="w-4 h-4" />
                Table
              </TabsTrigger>
              <TabsTrigger value="calendar" className="rounded-lg gap-2">
                <Calendar className="w-4 h-4" />
                Calendar
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="w-full bg-secondary/50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            <Button variant="outline" className="rounded-xl gap-2 border-border/50 bg-secondary/30">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{column.title}</h3>
                  <span className="bg-secondary text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {tasks?.filter(t => t.status === column.id).length || 0}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="w-6 h-6 rounded-md hover:bg-secondary">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              <div className="space-y-4 min-h-[500px] p-2 bg-secondary/10 rounded-2xl border border-dashed border-border/50">
                {tasks
                  ?.filter((t) => t.status === column.id)
                  .map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </DashboardLayout>
  );
}
