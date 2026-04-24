import { createFileRoute } from '@tanstack/react-router'
import { FormularioAgendamento } from '../features/agendamento/components/FormularioAgendamento'

export const Route = createFileRoute('/')({
  component: () => (
    <div className="flex justify-center pt-8">
      <FormularioAgendamento />
    </div>
  ),
})


