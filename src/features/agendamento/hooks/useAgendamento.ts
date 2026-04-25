import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { agendamentoService } from '../../../services/agendamento.service';
import { type Agendamento } from '../../../types/agendamento.types';
export function useAgendamentos(data: Date) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const buscar = async () => {
    setLoading(true);
    try {
      const dataFormatada = format(data, 'yyyy-MM-dd');
      const dados = await agendamentoService.listarPorData(dataFormatada);
      setAgendamentos(dados);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    buscar();
  }, [data]);
  return { agendamentos, loading, recarregar: () => buscar() };
}