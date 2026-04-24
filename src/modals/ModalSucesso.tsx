import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useModalStore } from "@/store/modalStore"
import { CheckCircle2 } from "lucide-react"

export function ModalSucesso() {
  const { isOpen, mensagem, fecharModal } = useModalStore()

  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && fecharModal()}>
      <DialogContent className="sm:max-w-md flex flex-col items-center text-center p-6">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <DialogHeader>
          <DialogTitle className="text-xl">Sucesso!</DialogTitle>
          <DialogDescription className="text-base text-zinc-600 mt-2">
            {mensagem}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
