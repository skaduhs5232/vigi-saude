import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const createInitialFormState = () => ({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const emailLabel = "E-mail";

const Login = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState(() => createInitialFormState());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => (mode === "login" ? "Acesse sua conta" : "Crie sua conta"), [mode]);
  const ctaLabel = useMemo(() => (mode === "login" ? "Entrar" : "Registrar"), [mode]);
  const toggleLabel = useMemo(() => (mode === "login" ? "Ainda não possui conta?" : "Já possui conta?"), [mode]);
  const toggleAction = useMemo(() => (mode === "login" ? "Crie uma conta" : "Faça login"), [mode]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleModeChange = (nextMode: "login" | "register") => {
    setMode(nextMode);
    setForm(createInitialFormState());
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (mode === "register" && form.password !== form.confirmPassword) {
      setError("As senhas informadas não coincidem.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register({ name: form.name, email: form.email, password: form.password });
      }
      navigate("/admin", { replace: true });
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : "Não foi possível concluir a operação. Tente novamente.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" size="sm" className="mb-6" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para notificações
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold">VigiSaúde</CardTitle>
              <CardDescription>Sistema de Vigilância Sanitária Hospitalar</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <h2 className="mb-6 text-center text-lg font-semibold text-foreground">{title}</h2>
            <div className="mb-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>{toggleLabel}</span>
              <button
                type="button"
                className="font-medium text-primary hover:underline"
                onClick={() => handleModeChange(mode === "login" ? "register" : "login")}
              >
                {toggleAction}
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Digite seu nome"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{emailLabel}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={form.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirme a senha</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repita a senha"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {mode === "login" ? <LogIn className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {isSubmitting ? "Processando..." : ctaLabel}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
