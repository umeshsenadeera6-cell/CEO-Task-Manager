"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/services/taskService";
import { deptService } from "@/services/deptService";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', { limit: 5 }],
    queryFn: () => taskService.getTasks(),
  });

  const { data: departments, isLoading: deptsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => deptService.getDepartments(),
  });

  if (tasksLoading || deptsLoading) return <DashboardLayout><div>Loading dashboard...</div></DashboardLayout>;

  const stats = {
    total: tasks?.length || 0,
    inProgress: tasks?.filter(t => t.status === 'IN_PROGRESS').length || 0,
    completed: tasks?.filter(t => t.status === 'COMPLETED').length || 0,
    overdue: tasks?.filter(t => t.status === 'OVERDUE').length || 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {user?.role === 'CEO' ? 'CEO Dashboard' : user?.role === 'MANAGER' ? 'Manager Dashboard' : 'My Dashboard'}
          </h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user?.name}. Here's what's happening today.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Tasks" 
            value={stats.total} 
            icon={ListTodo} 
            trend="+12%" 
            trendUp={true} 
            color="bg-primary"
          />
          <StatCard 
            title="In Progress" 
            value={stats.inProgress} 
            icon={Clock} 
            trend="+5%" 
            trendUp={true} 
            color="bg-purple-500"
          />
          <StatCard 
            title="Completed" 
            value={stats.completed} 
            icon={CheckCircle2} 
            trend="+18%" 
            trendUp={true} 
            color="bg-green-500"
          />
          <StatCard 
            title="Overdue" 
            value={stats.overdue} 
            icon={AlertCircle} 
            trend="-2%" 
            trendUp={false} 
            color="bg-red-500"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          <Card className="md:col-span-4 rounded-2xl border-none glass overflow-hidden">
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks?.slice(0, 5).map((task) => (
                    <TableRow key={task.id} className="hover:bg-secondary/50 transition-colors">
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.department?.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                              {task.assignee?.name.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{task.assignee?.name || 'Unassigned'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={task.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : ''}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={task.priority === 'URGENT' ? 'bg-red-500' : task.priority === 'HIGH' ? 'bg-orange-500' : 'bg-primary'}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 rounded-2xl border-none glass overflow-hidden">
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {departments?.map((dept: any) => {
                  const completed = dept.tasks?.filter((t: any) => t.status === 'COMPLETED').length || 0;
                  const total = dept.tasks?.length || 0;
                  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
                  
                  return (
                    <div key={dept.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{dept.name}</span>
                        <span className="text-muted-foreground">{progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
