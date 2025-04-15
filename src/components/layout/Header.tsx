
import { Bell, Calendar, Home, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTaskContext } from "@/context/TaskContext";
import { NotificationPanel } from "../NotificationPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const location = useLocation();
  const { notifications } = useTaskContext();
  const isMobile = useIsMobile();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsMenuOpen(false);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    // Implement search functionality
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isMobile && (
              <button 
                onClick={toggleMenu}
                className="mr-2 p-2 rounded-full hover:bg-secondary"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            
            <Link to="/" className="text-2xl font-bold text-primary flex items-center">
              TaskCascade
            </Link>
          </div>

          {!isMobile && (
            <div className="flex-1 max-w-xl mx-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              </form>
            </div>
          )}

          <nav className={`${isMobile ? 'absolute top-full left-0 right-0 bg-white border-b border-border transition-all duration-300 ease-in-out ' + (isMenuOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden') : 'flex items-center'}`}>
            {isMobile ? (
              <ul className="py-4 px-4 space-y-2">
                <li>
                  <form onSubmit={handleSearch} className="relative mb-4">
                    <Input
                      type="search"
                      placeholder="Search tasks..."
                      className="w-full pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  </form>
                </li>
                <li>
                  <Link 
                    to="/" 
                    className={`flex items-center p-2 rounded-md ${location.pathname === '/' ? 'bg-secondary text-primary' : 'hover:bg-secondary'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home size={20} className="mr-2" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/calendar" 
                    className={`flex items-center p-2 rounded-md ${location.pathname === '/calendar' ? 'bg-secondary text-primary' : 'hover:bg-secondary'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar size={20} className="mr-2" />
                    Calendar
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="flex items-center space-x-1">
                <li>
                  <Link 
                    to="/" 
                    className={`flex items-center p-2 rounded-md ${location.pathname === '/' ? 'bg-secondary text-primary' : 'hover:bg-secondary'}`}
                  >
                    <Home size={20} className="mr-1" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/calendar" 
                    className={`flex items-center p-2 rounded-md ${location.pathname === '/calendar' ? 'bg-secondary text-primary' : 'hover:bg-secondary'}`}
                  >
                    <Calendar size={20} className="mr-1" />
                    Calendar
                  </Link>
                </li>
              </ul>
            )}
          </nav>

          <div className="flex items-center">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleNotifications}
                className="relative"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </Button>
              
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 z-20">
                  <NotificationPanel onClose={() => setIsNotificationOpen(false)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
