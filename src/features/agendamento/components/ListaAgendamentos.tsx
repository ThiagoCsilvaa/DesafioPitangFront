import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { agendamentoService } from '../../../services/agendamento.service';
import { type Agendamento } from '../../../types/agendamento.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import 'react-datepicker/dist/react-datepicker.css';
import { useAgendamentos } from '../hooks/useAgendamento';
import { CalendarDays, Clock, User, CheckCircle2, ClipboardList, Search, FileText, Loader2 } from 'lucide-react';

export function ListaAgendamentos() {
  const [dataConsulta, setDataConsulta] = useState<Date>(new Date());
  const [modalAberto, setModalAberto] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<number | null>(null);
  const [conclusaoTexto, setConclusaoTexto] = useState('');
  const [concluindo, setConcluindo] = useState(false);
  const { agendamentos, loading, recarregar } = useAgendamentos(dataConsulta);

  const agendamentosAgrupados: Record<string, Agendamento[]> = {};
  agendamentos.forEach((ag: Agendamento) => {
    const hora = ag.horaAgendamento.substring(0, 5);
    if (!agendamentosAgrupados[hora]) {
      agendamentosAgrupados[hora] = [];
    }
    agendamentosAgrupados[hora].push(ag);
  });
  const horariosOrdenados = Object.keys(agendamentosAgrupados).sort();

  const totalAgendamentos = agendamentos.length;
  const totalConcluidos = agendamentos.filter(a => a.status === 'Concluído').length;
  const totalPendentes = totalAgendamentos - totalConcluidos;

  const handleConcluirAtendimento = async () => {
    if (!agendamentoSelecionado) return;
    try {
      setConcluindo(true);
      await agendamentoService.atualizarStatus(agendamentoSelecionado, {
        status: 'Concluído',
        conclusao: conclusaoTexto
      });
      setModalAberto(false);
      recarregar();
    } catch (error) {
      console.error('Erro ao concluir', error);
    } finally {
      setConcluindo(false);
    }
  };

  const abrirModalConclusao = (id: number) => {
    setAgendamentoSelecionado(id);
    setConclusaoTexto('');
    setModalAberto(true);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6">
      {/*Header*/}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-zinc-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
            <ClipboardList className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-800">Consultar Agendamentos</h2>
            <p className="text-sm text-zinc-500">Selecione uma data para ver os pacientes marcados</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-56">
          <Search className="w-4 h-4 text-zinc-400 hidden md:block" />
          <DatePicker
            selected={dataConsulta}
            onChange={(date: Date | null) => date && setDataConsulta(date)}
            dateFormat="dd/MM/yyyy"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>

      {/* Cards */}
      {!loading && totalAgendamentos > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-zinc-500">Total</p>
              <p className="text-lg font-bold text-zinc-800">{totalAgendamentos}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
            <Clock className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-xs text-zinc-500">Pendentes</p>
              <p className="text-lg font-bold text-amber-600">{totalPendentes}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-xs text-zinc-500">Concluídos</p>
              <p className="text-lg font-bold text-green-600">{totalConcluidos}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
              <div className="bg-zinc-100 border-b border-zinc-200 p-3 px-4">
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map(j => (
                  <div key={j} className="flex flex-col gap-3 p-4 border border-zinc-200 rounded-lg">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      /* Nenhum resultado */
      ) : horariosOrdenados.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 bg-white rounded-xl shadow-sm border border-zinc-200">
          <CalendarDays className="w-10 h-10 text-zinc-300" />
          <p className="text-zinc-500 font-medium">Nenhum agendamento encontrado para esta data.</p>
          <p className="text-zinc-400 text-sm">Tente selecionar outra data acima.</p>
        </div>

      /* Lista agrupada por horário */
      ) : (
        <div className="flex flex-col gap-6">
          {horariosOrdenados.map(hora => (
            <div key={hora} className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
              <div className="bg-zinc-100 border-b border-zinc-200 p-3 px-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-500" />
                <h3 className="font-bold text-zinc-700">Horário: {hora}</h3>
                <span className="ml-auto text-xs text-zinc-400 font-medium">
                  {agendamentosAgrupados[hora].length} paciente(s)
                </span>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {agendamentosAgrupados[hora].map(agendamento => (
                  <Card key={agendamento.id} className="shadow-none border-zinc-200 bg-zinc-50/50">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {agendamento.paciente?.nome ? `${agendamento.paciente.nome} (ID: ${agendamento.paciente.id})` : 'Paciente'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex flex-col gap-3">
                      <div className="text-sm text-zinc-600">
                        <div className="flex items-center gap-2">
                          <strong>Status:</strong>
                          {agendamento.status === 'Concluído' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              Concluído
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                              <Clock className="w-3 h-3" />
                              {agendamento.status}
                            </span>
                          )}
                        </div>
                        {agendamento.conclusao && (
                          <div className="mt-2 flex items-start gap-2 text-zinc-500 bg-white p-2 rounded-md border border-zinc-200">
                            <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            <span className="italic">"{agendamento.conclusao}"</span>
                          </div>
                        )}
                      </div>
                      {agendamento.status !== 'Concluído' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => abrirModalConclusao(agendamento.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Finalizar Atendimento
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              Concluir Atendimento
            </DialogTitle>
            <DialogDescription>
              Informe a conclusão do atendimento para finalizar.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Label htmlFor="conclusao" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-400" />
              Conclusão
            </Label>
            <Input
              id="conclusao"
              placeholder="Ex: Vacina aplicada com sucesso"
              value={conclusaoTexto}
              onChange={(e) => setConclusaoTexto(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAberto(false)}>Cancelar</Button>
            <Button 
              onClick={handleConcluirAtendimento} 
              disabled={!conclusaoTexto.trim() || concluindo} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {concluindo ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </span>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}