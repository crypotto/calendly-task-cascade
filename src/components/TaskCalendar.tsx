
import { useState, useCallback, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTaskContext, Task } from "@/context/TaskContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { TaskForm } from "./TaskForm";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

// Define the date formatting functions needed for the calendar
const locales = {
  "en-US": enUS,
};

// Create a wrapper function for date-fns since react-big-calendar expects moment.js
const localizer = {
  format: (date: Date, format: string) => {
    return format === "LT" 
      ? formatDate(date, "h:mm a") 
      : format === "llll" 
        ? formatDate(date, "EEE MMM d, yyyy h:mm a") 
        : formatDate(date, format);
  },
  parse: (str: string, format: string) => {
    return parse(str, format, new Date());
  },
  startOfWeek: (date: Date) => {
    return startOfWeek(date);
  },
  getDay: (date: Date) => {
    return getDay(date);
  },
  locales,
};

// Helper function to use date-fns format
function formatDate(date: Date, formatStr: string) {
  return format(date, formatStr);
}

// Create a custom localizer for react-big-calendar using date-fns
const dateLocalizer = momentLocalizer(localizer as any);

// Define view constants
const VIEWS = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
};

export function TaskCalendar() {
  const { tasks, updateTask } = useTaskContext();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Convert tasks to calendar events
  const events = useMemo(() => {
    return tasks
      .filter(task => task.dueDate)
      .map(task => {
        const dueDate = task.dueDate as Date;
        return {
          id: task.id,
          title: task.title,
          start: dueDate,
          end: dueDate,
          allDay: true,
          resource: task,
        };
      });
  }, [tasks]);

  // Handle slot selection for creating new tasks
  const handleSelectSlot = useCallback(
    (slotInfo: { start: Date; end: Date }) => {
      setSelectedDate(slotInfo.start);
      setIsCreateDialogOpen(true);
    },
    []
  );

  // Handle event selection for editing tasks
  const handleSelectEvent = useCallback(
    (event: any) => {
      setSelectedTask(event.resource as Task);
      setIsDialogOpen(true);
    },
    []
  );

  // Handle event drag-and-drop for rescheduling tasks
  const moveEvent = useCallback(
    ({ event, start }: { event: any; start: Date; end: Date; allDay: boolean }) => {
      updateTask(event.id, { dueDate: start });
    },
    [updateTask]
  );

  // Custom event component to show priority and status
  const EventComponent = ({ event }: { event: any }) => {
    const task = event.resource as Task;
    if (!task) return <div>{event.title}</div>;

    const priorityColors = {
      Low: "bg-priority-low text-gray-800",
      Medium: "bg-priority-medium text-white",
      High: "bg-priority-high text-white",
    };

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-1 mb-1">
          <Badge className={priorityColors[task.priority] || "bg-secondary"} variant="outline">
            {task.priority}
          </Badge>
          {task.completed && <Badge variant="outline">Completed</Badge>}
        </div>
        <div className={`text-sm font-medium ${task.completed ? 'line-through opacity-70' : ''}`}>
          {task.title}
        </div>
      </div>
    );
  };

  const eventPropGetter = (event: any) => {
    const task = event.resource as Task;
    if (!task) return {};
    
    let backgroundColor = "#D6BCFA"; // Default for low
    if (task.priority === "Medium") backgroundColor = "#9b87f5";
    if (task.priority === "High") backgroundColor = "#7E69AB";
    
    if (task.completed) {
      return {
        style: {
          backgroundColor,
          opacity: 0.7,
          border: "1px solid",
          borderColor: backgroundColor,
        },
      };
    }
    
    return {
      style: {
        backgroundColor,
        border: "1px solid",
        borderColor: backgroundColor,
      },
    };
  };

  return (
    <div className="h-[calc(100vh-12rem)]">
      <Card className="p-4 h-full">
        <Calendar
          localizer={dateLocalizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          views={['month', 'week', 'day']}
          defaultView="month"
          selectable
          resizable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={moveEvent}
          components={{
            event: EventComponent,
          }}
          popup
          eventPropGetter={eventPropGetter}
        />
      </Card>

      {/* Dialog for creating new task */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm 
            task={{ 
              id: "", 
              title: "", 
              description: "", 
              dueDate: selectedDate, 
              status: "Pending", 
              priority: "Medium", 
              category: "", 
              completed: false, 
              createdAt: new Date() 
            }} 
            onClose={() => setIsCreateDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Dialog for editing existing task */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {selectedTask && <TaskForm task={selectedTask} onClose={() => setIsDialogOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
