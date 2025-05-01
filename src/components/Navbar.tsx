import { Button } from "@/components/ui/button";
import { PlusCircle, Settings, LogOut, LayoutDashboard, ListTodo, Trash2, Calendar } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface NavbarProps {
  onAddTask: () => void;
}

const Navbar = ({ onAddTask }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };
  
  return (
    <nav className="border-b bg-background sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/" 
              className={`text-sm font-medium ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              <div className="flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                <span>Дашборд</span>
              </div>
            </Link>
            <Link 
              to="/tasks" 
              className={`text-sm font-medium ${location.pathname === '/tasks' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              <div className="flex items-center gap-1">
                <ListTodo className="h-4 w-4" />
                <span>Задачи</span>
              </div>
            </Link>
            <Link 
              to="/deleted-tasks" 
              className={`text-sm font-medium ${location.pathname === '/deleted-tasks' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              <div className="flex items-center gap-1">
                <Trash2 className="h-4 w-4" />
                <span>Удаленные задачи</span>
              </div>
            </Link>
            <Link 
              to="/calendar" 
              className={`text-sm font-medium ${location.pathname === '/calendar' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Календарь</span>
              </div>
            </Link>
            <Link 
              to="/settings" 
              className={`text-sm font-medium ${location.pathname === '/settings' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              <div className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Настройки</span>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {location.pathname === '/tasks' && (
            <>
              <Button onClick={onAddTask} className="hidden sm:flex gap-1">
                <PlusCircle className="h-4 w-4" />
                Добавить задачу
              </Button>
              <Button onClick={onAddTask} className="sm:hidden" size="icon" variant="outline">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          <div className="md:hidden flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <Link to="/">
                <LayoutDashboard className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link to="/tasks">
                <ListTodo className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link to="/deleted-tasks">
                <Trash2 className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link to="/calendar">
                <Calendar className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link to="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Button onClick={handleLogout} variant="ghost" size="icon" className="text-muted-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;