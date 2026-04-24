import { createFileRoute } from '@tanstack/react-router'
import { ListaAgendamentos } from '../features/agendamento/components/ListaAgendamentos'
export const Route = createFileRoute('/consulta')({
  component: () => (
    <div className="flex justify-center pt-4">
      <ListaAgendamentos />
    </div>
  ),
})