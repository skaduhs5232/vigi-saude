import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Eye, Plus, Download, Filter } from "lucide-react";
import * as XLSX from 'xlsx';

interface FarmacovigilanciaData {
  id: string;
  prontuario: string;
  paciente: string;
  setor: string;
  leito: string;
  idade: number;
  medicamento: string;
  posologia: string;
  reacao: string;
  desfecho: string;
  gravidade: "Leve" | "Moderada" | "Grave";
  dataInicio: string;
  duracao: string;
  notificador: string;
}

const mockData: FarmacovigilanciaData[] = [
  {
    id: "1",
    prontuario: "12345",
    paciente: "Maria Silva",
    setor: "UTI",
    leito: "101",
    idade: 65,
    medicamento: "Dipirona",
    posologia: "500mg 6/6h",
    reacao: "Erupção cutânea generalizada",
    desfecho: "Recuperação completa",
    gravidade: "Moderada",
    dataInicio: "2024-01-15",
    duracao: "3 dias",
    notificador: "Dr. João Santos"
  },
  {
    id: "2",
    prontuario: "67890",
    paciente: "José Oliveira",
    setor: "Cardiologia",
    leito: "205",
    idade: 72,
    medicamento: "Atenolol",
    posologia: "25mg 1x/dia",
    reacao: "Bradicardia severa",
    desfecho: "Em acompanhamento",
    gravidade: "Grave",
    dataInicio: "2024-01-20",
    duracao: "Ongoing",
    notificador: "Dra. Ana Costa"
  }
];

export default function Farmacovigilancia() {
  const [data, setData] = useState<FarmacovigilanciaData[]>(mockData);
  const [filteredData, setFilteredData] = useState<FarmacovigilanciaData[]>(mockData);
  const [filters, setFilters] = useState({
    search: "",
    setor: "all",
    gravidade: "all"
  });
  const [selectedItem, setSelectedItem] = useState<FarmacovigilanciaData | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      prontuario: "",
      paciente: "",
      setor: "",
      leito: "",
      idade: "",
      medicamento: "",
      posologia: "",
      reacao: "",
      desfecho: "",
      gravidade: "Leve",
      dataInicio: "",
      duracao: "",
      notificador: ""
    }
  });

  const applyFilters = () => {
    let filtered = data;

    if (filters.search) {
      filtered = filtered.filter(item => 
        item.paciente.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.prontuario.includes(filters.search) ||
        item.medicamento.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.setor && filters.setor !== "all") {
      filtered = filtered.filter(item => item.setor === filters.setor);
    }

    if (filters.gravidade && filters.gravidade !== "all") {
      filtered = filtered.filter(item => item.gravidade === filters.gravidade);
    }

    setFilteredData(filtered);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Farmacovigilância");
    XLSX.writeFile(workbook, "farmacovigilancia.xlsx");
  };

  const onSubmit = (values: any) => {
    const newEntry: FarmacovigilanciaData = {
      id: String(data.length + 1),
      ...values,
      idade: parseInt(values.idade)
    };
    const updatedData = [...data, newEntry];
    setData(updatedData);
    setFilteredData(updatedData);
    setIsAddDialogOpen(false);
    form.reset();
  };

  const getGravidadeBadgeVariant = (gravidade: string) => {
    switch (gravidade) {
      case "Leve": return "secondary";
      case "Moderada": return "default";
      case "Grave": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-medical-text">Farmacovigilância</h1>
        <div className="flex gap-3">
          <Button onClick={exportToExcel} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-medical-primary hover:bg-medical-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Nova Notificação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Notificação de Farmacovigilância</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="prontuario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prontuário</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paciente"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Paciente</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="setor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Setor</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leito"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Leito</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="idade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idade</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="medicamento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medicamento</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="posologia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Posologia</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="reacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição da Reação</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="desfecho"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desfecho</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gravidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gravidade</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || "Leve"}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a gravidade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Leve">Leve</SelectItem>
                              <SelectItem value="Moderada">Moderada</SelectItem>
                              <SelectItem value="Grave">Grave</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="dataInicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Início</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duracao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duração</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notificador"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notificador</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-medical-primary hover:bg-medical-primary/90">
                      Salvar Notificação
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Buscar por paciente, prontuário ou medicamento..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <Select value={filters.setor} onValueChange={(value) => setFilters({ ...filters, setor: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os setores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os setores</SelectItem>
                <SelectItem value="UTI">UTI</SelectItem>
                <SelectItem value="Cardiologia">Cardiologia</SelectItem>
                <SelectItem value="Emergência">Emergência</SelectItem>
                <SelectItem value="Pediatria">Pediatria</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.gravidade} onValueChange={(value) => setFilters({ ...filters, gravidade: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as gravidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as gravidades</SelectItem>
                <SelectItem value="Leve">Leve</SelectItem>
                <SelectItem value="Moderada">Moderada</SelectItem>
                <SelectItem value="Grave">Grave</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={applyFilters} className="bg-medical-primary hover:bg-medical-primary/90">
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Notificações de Farmacovigilância ({filteredData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prontuário</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Setor/Leito</TableHead>
                <TableHead>Medicamento</TableHead>
                <TableHead>Reação</TableHead>
                <TableHead>Gravidade</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.prontuario}</TableCell>
                  <TableCell>{item.paciente}</TableCell>
                  <TableCell>{item.setor}/{item.leito}</TableCell>
                  <TableCell>{item.medicamento}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.reacao}</TableCell>
                  <TableCell>
                    <Badge variant={getGravidadeBadgeVariant(item.gravidade)}>
                      {item.gravidade}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(item.dataInicio).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalhes da Notificação - {selectedItem?.prontuario}</DialogTitle>
                        </DialogHeader>
                        {selectedItem && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <strong>Paciente:</strong> {selectedItem.paciente}
                              </div>
                              <div>
                                <strong>Idade:</strong> {selectedItem.idade} anos
                              </div>
                              <div>
                                <strong>Setor:</strong> {selectedItem.setor}
                              </div>
                              <div>
                                <strong>Leito:</strong> {selectedItem.leito}
                              </div>
                              <div>
                                <strong>Medicamento:</strong> {selectedItem.medicamento}
                              </div>
                              <div>
                                <strong>Posologia:</strong> {selectedItem.posologia}
                              </div>
                            </div>
                            <div>
                              <strong>Descrição da Reação:</strong>
                              <p className="mt-1 p-3 bg-medical-background rounded-md border">
                                {selectedItem.reacao}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <strong>Desfecho:</strong> {selectedItem.desfecho}
                              </div>
                              <div>
                                <strong>Gravidade:</strong>
                                <Badge variant={getGravidadeBadgeVariant(selectedItem.gravidade)} className="ml-2">
                                  {selectedItem.gravidade}
                                </Badge>
                              </div>
                              <div>
                                <strong>Data de Início:</strong> {new Date(selectedItem.dataInicio).toLocaleDateString()}
                              </div>
                              <div>
                                <strong>Duração:</strong> {selectedItem.duracao}
                              </div>
                            </div>
                            <div>
                              <strong>Notificador:</strong> {selectedItem.notificador}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}