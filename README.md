# 💰 Finança Pessoal – Frontend

Aplicação web para controle financeiro pessoal. Permite acompanhar o resumo financeiro do mês, cadastrar transações, gerenciar categorias e administrar usuários (perfis ADMIN).

Este projeto consome a API disponível em `https://financa-pessoal-production.up.railway.app/api` e foi construído com React, TypeScript e Vite.

## ⚙️ Stack principal

- React 19 + TypeScript
- Vite 7
- React Router DOM
- React Hook Form + Zod
- TanStack Query (React Query)
- Zustand
- Tailwind CSS + Radix UI
- Axios com interceptors JWT

## 🚀 Executando localmente

```bash
pnpm install   # ou npm install / yarn
pnpm run dev   # inicia o servidor Vite em http://localhost:5173
```

### Variáveis de ambiente

O frontend já está configurado para apontar para o backend hospedado na Railway. Caso precise alterar:

```bash
VITE_API_URL=https://financa-pessoal-production.up.railway.app/api
```

Crie um arquivo `.env` na raiz caso deseje sobrescrever o valor padrão do `AuthService`.

## 🔐 Credenciais de teste

| Ambiente                   | E-mail               | Senha    |
| -------------------------- | -------------------- | -------- |
| Produção                   | admin@financeiro.com | teste123 |
| Dev API local (porta 8080) | admin@financeiro.com | admin123 |

> **Importante:** a API retorna HTTP 403 quando a senha não confere ou o usuário está inativo. Utilize as credenciais acima para evitar o erro "Acesso negado".

## 🧭 Funcionalidades principais

- Dashboard com resumo de receitas, despesas e tendência mensal
- Listagem, criação, edição e remoção de transações
- Gestão de categorias
- Sessão autenticada com JWT (access + refresh token)
- Administração de usuários (requer papel `ADMIN`)

## 🧪 Testes manuais sugeridos

1. **Login**: acessar `/login`, informar `admin@financeiro.com` e `teste123`.
2. **Transações**: criar uma nova transação de receita e outra de despesa; verificar atualização do resumo.
3. **Categorias**: adicionar uma nova categoria e utilizá-la em uma transação.
4. **Usuários (ADMIN)**: criar um novo usuário, editar o papel e desativá-lo.
5. **Refresh Token**: após login, limpar o token no localStorage para validar a renovação automática.

## 🗂️ Estrutura

```
src/
  components/
  hooks/
  pages/
  services/
  stores/
  utils/
```

## 📄 Licença

Projeto de uso interno. Consulte as diretrizes da equipe antes de redistribuir.
