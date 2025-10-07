# 👥 CRUD de Usuários - Frontend

## 📋 Resumo da Implementação

Foi implementado um CRUD completo de usuários no frontend seguindo a documentação da API backend. A funcionalidade está disponível **apenas para usuários ADMIN**.

---

## 🎯 Funcionalidades Implementadas

### ✅ Listagem de Usuários

- Exibe todos os usuários ativos do sistema
- Mostra informações: Nome, Email, Papel, Status (Ativo/Inativo), Último Acesso
- Interface em formato de tabela responsiva
- Badge visual para papel (ADMIN/USER) e status

### ✅ Criar Usuário

- Modal com formulário de criação
- Campos validados: Nome (2-100 chars), Email (único e válido), Senha (mín 6 chars), Papel (ADMIN/USER), Ativo (boolean)
- Validação em tempo real com Zod
- Feedback de erro em caso de email duplicado

### ✅ Editar Usuário

- Reutiliza o mesmo modal de criação
- Campos pré-preenchidos com dados atuais
- Senha opcional (deixar vazio para não alterar)
- Atualização de qualquer campo individualmente

### ✅ Desativar Usuário (Soft Delete)

- Botão "Desativar" para usuários ativos
- Confirmação antes de desativar
- Não remove do banco, apenas define `ativo = false`
- Usuários inativos não aparecem mais na listagem

---

## 📁 Arquivos Criados/Modificados

### 1. **Tipos e Interfaces**

📄 `src/types/index.ts`

```typescript
export interface Usuario {
  id: string; // UUID
  nome: string;
  email: string;
  papel: "ADMIN" | "USER";
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string | null;
  ultimoAcesso: string | null;
}

export interface CreateUsuarioRequest { ... }
export interface UpdateUsuarioRequest { ... }
```

### 2. **Serviço de API**

📄 `src/services/usuarios/usuario-service.ts`

- `listarUsuarios()` - GET /api/usuarios
- `obterUsuarioAtual()` - GET /api/usuarios/atual
- `buscarPorId(id)` - GET /api/usuarios/{id}
- `buscarPorEmail(email)` - GET /api/usuarios/email/{email}
- `criar(data)` - POST /api/usuarios 🔒 ADMIN
- `atualizar(id, data)` - PUT /api/usuarios/{id} 🔒 ADMIN
- `desativar(id)` - DELETE /api/usuarios/{id} 🔒 ADMIN

### 3. **Hooks React Query**

📄 `src/hooks/queries/usuarios/`

- `use-usuarios-list.ts` - Lista todos usuários
- `use-usuario-atual.ts` - Obtém usuário logado
- `use-usuario-detail.ts` - Busca por ID
- `use-usuario-create.ts` - Cria novo usuário
- `use-usuario-update.ts` - Atualiza usuário
- `use-usuario-delete.ts` - Desativa usuário

### 4. **Schemas de Validação**

📄 `src/schemas/index.ts`

```typescript
export const createUsuarioSchema = z.object({
  nome: z.string().min(2).max(100),
  email: z.string().email(),
  senha: z.string().min(6),
  papel: z.enum(["ADMIN", "USER"]),
  ativo: z.boolean().default(true),
});

export const updateUsuarioSchema = z.object({ ... }).partial();
```

### 5. **Componentes UI**

📄 `src/components/ui/badge.tsx` - Componente Badge para status/papel
📄 `src/components/usuarioModal/index.tsx` - Modal de criação/edição

### 6. **Páginas**

📄 `src/pages/usuarios/index.tsx` - Página principal com tabela e ações

### 7. **Rotas e Navegação**

📄 `src/App.tsx` - Adicionada rota `/usuarios`
📄 `src/components/layout/layout.tsx` - Link no menu lateral (apenas ADMIN)

---

## 🔐 Controle de Acesso

### Frontend

- Link "Usuários" **visível apenas** para papel `ADMIN`
- Filtro implementado no `Layout.tsx`:

```typescript
const filteredMenuItems = menuItems.filter((item) => {
  if (!item.adminOnly) return true;
  return user?.papel === "ADMIN";
});
```

