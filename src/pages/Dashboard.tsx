import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, ListTodo, PieChart, TrendingUp, ArrowUpRight } from "lucide-react";
import { Task } from "@/components/TaskCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Проверка авторизации
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

    // Добавляем слушатель события storage для обновления при изменениях
    const handleStorageChange = () => {
      const updatedTasks = localStorage.getItem("tasks");
      if (updatedTasks) {
        setTasks(JSON.parse(updatedTasks));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Создаем пользовательское событие для обновления дашборда
    const handleTaskUpdate = () => {
      const updatedTasks = localStorage.getItem("tasks");
      if (updatedTasks) {
        setTasks(JSON.parse(updatedTasks));
      }
    };

    window.addEventListener("taskUpdated", handleTaskUpdate);

    // Очистка при размонтировании
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("taskUpdated", handleTaskUpdate);
    };
  }, []);

  // Получаем статистику по задачам
  const tasksCompleted = tasks.filter(task => task.status === "завершена").length;
  const tasksInProgress = tasks.filter(task => task.status === "в процессе").length;
  const tasksNew = tasks.filter(task => task.status === "новая").length;
  const totalTasks = tasks.length;
  
  // Процент выполнения
  const completionPercentage = totalTasks ? Math.round((tasksCompleted / totalTasks) * 100) : 0;
  
  // Последняя активность (в реальном приложении это будет из хранилища)
  const lastActivity = "29 апреля 2025, 15:30";
  
  // Высший приоритет
  const highPriorityTasks = tasks.filter(task => task.priority === "высокий").length;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onAddTask={() => navigate("/tasks")} />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Дашборд</h1>
          <p className="text-muted-foreground">
            Обзор ваших задач и текущей активности
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Завершенные задачи */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Завершено</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasksCompleted}</div>
              <p className="text-xs text-muted-foreground">
                задач выполнено
              </p>
            </CardContent>
          </Card>
          
          {/* Задачи в процессе */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">В процессе</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasksInProgress}</div>
              <p className="text-xs text-muted-foreground">
                задач выполняются
              </p>
            </CardContent>
          </Card>
          
          {/* Новые задачи */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Новые</CardTitle>
              <ListTodo className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasksNew}</div>
              <p className="text-xs text-muted-foreground">
                задач не начаты
              </p>
            </CardContent>
          </Card>
          
          {/* Высокий приоритет */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Приоритетные</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{highPriorityTasks}</div>
              <p className="text-xs text-muted-foreground">
                задач высокого приоритета
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Прогресс по задачам */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Общий прогресс выполнения</CardTitle>
              <CardDescription>
                Процент выполненных задач от общего количества
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={completionPercentage} className="h-2" />
                </div>
                <div className="text-sm font-medium">{completionPercentage}%</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="text-muted-foreground">Всего</div>
                  <div className="font-medium">{totalTasks}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Завершено</div>
                  <div className="font-medium">{tasksCompleted}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Осталось</div>
                  <div className="font-medium">{totalTasks - tasksCompleted}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Статистика по типам задач */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Распределение задач</CardTitle>
              <CardDescription>
                Соотношение задач по статусам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center my-4">
                <PieChart className="h-24 w-24 text-primary opacity-80" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <div className="flex-1 text-sm">Завершено</div>
                  <div className="text-sm font-medium">{Math.round((tasksCompleted / totalTasks) * 100) || 0}%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <div className="flex-1 text-sm">В процессе</div>
                  <div className="text-sm font-medium">{Math.round((tasksInProgress / totalTasks) * 100) || 0}%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <div className="flex-1 text-sm">Новые</div>
                  <div className="text-sm font-medium">{Math.round((tasksNew / totalTasks) * 100) || 0}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Информация о продуктивности */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Продуктивность</CardTitle>
              <CardDescription>
                Информация о вашей работе
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center my-4">
                <TrendingUp className="h-24 w-24 text-primary opacity-80" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">Последняя активность</div>
                  <div className="font-medium">{lastActivity}</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">Среднее время выполнения</div>
                  <div className="font-medium">2.5 дня</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">Лучший день</div>
                  <div className="font-medium">Вторник</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Ближайшие дедлайны */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Ближайшие дедлайны</CardTitle>
              <CardDescription>
                Задачи, которые скоро должны быть выполнены
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">У вас пока нет задач</p>
                ) : (
                  tasks
                    .sort((a, b) => {
                      const dateA = a.dueDate.split('.').reverse().join('-');
                      const dateB = b.dueDate.split('.').reverse().join('-');
                      return new Date(dateA).getTime() - new Date(dateB).getTime();
                    })
                    .slice(0, 3)
                    .map((task) => (
                      <div key={task.id} className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${
                          task.status === "завершена" ? "bg-green-500" :
                          task.status === "в процессе" ? "bg-amber-500" :
                          "bg-blue-500"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{task.title}</p>
                          <p className="text-xs text-muted-foreground">Срок: {task.dueDate}</p>
                        </div>
                        <div className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === "высокий" ? "bg-red-100 text-red-700" :
                          task.priority === "средний" ? "bg-amber-100 text-amber-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {task.priority}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
