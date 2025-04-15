
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Check, X } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, markNotificationAsRead } = useTaskContext();
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const allNotifications = notifications;
  
  const displayNotifications = activeTab === "unread" ? unreadNotifications : allNotifications;
  
  const markAsRead = (id: string) => {
    markNotificationAsRead(id);
  };
  
  return (
    <Card className="shadow-lg border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-semibold">Notifications</h3>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close notifications">
          <X size={18} />
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="border-b border-border">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread {unreadNotifications.length > 0 && `(${unreadNotifications.length})`}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="px-0">
          <NotificationList 
            notifications={displayNotifications} 
            markAsRead={markAsRead} 
          />
        </TabsContent>
        
        <TabsContent value="unread" className="px-0">
          <NotificationList 
            notifications={displayNotifications} 
            markAsRead={markAsRead} 
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

interface NotificationListProps {
  notifications: Array<{
    id: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
  }>;
  markAsRead: (id: string) => void;
}

function NotificationList({ notifications, markAsRead }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No notifications to display
      </div>
    );
  }
  
  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`px-4 py-3 border-b border-border hover:bg-secondary/50 transition-colors flex justify-between ${notification.isRead ? 'opacity-70' : 'bg-secondary/30'}`}
        >
          <div>
            <p className="text-sm mb-1">{notification.message}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
            </p>
          </div>
          
          {!notification.isRead && (
            <Button 
              variant="ghost" 
              size="sm"
              className="self-start ml-2 h-7 w-7"
              onClick={() => markAsRead(notification.id)}
              aria-label="Mark as read"
            >
              <Check size={14} />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
