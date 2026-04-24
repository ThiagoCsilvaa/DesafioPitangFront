import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      {/* Header Provisório*/}
      <header className="bg-white shadow-sm border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-bold text-xl text-blue-600">AgendamentoVacinaApp 💉</h1>
          <nav className="flex gap-4">
            <Link to="/" className="text-zinc-600 hover:text-blue-600 font-medium [&.active]:text-blue-600">
              Agendar
            </Link>
            <Link to="/consulta" className="text-zinc-600 hover:text-blue-600 font-medium [&.active]:text-blue-600">
              Consultar
            </Link>
          </nav>
        </div>
      </header>
      {}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  ),
})
