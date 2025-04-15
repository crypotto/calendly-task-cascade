
import { TaskCalendar } from "@/components/TaskCalendar";
import { Header } from "@/components/layout/Header";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Calendar View</h1>
          <p className="text-muted-foreground mt-1">
            View, reschedule, and manage your tasks on a calendar. Drag and drop to reschedule.
          </p>
        </div>
        
        <TaskCalendar />
      </main>
    </div>
  );
}
