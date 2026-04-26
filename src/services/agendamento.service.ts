import { api } from './api';
import type { Agendamento, AgendamentoDTO, AtualizarStatusDTO, RespostaPadrao, AgendamentoCompletoDTO } from '../types/agendamento.types';

export const agendamentoService = {
  listarPorData: async (data: string) => {
    const response = await api.get<RespostaPadrao<Agendamento[]>>(`/Agendamento/ListarPorData/${data}`);
    return response.data.dados || [];
  },

  inserirCompleto: async (dados: AgendamentoCompletoDTO) => {
    const response = await api.post<RespostaPadrao<Agendamento>>('/Agendamento/InserirCompleto', dados);
    return response.data.dados;
  },

  inserir: async (agendamento: AgendamentoDTO) => {
    const response = await api.post<RespostaPadrao<Agendamento>>('/Agendamento', agendamento);
    return response.data.dados;
  },

  atualizarStatus: async (id: number, dados: AtualizarStatusDTO) => {
    const response = await api.patch<RespostaPadrao<Agendamento>>(`/Agendamento/AtualizarStatus/${id}`, dados);
    return response.data.dados;
  }
};
