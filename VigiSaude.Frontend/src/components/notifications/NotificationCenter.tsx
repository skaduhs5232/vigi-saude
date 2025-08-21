import React, { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle, Clock, Filter, Search } from "lucide-react";

export type NotificationItem = {
  id: number | string;
  type: string;
  description: string;
  time: string;
  status: "completed" | "investigating" | "pending";
  priority: "low" | "medium" | "high";
};

function StatusIcon({ status }: { status: NotificationItem["status"] }) {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4 text-success" />;
    case "investigating":
      return <Clock className="w-4 h-4 text-warning" />;
    case "pending":
    default:
      return <AlertTriangle className="w-4 h-4 text-destructive" />;
  }
}

function priorityVariant(priority: NotificationItem["priority"]) {
  switch (priority) {
    case "high":
      return "destructive" as const;
    case "medium":
      return "secondary" as const;
    case "low":
    default:
      return "secondary" as const;
  }
}

export function NotificationCenter({ open, onOpenChange, items: initialItems }: { open: boolean; onOpenChange: (v: boolean) => void; items: NotificationItem[]; }) {
  const [query, setQuery] = useState("");
  const [unread, setUnread] = useState<Set<NotificationItem["id"]>>(new Set(initialItems.map(i => i.id))); // tudo não lido a princípio
  const [items, setItems] = useState<NotificationItem[]>(initialItems);
  const [tab, setTab] = useState<string>("todas");

  const filtered = useMemo(() => {
    let list = items.filter(i =>
      (i.type + " " + i.description).toLowerCase().includes(query.toLowerCase())
    );
    if (tab === "nao-lidas") list = list.filter(i => unread.has(i.id));
    if (tab === "alta") list = list.filter(i => i.priority === "high");
    if (tab === "pendentes") list = list.filter(i => i.status === "pending" || i.status === "investigating");
    return list;
  }, [items, query, tab, unread]);

  const markAllRead = () => {
    setUnread(new Set());
  };

  const clearAll = () => {
    setItems([]);
    setUnread(new Set());
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0">
        <div className="p-4 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/70 sticky top-0 z-10">
          <SheetHeader>
            <SheetTitle>Centro de Notificações</SheetTitle>
            <SheetDescription>Veja suas notificações recentes e pendentes</SheetDescription>
          </SheetHeader>
          <div className="mt-3 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar notificações..." className="pl-8"/>
            </div>
            <Button variant="outline" size="sm" className="gap-1"><Filter className="w-4 h-4"/>Filtros</Button>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">{filtered.length} resultado(s)</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={markAllRead}>Marcar tudo como lido</Button>
              <Button variant="ghost" size="sm" onClick={clearAll}>Limpar</Button>
            </div>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="nao-lidas">Não lidas</TabsTrigger>
            <TabsTrigger value="alta">Alta</TabsTrigger>
            <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          </TabsList>
          <TabsContent value="todas" className="mt-4" />
          <TabsContent value="nao-lidas" className="mt-4" />
          <TabsContent value="alta" className="mt-4" />
          <TabsContent value="pendentes" className="mt-4" />
        </Tabs>

        <div className="px-4 pb-4 space-y-2">
          {filtered.map((n) => (
            <div key={n.id} className="p-3 rounded-lg border bg-background hover:bg-accent/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-1"><StatusIcon status={n.status} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={priorityVariant(n.priority)} className="text-xs">{n.type}</Badge>
                      {!unread.has(n.id) ? null : (
                        <span className="inline-block w-2 h-2 rounded-full bg-primary" title="Não lida" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="text-sm mt-1 leading-snug">{n.description}</p>
                  <div className="mt-2 flex gap-2">
                    {unread.has(n.id) ? (
                      <Button size="sm" variant="secondary" onClick={() => setUnread(prev => { const s = new Set(prev); s.delete(n.id); return s; })}>Marcar como lida</Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => setUnread(prev => { const s = new Set(prev); s.add(n.id); return s; })}>Marcar como não lida</Button>
                    )}
                    <Button size="sm" variant="outline">Ver detalhes</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              Nenhuma notificação encontrada.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default NotificationCenter;
