import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { agendamentoService } from '../../../services/agendamento.service';
import { type Agendamento } from '../../../types/agendamento.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import 'react-datepicker/dist/react-datepicker.css';
import { useAgendamentos } from '../hooks/useAgendamento';
export function ListaAgendamentos() {
  const [dataConsulta, setDataConsulta] = useState<Date>(new Date());
  const [modalAberto, setModalAberto] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<number | null>(null);
  const [conclusaoTexto, setConclusaoTexto] = useState('');
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
  const handleConcluirAtendimento = async () => {
    if (!agendamentoSelecionado) return;
    
    try {
      await agendamentoService.atualizarStatus(agendamentoSelecionado, {
        status: 'Concluído',
        conclusao: conclusaoTexto
      });
      
      setModalAberto(false);
      recarregar();
    } catch (error) {
      console.error('Erro ao concluir', error);
    }
  };
  const abrirModalConclusao = (id: number) => {
    setAgendamentoSelecionado(id);
    setConclusaoTexto('');
    setModalAberto(true);
  };
  return (
    <div className="w-full max-w-4xl flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-zinc-200">
        <div>
          <h2 className="text-xl font-bold text-zinc-800">Consultar Agendamentos</h2>
          <p className="text-sm text-zinc-500">Selecione uma data para ver os pacientes marcados</p>
        </div>
        <div className="w-full md:w-56">
          <DatePicker
            selected={dataConsulta}
            onChange={(date: Date | null) => date && setDataConsulta(date)}
            dateFormat="dd/MM/yyyy"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-zinc-500 py-8 font-medium animate-pulse">Buscando agendamentos...</p>
      ) : horariosOrdenados.length === 0 ? (
        <p className="text-center text-zinc-500 py-8 bg-white rounded-xl shadow-sm border border-zinc-200">
          Nenhum agendamento encontrado para esta data.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {horariosOrdenados.map(hora => (
            <div key={hora} className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
              <div className="bg-zinc-100 border-b border-zinc-200 p-3 px-4">
                <h3 className="font-bold text-zinc-700">Horário: {hora}</h3>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {agendamentosAgrupados[hora].map(agendamento => (
                  <Card key={agendamento.id} className="shadow-none border-zinc-200 bg-zinc-50/50">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg text-blue-700">
                        {agendamento.paciente?.nome || 'Paciente'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex flex-col gap-3">
                      <div className="text-sm text-zinc-600">
                        <p>
                          <strong>Status: </strong>
                          <span className={agendamento.status === 'Concluído' ? 'text-green-600 font-bold' : 'text-amber-600 font-bold'}>
                            {agendamento.status}
                          </span>
                        </p>
                        {agendamento.conclusao && (
                          <p className="mt-1 text-zinc-500 bg-white p-2 rounded-md border border-zinc-200 italic">
                            "{agendamento.conclusao}"
                          </p>
                        )}
                      </div>
                      
                      {agendamento.status !== 'Concluído' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => abrirModalConclusao(agendamento.id)}
                        >
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

      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Concluir Atendimento</DialogTitle>
            <DialogDescription>
              Informe a conclusão do atendimento para finalizar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-3 py-4">
            <Label htmlFor="conclusao">Conclusão</Label>
            <Input 
              id="conclusao" 
              placeholder="Ex: Vacina aplicada com sucesso" 
              value={conclusaoTexto}
              onChange={(e) => setConclusaoTexto(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAberto(false)}>Cancelar</Button>
            <Button onClick={handleConcluirAtendimento} disabled={!conclusaoTexto.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
