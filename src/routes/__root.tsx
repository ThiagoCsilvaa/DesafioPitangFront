import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { ModalSucesso } from '@/modals/ModalSucesso'
import { useAgendamentoStore } from '@/store/agendamentoStore'
import { Bell } from 'lucide-react'

export const Route = createRootRoute({
  component: () => {
    //  Zustand para exibir no ícone de notificação
    const { totalAgendamentos } = useAgendamentoStore()

    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
        <header className="bg-white shadow-sm border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="font-bold text-xl text-blue-600">VacinaApp 💉</h1>
            
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-zinc-600 hover:text-blue-600 font-medium [&.active]:text-blue-600">
                Agendar
              </Link>
              <Link to="/consulta" className="text-zinc-600 hover:text-blue-600 font-medium [&.active]:text-blue-600">
                Consultar
              </Link>

              {/* Ícone de Notificação com o Total */}
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100">
                <Bell className="w-5 h-5 text-zinc-600" />
                {totalAgendamentos > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                    {totalAgendamentos}
                  </span>
                )}
              </div>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Outlet />
        </main>

        <ModalSucesso />
      </div>
    )
  },
})
