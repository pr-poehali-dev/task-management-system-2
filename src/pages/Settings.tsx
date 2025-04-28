
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, Save } from "lucide-react";

const Settings = () => {
  const [email, setEmail] = useState("user@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === "") {
      toast({
        title: "Ошибка",
        description: "Email не может быть пустым",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Успешно",
      description: "Email успешно обновлен",
    });
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword.trim() === "" || newPassword.trim() === "" || confirmPassword.trim() === "") {
      toast({
        title: "Ошибка",
        description: "Все поля должны быть заполнены",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Новый пароль и подтверждение не совпадают",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Успешно",
      description: "Пароль успешно обновлен",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onAddTask={() => {}} />
      
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Настройки профиля</h1>
          <p className="text-muted-foreground">
            Управляйте настройками вашего аккаунта
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Изменить Email
              </CardTitle>
              <CardDescription>
                Обновите адрес электронной почты для вашего аккаунта
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" onClick={handleEmailUpdate} className="gap-2">
                <Save className="h-4 w-4" />
                Сохранить изменения
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Сменить пароль
              </CardTitle>
              <CardDescription>
                Обновите пароль вашего аккаунта
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Текущий пароль</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Новый пароль</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Подтвердите новый пароль</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" onClick={handlePasswordUpdate} className="gap-2">
                <Save className="h-4 w-4" />
                Обновить пароль
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
