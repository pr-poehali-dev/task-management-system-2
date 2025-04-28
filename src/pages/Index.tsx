import { useState } from "react";
import { Task, TaskStatus } from "@/components/TaskCard";
import Navbar from "@/components/Navbar";
import TaskList from "@/components/TaskList";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Демо-данные
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Разработать дизайн главной страницы",
    description: "Создать макет и прототип главной страницы для нового проекта",
    dueDate: "05.05.2025",
    priority: "высокий",
    status: "в процессе"
  },
  {
    id: "2",
    title: "Настроить базу данных",
    description: "Установить и настроить MongoDB для нового проекта",
    dueDate: "10.05.2025",
    priority: "средний",
    status: "новая"
  },
  {
    id: "3",
    title: "Написать документацию API",
    description: "Подготовить техническую документацию по всем эндпоинтам API",
    dueDate: "15.05.2025",
    priority: "низкий",
    status: "завершена"
  }
];

interface TaskFormData {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
}

const emptyTask: TaskFormData = {
  id: "",
  title: "",
  description: "",
  dueDate: "",
  priority: "средний",
  status: "новая"
};

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskFormData>(emptyTask);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddTask = () => {
    setCurrentTask(emptyTask);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditTask = (id: string) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setCurrentTask({ ...taskToEdit });
      setIsEditing(true);
      setIsDialogOpen(true);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };

  const handleSaveTask = () => {
    if (currentTask.title.trim() === "") return;

    if (isEditing) {
      setTasks(tasks.map(task => 
        task.id === currentTask.id 
          ? { 
              ...currentTask, 
              priority: currentTask.priority as TaskPriority,
              status: currentTask.status as TaskStatus
            } 
          : task
      ));
    } else {
      const newTask: Task = {
        ...currentTask,
        id: Date.now().toString(),
        priority: currentTask.priority as TaskPriority,
        status: currentTask.status as TaskStatus
      };
      setTasks([...tasks, newTask]);
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onAddTask={handleAddTask} />
      
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Мои задачи</h1>
          <p className="text-muted-foreground">
            Управляйте своими задачами, отслеживайте прогресс и достигайте целей
          </p>
        </div>
        
        <TaskList 
          tasks={tasks} 
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Редактирование задачи" : "Новая задача"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Измените детали задачи и нажмите Сохранить" 
                : "Заполните необходимые поля для создания новой задачи"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
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
                placeholder="Описание задачи"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Срок выполнения</Label>
                <Input
                  id="dueDate"
                  value={currentTask.dueDate}
                  onChange={(e) => setCurrentTask({...currentTask, dueDate: e.target.value})}
                  placeholder="ДД.ММ.ГГГГ"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="priority">Приоритет</Label>
                <Select 
                  value={currentTask.priority} 
                  onValueChange={(value) => setCurrentTask({...currentTask, priority: value})}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Выберите приоритет" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="низкий">Низкий</SelectItem>
                    <SelectItem value="средний">Средний</SelectItem>
                    <SelectItem value="высокий">Высокий</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isEditing && (
              <div className="grid gap-2">
                <Label htmlFor="status">Статус</Label>
                <Select 
                  value={currentTask.status} 
                  onValueChange={(value) => setCurrentTask({...currentTask, status: value})}
                >
                  <SelectTrigger id="status">
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
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveTask}>
              {isEditing ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
