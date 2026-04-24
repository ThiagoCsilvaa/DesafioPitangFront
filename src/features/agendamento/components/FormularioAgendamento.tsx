import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { agendamentoSchema, type AgendamentoFormData } from '../schemas/agendamentoSchema';
import { pacienteService } from '../../../services/paciente.service';
import { agendamentoService } from '../../../services/agendamento.service';
import { useModalStore } from '../../../store/modalStore';
import { useAgendamentoStore } from '../../../store/agendamentoStore';

const HORARIOS_PERMITIDOS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export function FormularioAgendamento() {
  const { abrirModal } = useModalStore();
  const { incrementarTotal } = useAgendamentoStore();
  const [erroApi, setErroApi] = useState<string | null>(null);

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<AgendamentoFormData>({
    resolver: zodResolver(agendamentoSchema),
  });

  const onSubmit = async (data: AgendamentoFormData) => {
    setErroApi(null);
    try {
      // Cadastra Paciente
      const pacienteData = {
        nome: data.nome,
        dataNascimento: format(data.dataNascimento, "yyyy-MM-dd'T'00:00:00"),
      };
      const pacienteSalvo = await pacienteService.inserir(pacienteData);

      // Cadastra Agendamento
      if (pacienteSalvo && pacienteSalvo.id) {
        const agendamentoData = {
          pacienteId: pacienteSalvo.id,
          dataAgendamento: format(data.dataAgendamento, "yyyy-MM-dd'T'00:00:00"),
          horaAgendamento: `${data.horaAgendamento}:00`,
        };
        await agendamentoService.inserir(agendamentoData);

        incrementarTotal();
        abrirModal(`Agendamento de ${data.nome} realizado com sucesso para as ${data.horaAgendamento}!`);
        reset(); 
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErroApi(error.response?.data?.erro || 'Ocorreu um erro ao realizar o agendamento.');
      } else {
        setErroApi('Ocorreu um erro inesperado.');
      }
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-sm border-zinc-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Nova Vacina</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para reservar o horário da vacinação.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {erroApi && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md border border-red-200 font-medium text-sm">
              {erroApi}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input 
              id="nome"
              placeholder="Ex: Thiago Cavalcanti"
              {...register('nome')} 
              className={errors.nome ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.nome && <span className="text-red-500 text-xs font-medium">{errors.nome.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
            <Controller
              name="dataNascimento"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date: Date | null) => field.onChange(date)}
                  dateFormat="dd/MM/yyyy"
                  className={`w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${errors.dataNascimento ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  placeholderText="Selecione a data"
                />
              )}
            />
            {errors.dataNascimento && <span className="text-red-500 text-xs font-medium">{errors.dataNascimento.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="dataAgendamento">Dia da Vacina</Label>
              <Controller
                name="dataAgendamento"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date | null) => field.onChange(date)}
                    minDate={new Date()} 
                    dateFormat="dd/MM/yyyy"
                    className={`w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${errors.dataAgendamento ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    placeholderText="Escolha o dia"
                  />
                )}
              />
              {errors.dataAgendamento && <span className="text-red-500 text-xs font-medium">{errors.dataAgendamento.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="horaAgendamento">Horário</Label>
              <Controller
                name="horaAgendamento"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={errors.horaAgendamento ? "border-red-500 focus:ring-red-500" : ""}>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {HORARIOS_PERMITIDOS.map(hora => (
                        <SelectItem key={hora} value={hora}>{hora}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.horaAgendamento && <span className="text-red-500 text-xs font-medium">{errors.horaAgendamento.message}</span>}
            </div>
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? 'Agendando...' : 'Confirmar Agendamento'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
