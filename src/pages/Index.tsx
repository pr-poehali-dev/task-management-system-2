import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import TaskList from "@/components/TaskList";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task, TaskStatus } from "@/components/TaskCard";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "средний",
    status: "новая"
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const navigate = useNavigate();

  // Проверка аутентификации
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  // Загрузка задач из localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Сохранение задач в localStorage и отправка события обновления
  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    
    // Создаем и отправляем пользовательское событие для обновления дашборда
    window.dispatchEvent(new Event("taskUpdated"));
  };

  const openAddTaskDialog = () => {
    setIsEditing(false);
    setCurrentTask({
      id: Date.now().toString(),
      title: "",
      description: "",
      dueDate: format(new Date(), "dd.MM.yyyy"),
      priority: "средний",
      status: "новая"
    });
    setIsDialogOpen(true);
  };

  const openEditTaskDialog = (id: string) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setIsEditing(true);
      setCurrentTask(taskToEdit);
      setIsDialogOpen(true);
    }
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    saveTasks(updatedTasks);
  };

  const saveTask = () => {
    if (!currentTask.title) return;

    if (isEditing) {
      const updatedTasks = tasks.map(task => 
        task.id === currentTask.id ? currentTask : task
      );
      saveTasks(updatedTasks);
    } else {
      saveTasks([...tasks, currentTask]);
    }
    
    setIsDialogOpen(false);
  };

  const changeTaskStatus = (id: string, status: TaskStatus) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, status } : task
    );
    saveTasks(updatedTasks);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentTask({
        ...currentTask,
        dueDate: format(date, "dd.MM.yyyy")
      });
    }
    setIsDatePickerOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onAddTask={openAddTaskDialog} />
      
      <main className="flex-1 container py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Мои задачи</h1>
            <p className="text-muted-foreground">
              Управляйте своими задачами эффективно
            </p>
          </div>
          <Button onClick={openAddTaskDialog} size="sm" className="hidden sm:flex">
            Добавить задачу
          </Button>
        </div>

        <TaskList 
          tasks={tasks}
          onEditTask={openEditTaskDialog}
          onDeleteTask={deleteTask}
          onStatusChange={changeTaskStatus}
        />
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Редактировать задачу" : "Добавить новую задачу"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Измените информацию о задаче" : "Заполните форму для создания новой задачи"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                value={currentTask.title}
                onChange={(e) => setCurrentTask({...currentTask, title: e.target.value})}
                placeholder="Введите название задачи"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={currentTask.description}
                onChange={(e) => setCurrentTask({...currentTask, description: e.target.value})}
                placeholder="Опишите задачу подробнее"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Срок выполнения</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentTask.dueDate || "Выберите дату"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={currentTask.dueDate ? new Date(currentTask.dueDate.split('.').reverse().join('-')) : undefined}
                    onSelect={handleDateSelect}
                    initialFocus
                    locale={ru}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Приоритет</Label>
              <Select 
                value={currentTask.priority} 
                onValueChange={(value) => setCurrentTask({...currentTask, priority: value as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите приоритет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="низкий">Низкий</SelectItem>
                  <SelectItem value="средний">Средний</SelectItem>
                  <SelectItem value="высокий">Высокий</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isEditing && (
              <div className="grid gap-2">
                <Label htmlFor="status">Статус</Label>
                <Select 
                  value={currentTask.status} 
                  onValueChange={(value) => setCurrentTask({...currentTask, status: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="новая">Новая</SelectItem>
                    <SelectItem value="в процессе">В процессе</SelectItem>
                    <SelectItem value="завершена">Завершена</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Отмена</Button>
            <Button onClick={saveTask}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
