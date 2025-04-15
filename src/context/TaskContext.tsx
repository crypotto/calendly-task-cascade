
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { format } from "date-fns";

export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  completed: boolean;
  createdAt: Date;
}

export type Notification = {
  id: string;
  taskId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

interface TaskContextProps {
  tasks: Task[];
  categories: string[];
  notifications: Notification[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  markTaskAsCompleted: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  filterTasks: (status?: TaskStatus, priority?: TaskPriority, category?: string, searchTerm?: string) => Task[];
  getTaskById: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

// Sample categories
const DEFAULT_CATEGORIES = ["Work", "Personal", "Health", "Education", "Entertainment"];

// Generate sample tasks
const generateSampleTasks = (): Task[] => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return [
    {
      id: "1",
      title: "Complete project proposal",
      description: "Finish the draft and send for review",
      dueDate: tomorrow,
      status: "Pending",
      priority: "High",
      category: "Work",
      completed: false,
      createdAt: now
    },
    {
      id: "2",
      title: "Morning jog",
      description: "Run for 30 minutes",
      dueDate: tomorrow,
      status: "Pending",
      priority: "Medium",
      category: "Health",
      completed: false,
      createdAt: now
    },
    {
      id: "3",
      title: "Read book",
      description: "Read chapter 5",
      dueDate: nextWeek,
      status: "In Progress",
      priority: "Low",
      category: "Personal",
      completed: false,
      createdAt: now
    }
  ];
};

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>(generateSampleTasks());
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate notifications based on tasks' due dates
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newNotifications: Notification[] = [];
    
    tasks.forEach(task => {
      if (task.dueDate && !task.completed) {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        // Task is due today
        if (dueDate.getTime() === today.getTime()) {
          newNotifications.push({
            id: `notification-today-${task.id}`,
            taskId: task.id,
            message: `Task "${task.title}" is due today!`,
            isRead: false,
            createdAt: new Date()
          });
        }
        
        // Task is overdue
        if (dueDate.getTime() < today.getTime()) {
          newNotifications.push({
            id: `notification-overdue-${task.id}`,
            taskId: task.id,
            message: `Task "${task.title}" is overdue! It was due on ${format(dueDate, 'PPP')}.`,
            isRead: false,
            createdAt: new Date()
          });
        }
      }
    });
    
    setNotifications(prev => {
      const existingIds = new Set(prev.map(n => n.id));
      const filtered = newNotifications.filter(n => !existingIds.has(n.id));
      return [...prev, ...filtered];
    });
  }, [tasks]);

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updatedFields } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    // Remove associated notifications
    setNotifications(notifications.filter(notification => notification.taskId !== id));
  };

  const markTaskAsCompleted = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: true, status: "Completed" } : task
    ));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const filterTasks = (
    status?: TaskStatus, 
    priority?: TaskPriority, 
    category?: string,
    searchTerm?: string
  ) => {
    return tasks.filter(task => {
      const matchesStatus = !status || task.status === status;
      const matchesPriority = !priority || task.priority === priority;
      const matchesCategory = !category || task.category === category;
      const matchesSearch = !searchTerm || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
    });
  };

  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  const value = {
    tasks,
    categories,
    notifications,
    addTask,
    updateTask,
    deleteTask,
    markTaskAsCompleted,
    markNotificationAsRead,
    filterTasks,
    getTaskById
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
