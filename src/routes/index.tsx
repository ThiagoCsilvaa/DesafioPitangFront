import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <div>
         <h2 className="text-2xl font-bold mb-4">Novo Agendamento</h2>
      <p className="text-zinc-500">formulário.</p>
    </div>
  ),
})


