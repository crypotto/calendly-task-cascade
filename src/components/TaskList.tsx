
import { useState } from "react";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useTaskContext, Task, TaskPriority, TaskStatus } from "@/context/TaskContext";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { TaskForm } from "./TaskForm";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";

export function TaskList() {
  const { tasks, markTaskAsCompleted, deleteTask } = useTaskContext();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "">("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleMarkCompleted = (id: string) => {
    markTaskAsCompleted(id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(id);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const closeEditDialog = () => {
    setEditingTask(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    const matchesCategory = !categoryFilter || task.category === categoryFilter;
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
  });

  const uniqueCategories = Array.from(new Set(tasks.map(task => task.category)));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TaskStatus | "")}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as TaskPriority | "")}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Priorities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {uniqueCategories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No tasks found. Try adjusting your filters or create a new task.
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onMarkCompleted={handleMarkCompleted}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      <Dialog open={!!editingTask} onOpenChange={() => closeEditDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && <TaskForm task={editingTask} onClose={closeEditDialog} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  onMarkCompleted: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

function TaskItem({ task, onMarkCompleted, onDelete, onEdit }: TaskItemProps) {
  const priorityColors = {
    Low: "bg-priority-low text-gray-800",
    Medium: "bg-priority-medium text-white",
    High: "bg-priority-high text-white",
  };

  const statusColors = {
    Pending: "bg-task-pending text-gray-800",
    "In Progress": "bg-task-inProgress text-gray-800",
    Completed: "bg-task-completed text-gray-800",
  };

  return (
    <div className={`border rounded-lg p-4 transition-all ${task.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <Checkbox 
          id={`task-${task.id}`} 
          checked={task.completed} 
          onCheckedChange={() => !task.completed && onMarkCompleted(task.id)} 
          disabled={task.completed}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            
            <div className="flex items-center gap-2 shrink-0">
              <Badge className={statusColors[task.status] || "bg-secondary"}>
                {task.status}
              </Badge>
              <Badge className={priorityColors[task.priority] || "bg-secondary"}>
                {task.priority}
              </Badge>
              <Badge variant="outline">{task.category}</Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Task options">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit size={16} className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => onDelete(task.id)}>
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          
          {task.dueDate && (
            <p className="text-xs mt-2">
              Due: <span className={`font-medium ${isOverdue(task) ? 'text-destructive' : ''}`}>
                {format(task.dueDate, 'PPP')}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.completed) return false;
  
  const dueDate = new Date(task.dueDate);
  dueDate.setHours(23, 59, 59, 999);
  return dueDate < new Date();
}
