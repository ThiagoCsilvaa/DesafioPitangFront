import { api } from './api';
import { type Paciente, type PacienteDTO } from '../types/paciente.types';
import { type RespostaPadrao } from '../types/agendamento.types';
export const pacienteService = {
  listarTodos: async () => {
    const response = await api.get<RespostaPadrao<Paciente[]>>('/Paciente/ListarTodos');
    return response.data.dados || [];
  },
  
  inserir: async (paciente: PacienteDTO) => {
    const response = await api.post<RespostaPadrao<Paciente>>('/Paciente/Inserir', paciente);
    return response.data.dados;
  }
};