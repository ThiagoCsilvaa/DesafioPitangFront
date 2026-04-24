import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/consulta')({
    component: () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Consultar Agendamentos</h2>
      <p className="text-zinc-500"> lista.</p>
    </div>
  ),
})
