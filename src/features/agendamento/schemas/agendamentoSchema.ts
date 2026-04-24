// primeiro vai cadastrar o paciente na API.
// Com o ID retornado, o agendamento é criado usando o ID do paciente e os dados de data e hora selecionados.
// A resposta do agendamento é então usada para atualizar o estado global e exibir uma mensagem de sucesso ou erro no modal.

import { z } from 'zod';

export const agendamentoSchema = z.object({
nome : z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
dataNascimento: z.date({
    error: 'A data de nascimento é obrigatória',
}),

dataAgendamento: z.date({
    error: 'A data do agendamento é obrigatória',
}),
horaAgendamento: z.string().min(1, 'Selecione um horário para o agendamento'),
});

export type AgendamentoFormData = z.infer<typeof agendamentoSchema>;    