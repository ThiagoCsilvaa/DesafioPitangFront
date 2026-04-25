import { useModalStore } from "@/store/modalStore";

// Servico que controla abertura e fechamento de modal
export const modalService = {
abrirSucesso: (mensagem: string) => {
    useModalStore.getState().abrirModal(mensagem);
  },
  fechar: () => {
    useModalStore.getState().fecharModal();
  }};