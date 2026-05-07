"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { taskService } from "@/services/taskService";
import { deptService } from "@/services/deptService";
import { toast } from "sonner";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    departmentId: "",
    assigneeId: "",
    deadline: ""
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => deptService.getDepartments(),
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: any) => taskService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Task created successfully");
      onClose();
      setFormData({
        title: "",
        description: "",
        priority: "MEDIUM",
        departmentId: "",
        assigneeId: "",
        deadline: ""
      });
    },
    onError: () => toast.error("Failed to create task"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.departmentId) {
      toast.error("Please fill in the required fields");
      return;
    }
    createTaskMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl glass border-none">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title" 
              className="bg-secondary/50 border-none rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea 
              id="description" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description"
              className="w-full bg-secondary/50 border-none rounded-xl p-3 min-h-[100px] text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select 
                value={formData.departmentId} 
                onValueChange={(val) => setFormData({ ...formData, departmentId: val })}
              >
                <SelectTrigger className="bg-secondary/50 border-none rounded-xl">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent className="glass">
                  {departments?.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(val) => setFormData({ ...formData, priority: val })}
              >
                <SelectTrigger className="bg-secondary/50 border-none rounded-xl">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent className="glass">
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input 
              id="deadline" 
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="bg-secondary/50 border-none rounded-xl"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl">Cancel</Button>
            <Button type="submit" disabled={createTaskMutation.isPending} className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              {createTaskMutation.isPending ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
