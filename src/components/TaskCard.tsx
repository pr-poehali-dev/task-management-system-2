import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Check, ClipboardList, Clock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type TaskStatus = "новая" | "в процессе" | "завершена";
export type TaskPriority = "низкий" | "средний" | "высокий";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}

interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "высокий": return "bg-red-100 text-red-700 hover:bg-red-200";
      case "средний": return "bg-amber-100 text-amber-700 hover:bg-amber-200";
      case "низкий": return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      default: return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "завершена": return "text-green-500";
      case "в процессе": return "text-amber-500";
      case "новая": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "завершена": return <Check className="h-4 w-4" />;
      case "в процессе": return <Clock className="h-4 w-4" />;
      case "новая": return <ClipboardList className="h-4 w-4" />;
      default: return <ClipboardList className="h-4 w-4" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CardTitle className="text-xl truncate max-w-[200px]">{task.title}</CardTitle>
              </TooltipTrigger>
              <TooltipContent>
                <p>{task.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="flex items-center gap-1.5">
          <span className={`rounded-full w-2 h-2 ${
            task.status === "завершена" ? "bg-green-500" :
            task.status === "в процессе" ? "bg-amber-500" :
            "bg-blue-500"
          }`}></span>
          <span className="text-muted-foreground">
            {task.status}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm text-muted-foreground line-clamp-2 h-10 cursor-help">{task.description}</p>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>{task.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="mt-4 flex items-center justify-between">
          <Badge className={getPriorityColor(task.priority)} variant="secondary">
            {task.priority}
          </Badge>
          <span className="text-xs text-muted-foreground">{task.dueDate}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-3 pt-4">
        <Button 
          variant="outline" 
          className="text-xs h-8 px-2"
          onClick={() => onEdit(task.id)}
        >
          <Pencil className="mr-1 h-3 w-3" />
          Изменить
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary" className="text-xs h-8 px-2 flex items-center gap-1">
              <span className={getStatusColor(task.status)}>{getStatusIcon(task.status)}</span>
              Изменить статус
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => onStatusChange(task.id, "новая")}
              className={task.status === "новая" ? "bg-secondary" : ""}
            >
              <ClipboardList className="mr-2 h-4 w-4 text-blue-500" />
              Новая
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onStatusChange(task.id, "в процессе")}
              className={task.status === "в процессе" ? "bg-secondary" : ""}
            >
              <Clock className="mr-2 h-4 w-4 text-amber-500" />
              В процессе
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onStatusChange(task.id, "завершена")}
              className={task.status === "завершена" ? "bg-secondary" : ""}
            >
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Завершена
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;