### Backend

- Endpoints de leitura (GET): Qualquer usuário autenticado ✅
- Endpoints de escrita (POST/PUT/DELETE): **Apenas ADMIN** 🔒
- Proteção com `@PreAuthorize("hasRole('ADMIN')")`

---

## 🧪 Como Testar

### 1. Login como ADMIN

```bash
URL: http://localhost:5174/login
Email: admin@financeiro.com
Senha: teste123
```

### 2. Acessar Gestão de Usuários

- No menu lateral, clique em **"Usuários"**
- Você verá a lista de usuários cadastrados

### 3. Criar Novo Usuário

1. Clique no botão **"Novo Usuário"**
2. Preencha os campos:
   - Nome: João Silva
   - Email: joao@teste.com
   - Senha: senha123
   - Papel: USER
   - Ativo: ✅
3. Clique em **"Criar"**
4. Verifique se aparece na lista

### 4. Editar Usuário

1. Clique em **"Editar"** em qualquer usuário
2. Modifique campos desejados
3. **Deixe senha vazia** para não alterar
4. Clique em **"Atualizar"**

### 5. Desativar Usuário

1. Clique em **"Desativar"**
2. Confirme a ação
3. Usuário desaparece da listagem (ativo = false)

---

## 🎨 Interface do Usuário

### Página de Listagem

- **Cabeçalho**: Título + Botão "Novo Usuário"
- **Card**: Tabela com colunas
  - Nome (com ID resumido)
  - Email
  - Papel (Badge colorido: ADMIN=azul, USER=cinza)
  - Status (Badge: Ativo=verde, Inativo=vermelho)
  - Último Acesso (formatado pt-BR)
  - Ações (Editar + Desativar)
- **Empty State**: Mensagem quando não há usuários

### Modal de Criação/Edição

- **Campos**:
  - Nome (Input texto)
  - Email (Input email)
  - Senha (Input password, opcional ao editar)
  - Papel (Select: USER/ADMIN)
  - Ativo (Switch on/off)
- **Botões**: Cancelar | Criar/Atualizar
- **Validação**: Erros em vermelho abaixo dos campos

---

## 🔄 React Query - Cache e Invalidação

### Invalidação Automática

Após criar/atualizar/desativar, o React Query automaticamente:

```typescript
queryClient.invalidateQueries({ queryKey: ["usuarios"] });
queryClient.invalidateQueries({ queryKey: ["usuario"] });
```

Isso garante que a lista sempre está sincronizada com o backend.

---

## 📱 Responsividade

- ✅ Tabela com scroll horizontal em telas pequenas
- ✅ Modal adaptável para mobile
- ✅ Badges e botões redimensionados

---

## 🚀 Próximos Passos (Opcionais)

- [ ] Adicionar paginação na listagem
- [ ] Implementar filtros (busca por nome/email)
- [ ] Adicionar ordenação de colunas
- [ ] Exibir usuários inativos em aba separada
- [ ] Implementar reativação de usuários
- [ ] Adicionar histórico de alterações

---

## 🐛 Tratamento de Erros

### Validações Frontend (Zod)

- Nome: 2-100 caracteres
- Email: formato válido
- Senha: mínimo 6 caracteres (apenas ao criar ou se informada)
- Papel: obrigatório (ADMIN ou USER)

### Erros da API

- **409 Conflict**: Email já cadastrado
- **403 Forbidden**: Usuário não é ADMIN
- **404 Not Found**: Usuário não existe
- Mensagens exibidas via `alert()` (pode ser melhorado com toast)

---

## 📊 Tecnologias Utilizadas

- **React 19** + TypeScript
- **React Query** - Cache e sincronização de estado servidor
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Axios** - Cliente HTTP com interceptors JWT
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis (Dialog, Select, Switch)
- **Lucide React** - Ícones

---

**Implementado em**: 06/10/2025  
**Status**: ✅ Completo e pronto para testes  
**Ambiente**: http://localhost:5174 (Dev) | https://financa-pessoal-production.up.railway.app/api (Produção)
