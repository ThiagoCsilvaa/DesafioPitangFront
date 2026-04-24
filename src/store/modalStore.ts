import { create } from 'zustand';
// Define a interface para o estado do modal
interface ModalState {
  isOpen: boolean;
  mensagem: string;
  abrirModal: (mensagem: string) => void;
  fecharModal: () => void;
}
// Cria a store para o modal usando Zustand
export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  mensagem: '',
  abrirModal: (mensagem) => set({ isOpen: true, mensagem }),
  fecharModal: () => set({ isOpen: false, mensagem: '' }),
}));