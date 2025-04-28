import { Button } from "@/components/ui/button";
import { PlusCircle, CheckSquare, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  onAddTask: () => void;
}

const Navbar = ({ onAddTask }: NavbarProps) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };
  
  return (
    <nav className="border-b bg-background sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ТаскМенеджер</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-sm font-medium hover:text-primary">
              Задачи
            </Link>
            <Link to="/settings" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Настройки
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onAddTask} className="hidden sm:flex gap-1">
            <PlusCircle className="h-4 w-4" />
            Добавить задачу
          </Button>
          <Button onClick={onAddTask} className="sm:hidden" size="icon" variant="outline">
            <PlusCircle className="h-4 w-4" />
          </Button>
          <div className="md:hidden flex items-center gap-2">
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