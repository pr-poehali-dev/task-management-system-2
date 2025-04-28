import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Edit, Trash2 } from "lucide-react";

export type TaskPriority = "низкий" | "средний" | "высокий";
export type TaskStatus = "новая" | "в процессе" | "завершена";

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

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "низкий":
      return "bg-blue-100 text-blue-800";
    case "средний":
      return "bg-yellow-100 text-yellow-800";
    case "высокий":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "новая":
      return "bg-purple-100 text-purple-800";
    case "в процессе":
      return "bg-amber-100 text-amber-800";
    case "завершена":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const nextStatus = (): TaskStatus => {
    if (task.status === "новая") return "в процессе";
    if (task.status === "в процессе") return "завершена";
    return "новая";
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-medium">{task.title}</CardTitle>
          <div className="flex gap-1">
            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground">{task.description}</p>
        <div className="mt-2 flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          <span>до {task.dueDate}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="group transition-all"
          onClick={() => onStatusChange(task.id, nextStatus())}
        >
          <CheckCircle className="mr-1 h-4 w-4 group-hover:text-primary" />
          {task.status === "завершена" ? "Сбросить" : "Изменить статус"}
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(task.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;