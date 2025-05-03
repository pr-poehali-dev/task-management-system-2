import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/components/TaskCard";
import { ru } from "date-fns/locale";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, getMonth, getYear, getDaysInMonth, startOfMonth, getDay, isToday, isSameDay } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, CalendarDays, Clock } from "lucide-react";

export default function CalendarView() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"week" | "month">("month");

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

    // Добавляем слушатель события storage для обновления при изменениях
    const handleStorageChange = () => {
      const updatedTasks = localStorage.getItem("tasks");
      if (updatedTasks) {
        setTasks(JSON.parse(updatedTasks));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("taskUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("taskUpdated", handleStorageChange);
    };
  }, []);

  // Преобразование строки даты в формате dd.MM.yyyy в объект Date
  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  // Получение задач для конкретной даты
  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task => {
      const taskDate = parseDate(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  // Получение цвета для приоритета задачи
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "высокий": return "bg-red-100 text-red-700";
      case "средний": return "bg-amber-100 text-amber-700";
      case "низкий": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Получение цвета для статуса задачи
  const getStatusColor = (status: string) => {
    switch(status) {
      case "завершена": return "bg-green-100 text-green-700";
      case "в процессе": return "bg-amber-100 text-amber-700";
      case "новая": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Функция для отображения недельного представления
  const renderWeekView = () => {
    // Получаем первый и последний день недели
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    
    // Получаем все дни недели
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="mt-4">
        <div className="flex justify-between mb-4 items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setDate(prevDate => addDays(prevDate, -7))}
            className="text-xs md:text-sm px-1.5 md:px-3"
          >
            <ChevronLeft className="h-4 w-4 mr-0.5 md:mr-1" />
            <span className="hidden sm:inline">Предыдущая</span>
            <span className="sm:hidden">Пред.</span>
          </Button>
          <div className="text-sm md:text-lg font-semibold text-center truncate px-1">
            {format(start, "dd.MM")} - {format(end, "dd.MM.yyyy")}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setDate(prevDate => addDays(prevDate, 7))}
            className="text-xs md:text-sm px-1.5 md:px-3"
          >
            <span className="hidden sm:inline">Следующая</span>
            <span className="sm:hidden">След.</span>
            <ChevronRight className="h-4 w-4 ml-0.5 md:ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 md:gap-4">
          {days.map((day, index) => {
            const dayTasks = getTasksForDate(day);
            const isCurrentDay = isToday(day);

            return (
              <div key={index} className="min-h-[100px] md:min-h-[120px]">
                <div className={`text-center mb-1 md:mb-2 font-semibold p-1 rounded-md ${isCurrentDay ? 'bg-primary text-primary-foreground' : ''}`}>
                  <div className="text-xs md:text-sm">{format(day, "EEE", { locale: ru })}</div>
                  <div>{format(day, "dd")}</div>
                </div>
                <div className="space-y-1 md:space-y-2">
                  {dayTasks.length === 0 ? (
                    <div className="text-[10px] md:text-xs text-muted-foreground text-center py-1 md:py-2">Нет задач</div>
                  ) : (
                    dayTasks.map((task) => (
                      <Card key={task.id} className="p-1 md:p-2 cursor-pointer hover:bg-accent" onClick={() => navigate('/tasks')}>
                        <div className="text-[10px] md:text-xs font-medium truncate">{task.title}</div>
                        <div className="flex items-center justify-between mt-0.5 md:mt-1">
                          <Badge className={getPriorityColor(task.priority)} variant="secondary" className="text-[8px] md:text-[10px] px-0.5 md:px-1 py-0">
                            {task.priority}
                          </Badge>
                          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                            task.status === "завершена" ? "bg-green-500" :
                            task.status === "в процессе" ? "bg-amber-500" :
                            "bg-blue-500"
                          }`}></div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Функция для отображения месячного представления
  const renderMonthView = () => {
    const month = getMonth(date);
    const year = getYear(date);
    const daysInMonth = getDaysInMonth(date);
    const firstDayOfMonth = startOfMonth(date);
    const startingDayOfWeek = getDay(firstDayOfMonth);
    
    // Корректировка для начала недели с понедельника (в JS воскресенье = 0)
    const startDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    // Названия дней недели
    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    // Создаем массив для всех ячеек календаря (до 42 - 6 строк по 7 дней)
    const calendarCells = Array(42).fill(null).map((_, index) => {
      if (index < startDay || index >= startDay + daysInMonth) {
        return null; // Пустая ячейка
      }
      
      const day = index - startDay + 1;
      const currentDate = new Date(year, month, day);
      const dayTasks = getTasksForDate(currentDate);
      const isCurrentDay = isToday(currentDate);
      
      return {
        date: currentDate,
        day,
        tasks: dayTasks,
        isCurrentDay
      };
    });

    return (
      <div className="mt-4">
        <div className="flex justify-between mb-4 items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setDate(new Date(year, month - 1, 1))}
            className="text-xs md:text-sm px-1.5 md:px-3"
          >
            <ChevronLeft className="h-4 w-4 mr-0.5 md:mr-1" />
            <span className="hidden sm:inline">Пред. месяц</span>
            <span className="sm:hidden">Пред.</span>
          </Button>
          <div className="text-sm md:text-lg font-semibold text-center truncate px-1">
            {format(date, "LLLL yyyy", { locale: ru })}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setDate(new Date(year, month + 1, 1))}
            className="text-xs md:text-sm px-1.5 md:px-3"
          >
            <span className="hidden sm:inline">След. месяц</span>
            <span className="sm:hidden">След.</span>
            <ChevronRight className="h-4 w-4 ml-0.5 md:ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {/* Названия дней недели */}
          {weekDays.map((day, index) => (
            <div key={`weekday-${index}`} className="text-center font-semibold text-xs md:text-sm py-1 md:py-2">
              {day}
            </div>
          ))}
          
          {/* Дни месяца */}
          {calendarCells.map((cell, index) => {
            if (cell === null) {
              return <div key={`empty-${index}`} className="min-h-[60px] md:min-h-[90px] bg-muted/30 rounded-md"></div>;
            }
            
            return (
              <div 
                key={`day-${index}`} 
                className={`min-h-[60px] md:min-h-[90px] border rounded-md p-0.5 md:p-1 ${
                  cell.isCurrentDay ? 'border-primary' : 'border-border'
                }`}
              >
                <div className={`text-right mb-0.5 md:mb-1 px-0.5 md:px-1 text-xs md:text-sm font-medium ${
                  cell.isCurrentDay ? 'text-primary' : ''
                }`}>
                  {cell.day}
                </div>
                <div className="space-y-0.5 md:space-y-1 overflow-y-auto max-h-[45px] md:max-h-[70px]">
                  {cell.tasks.length > 0 ? (
                    cell.tasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="text-[8px] md:text-xs p-0.5 md:p-1 rounded bg-accent/50 cursor-pointer hover:bg-accent"
                        onClick={() => navigate('/tasks')}
                      >
                        <div className="truncate">{task.title}</div>
                        <div className="flex items-center justify-between mt-0.5 md:mt-1">
                          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                            task.status === "завершена" ? "bg-green-500" :
                            task.status === "в процессе" ? "bg-amber-500" :
                            "bg-blue-500"
                          }`}></div>
                          <div className={`text-[7px] md:text-[9px] px-0.5 md:px-1 rounded-sm ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[8px] md:text-[10px] text-muted-foreground text-center">Нет задач</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onAddTask={() => navigate("/tasks")} />
      
      <main className="flex-1 container py-4 md:py-8">
        <div className="mb-4 md:mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight mb-1 md:mb-2">Календарь задач</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Просмотр задач в календарном формате
            </p>
          </div>
          <Button onClick={() => navigate("/tasks")} size="sm" className="text-xs md:text-sm">
            К задачам
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2 md:pb-3">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
              <CardTitle className="text-lg md:text-xl">Календарь задач</CardTitle>
              <Tabs 
                value={view} 
                onValueChange={(v) => setView(v as "week" | "month")}
                className="w-full md:w-[240px]"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="week" className="flex items-center gap-1 text-xs md:text-sm">
                    <Clock className="h-3 w-3 md:h-4 md:w-4" />
                    Неделя
                  </TabsTrigger>
                  <TabsTrigger value="month" className="flex items-center gap-1 text-xs md:text-sm">
                    <CalendarDays className="h-3 w-3 md:h-4 md:w-4" />
                    Месяц
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 text-xs md:text-sm"
                onClick={() => setDate(new Date())}
              >
                <CalendarIcon className="h-3 w-3 md:h-4 md:w-4" />
                Сегодня
              </Button>
            </div>

            {view === "week" ? renderWeekView() : renderMonthView()}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}