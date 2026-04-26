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
import { agendamentoService } from '../../../services/agendamento.service';
import { modalService } from '../../../services/modal.service';

import { useAgendamentoStore } from '../../../store/agendamentoStore';
import { Syringe, User, CalendarDays, Clock, Loader2 } from 'lucide-react';

const HORARIOS_PERMITIDOS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export function FormularioAgendamento() {
  const { incrementarTotal } = useAgendamentoStore();
  const [erroApi, setErroApi] = useState<string | null>(null);

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<AgendamentoFormData>({
    resolver: zodResolver(agendamentoSchema),
    defaultValues: {
      nome: '',
      horaAgendamento: '',
    }
  });

  const onSubmit = async (data: AgendamentoFormData) => {
    setErroApi(null);
    try {
      const payload = {
        nome: data.nome,
        dataNascimento: format(data.dataNascimento, "yyyy-MM-dd'T'00:00:00"),
        dataAgendamento: format(data.dataAgendamento, "yyyy-MM-dd'T'00:00:00"),
        horaAgendamento: `${data.horaAgendamento}:00`,
      };
      await agendamentoService.inserirCompleto(payload);
      incrementarTotal();
      modalService.abrirSucesso(`Agendamento de ${data.nome} realizado com sucesso para as ${data.horaAgendamento}!`);
      reset();

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErroApi(error.response?.data?.mensagem || error.response?.data?.erro || 'Ocorreu um erro ao realizar o agendamento.');
      } else {
        setErroApi('Ocorreu um erro inesperado.');
      }
    }
  };

  return (
    <Card className="w-full max-w-xl shadow-md border-zinc-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
            <Syringe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Nova Vacina</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para reservar o horário da vacinação.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* Bloco informativo */}
        <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-sm">
          <Clock className="w-4 h-4 shrink-0" />
          <span>Atendimento disponível das <strong>08:00</strong> às <strong>17:00</strong>.</span>
        </div>

        {/* Erro da API */}
        {erroApi && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 font-medium text-sm">
            <span className="shrink-0">⚠️</span>
            {erroApi}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* ── Dados Pessoais ── */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Dados Pessoais</h3>

            <div className="flex flex-col gap-2">
              <Label htmlFor="nome" className="flex items-center gap-2">
                <User className="w-4 h-4 text-zinc-400" />
                Nome Completo
              </Label>
              <Input
                id="nome"
                placeholder="Ex: Thiago Cavalcanti"
                {...register('nome')}
                className={errors.nome ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.nome && <span className="text-red-500 text-xs font-medium">{errors.nome.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="dataNascimento" className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-zinc-400" />
                Data de Nascimento
              </Label>
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
                    showYearDropdown
                    dropdownMode="select"
                  />
                )}
              />
              {errors.dataNascimento && <span className="text-red-500 text-xs font-medium">{errors.dataNascimento.message}</span>}
            </div>
          </div>

          {}
          <div className="border-t border-zinc-200" />

          {}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Dados da Vacina</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="dataAgendamento" className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-zinc-400" />
                  Dia da Vacina
                </Label>
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
                <Label htmlFor="horaAgendamento" className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  Horário
                </Label>
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
          </div>

          {}
          <Button type="submit" className="w-full mt-2 h-11 text-base font-semibold" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Agendando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Syringe className="w-4 h-4" />
                Confirmar Agendamento
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
