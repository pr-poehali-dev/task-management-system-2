import { useState } from "react";
import TaskCard, { Task, TaskStatus } from "./TaskCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onEditTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const TaskList = ({ tasks, onEditTask, onDeleteTask, onStatusChange }: TaskListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("все");
  const [filterPriority, setFilterPriority] = useState<string>("все");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "все" || task.status === filterStatus;
    const matchesPriority = filterPriority === "все" || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск задач..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="все">Все статусы</SelectItem>
              <SelectItem value="новая">Новые</SelectItem>
              <SelectItem value="в процессе">В процессе</SelectItem>
              <SelectItem value="завершена">Завершенные</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Приоритет" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="все">Все приоритеты</SelectItem>
              <SelectItem value="низкий">Низкий</SelectItem>
              <SelectItem value="средний">Средний</SelectItem>
              <SelectItem value="высокий">Высокий</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-center">
          <div className="max-w-[420px] p-4">
            <p className="text-sm text-muted-foreground">
              {searchTerm || filterStatus !== "все" || filterPriority !== "все"
                ? "Нет задач, соответствующих вашим фильтрам"
                : "У вас пока нет задач. Нажмите «Добавить задачу», чтобы создать новую."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;