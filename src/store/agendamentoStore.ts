import {create } from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

interface AgendamentoState {
  totalAgendamentos: number;
  incrementarTotal: () => void;

  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAgendamentoStore = create<AgendamentoState>()(
  persist(
    (set) => ({
      totalAgendamentos: 0,
      incrementarTotal: () => set((state) =>
     ({ totalAgendamentos: state.totalAgendamentos + 1 })),
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
    //LocalStorage para persistir os dados
    name: 'AgendamentoVacina-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => 
    ({ totalAgendamentos: state.totalAgendamentos }), // Persistir apenas o total de agendamentos
    }
  )
);
