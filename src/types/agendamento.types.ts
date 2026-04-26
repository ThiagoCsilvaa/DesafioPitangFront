import type { Paciente } from "./paciente.types";

export interface Agendamento{
id: number;
pacienteId: number;
paciente?: Paciente;
dataAgendamento: string;
horaAgendamento: string;
status: string;
conclusao?: string | null;
dataCriacao: string;
}

export interface AgendamentoDTO{
pacienteId: number;
dataAgendamento: string;
horaAgendamento: string;
}

export interface AtualizarStatusDTO{
status: string;
conclusao: string;
}

export interface RespostaPadrao<T>{
mensagem: string;
dados?: T;
}

export interface AgendamentoCompletoDTO {
  nome: string;
  dataNascimento: string; 
  dataAgendamento: string; 
  horaAgendamento: string;
}