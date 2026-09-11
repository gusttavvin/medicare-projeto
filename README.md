# MediCare+

Aplicação acadêmica desenvolvida em Next.js e TypeScript para organizar medicamentos, horários, registros de doses e acompanhamento familiar.

**Sistema publicado:** https://medicare-projeto.vercel.app

Trabalho de Administração da Produção desenvolvido por Gustavo Antonio Mendes Coelho, Pedro Pethes da Cunha Otonio e Bruno Gontijo Pereira.

## Funcionalidades

- Cadastro e login por e-mail e senha com Supabase Auth.
- Cadastro, edição, ativação e exclusão de medicamentos.
- Um ou mais horários e dias da semana por medicamento.
- Registro de doses tomadas, ignoradas ou perdidas.
- Histórico dos últimos 30 dias.
- Convites para acompanhamento familiar com acesso somente de leitura.
- Lembretes locais do navegador enquanto o sistema estiver aberto.

## Configuração

1. Copie `.env.example` para `.env.local`.
2. Preencha a URL e a chave publicável do projeto Supabase.
3. Execute `npm install`.
4. Execute `npm run dev`.

O sistema é um projeto acadêmico e não substitui orientação médica ou farmacêutica.
