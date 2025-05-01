import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task } from "@/components/TaskCard";
import { Badge } from "@/components/ui/badge";
import { Trash2, RotateCcw } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function DeletedTasks() {
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  // Проверка аутентификации
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  // Загрузка удаленных задач из localStorage
  useEffect(() => {
    const storedDeletedTasks = localStorage.getItem("deletedTasks");
    if (storedDeletedTasks) {
      setDeletedTasks(JSON.parse(storedDeletedTasks));
    }
  }, []);

  // Сохранение удаленных задач в localStorage
  const saveDeletedTasks = (updatedTasks: Task[]) => {
    localStorage.setItem("deletedTasks", JSON.stringify(updatedTasks));
    setDeletedTasks(updatedTasks);
  };

  // Восстановление задачи
  const restoreTask = (id: string) => {
    // Находим задачу для восстановления
    const taskToRestore = deletedTasks.find(task => task.id === id);
    if (!taskToRestore) return;

    // Удаляем задачу из списка удаленных
    const updatedDeletedTasks = deletedTasks.filter(task => task.id !== id);
    saveDeletedTasks(updatedDeletedTasks);

    // Добавляем задачу в основной список
    const storedTasks = localStorage.getItem("tasks");
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];
    localStorage.setItem("tasks", JSON.stringify([...tasks, taskToRestore]));
    
    // Создаем и отправляем пользовательское событие для обновления дашборда
    window.dispatchEvent(new Event("taskUpdated"));
  };

  // Окончательное удаление задачи
  const permanentlyDeleteTask = (id: string) => {
    const updatedDeletedTasks = deletedTasks.filter(task => task.id !== id);
    saveDeletedTasks(updatedDeletedTasks);
  };

  // Очистка всех удаленных задач
  const clearAllDeletedTasks = () => {
    localStorage.removeItem("deletedTasks");
    setDeletedTasks([]);
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "высокий": return "bg-red-100 text-red-700";
      case "средний": return "bg-amber-100 text-amber-700";
      case "низкий": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "завершена": return "bg-green-100 text-green-700";
      case "в процессе": return "bg-amber-100 text-amber-700";
      case "новая": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onAddTask={() => navigate("/tasks")} />
      
      <main className="flex-1 container py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Удаленные задачи</h1>
            <p className="text-muted-foreground">
              Задачи, которые были удалены и могут быть восстановлены
            </p>
          </div>
          {deletedTasks.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Очистить корзину
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие навсегда удалит все задачи из корзины. Отменить это действие будет невозможно.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAllDeletedTasks}>
                    Очистить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {deletedTasks.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-center">
            <div className="max-w-[420px] p-4">
              <p className="text-sm text-muted-foreground">
                У вас нет удаленных задач
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deletedTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl break-words pr-6">{task.title}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className={getStatusColor(task.status)} variant="secondary">
                      {task.status}
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)} variant="secondary">
                      {task.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground overflow-y-auto max-h-24">
                    {task.description}
                  </p>
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground">Срок: {task.dueDate}</p>
                  </div>
                </CardContent>
                <div className="p-4 border-t flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => restoreTask(task.id)}
                    className="text-xs flex items-center gap-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Восстановить
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="text-xs flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Удалить
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить навсегда?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие окончательно удалит задачу. Отменить это действие будет невозможно.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={() => permanentlyDeleteTask(task.id)}>
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}