# 💉 Sistema de Agendamento de Vacinação — Frontend

## 📋 Sobre o Projeto

Interface web desenvolvida em **React 19 + TypeScript** para o sistema de agendamento de vacinação contra COVID-19. O sistema permite que o usuário cadastre agendamentos através de um formulário intuitivo, consulte a lista de vacinas agendadas agrupadas por dia e horário, e marque o status de atendimento de cada agendamento.

### Qual problema ele resolve?

Os profissionais de saúde e pacientes precisam de uma interface simples e eficiente para agendar vacinas sem aglomerações. Esta aplicação oferece:

- **Formulário validado** para cadastro rápido de agendamentos.
- **Listagem organizada** por dia e horário para facilitar o controle.
- **Atualização de status** para indicar se o atendimento foi realizado e sua conclusão.
- **Persistência local** via localStorage para não perder dados ao atualizar a página.
- **Ícone de notificação** com o total de agendamentos do dia.

### Como resolve?

Através de uma aplicação **SPA (Single Page Application)** construída com React, utilizando gerenciamento de estado com **Zustand** (persistido no localStorage), validação de formulários com **React Hook Form + Zod**, e comunicação com a API .NET via **Axios**.

---

## 🏗️ Estrutura do Projeto

O projeto segue uma organização por **features** com separação de responsabilidades:

```
📦 src
├── 🎨 assets/              → Recursos estáticos (imagens, ícones)
├── 🧩 components/ui/       → Componentes reutilizáveis (Shadcn/Radix UI)
├── 📦 features/
│   └── agendamento/
│       ├── components/      → FormularioAgendamento, ListaAgendamentos
│       ├── hooks/           → Hooks customizados
│       └── schemas/         → Validações com Zod
├── 🔧 lib/                 → Utilitários (cn, helpers)
├── 🪟 modals/              → Modais controlados por service
├── 🛣️ routes/              → Páginas (TanStack Router)
├── 🌐 services/            → Comunicação com a API (Axios)
├── 📦 store/               → Gerenciamento de estado (Zustand)
└── 📄 types/               → Tipagens TypeScript
```

---

## ⚙️ Tecnologias e Ferramentas

| Tecnologia | Finalidade |
|---|---|
| React 19 | Biblioteca principal para construção da UI |
| TypeScript | Tipagem estática para segurança no código |
| Vite | Bundler e dev server ultrarrápido |
| TailwindCSS 4 | Estilização utilitária |
| Shadcn/UI + Radix UI | Componentes de interface acessíveis e customizáveis |
| Zustand | Gerenciamento de estado global com persistência (localStorage) |
| React Hook Form | Gerenciamento de formulários com alta performance |
| Zod | Validação de schemas no formulário |
| TanStack Router | Roteamento type-safe |
| Axios | Cliente HTTP para comunicação com a API |
| date-fns | Formatação e manipulação de datas |
| React DatePicker | Seletor de datas no formulário |
| Lucide React | Ícones modernos e leves |
| Sonner | Notificações toast |

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- A **API Backend** (.NET) rodando localmente (veja o [repositório do Backend](https://github.com/ThiagoCsilvaa/DesafioPitangWebApi))

### Passo 1 — Instalar dependências

```bash
npm install
```

### Passo 2 — Rodar o projeto

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

> **Importante:** Certifique-se de que a API Backend esteja rodando em `http://localhost:5277` antes de utilizar o sistema.

### Passo 3 — Build para produção (opcional)

```bash
npm run build
npm run preview
```

---

## 📌 Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 📝 Formulário de Agendamento | Cadastro de nome, data de nascimento, dia e horário da vacina com validação completa |
| 📋 Listagem de Agendamentos | Consulta de agendamentos agrupados por dia e hora |
| ✅ Atualização de Status | Marcar se o atendimento foi realizado e registrar sua conclusão |
| 🔔 Ícone de Notificação | Exibe o total de agendamentos no cabeçalho |
| 💾 Persistência no localStorage | Os dados não são perdidos ao atualizar a página |
| 🪟 Modal de Sucesso | Feedback visual controlado por service após cada operação |
| ⚡ Loading States | Estados de carregamento durante as chamadas à API |

---

## ⭐ Destaques Técnicos

- **Sem uso de `any`** — Todo o projeto utiliza tipagem estrita com TypeScript.
- **Separação de responsabilidades** — Componentes, hooks, services, schemas e stores organizados em pastas dedicadas.
- **Gerenciamento de estado** com Zustand e persistência automática no localStorage.
- **Validação client-side** com React Hook Form + Zod, garantindo que apenas dados válidos sejam enviados à API.
- **Integração com Transação** — O formulário utiliza o endpoint `InserirCompleto` da API, que garante atomicidade na criação de paciente + agendamento.

---

## 🤝 Como Contribuir

1. Faça um **fork** do repositório.
2. Crie uma branch de feature: `git checkout -b feature/minha-feature`
3. Commit suas alterações: `git commit -m 'feat: minha nova feature'`
4. Push para a branch: `git push origin feature/minha-feature`
5. Abra um **Pull Request** para a branch `develop`.

---

## 👨‍💻 Autor

**Thiago Cavalcanti da Silva**

- GitHub: [@ThiagoCsilvaa](https://github.com/ThiagoCsilvaa)
