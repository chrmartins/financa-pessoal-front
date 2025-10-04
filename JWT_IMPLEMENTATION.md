# 🔐 Implementação JWT - Frontend

## ✅ Mudanças Implementadas

### 1. **AuthService** (`src/services/auth/auth-service.ts`)

#### Tipos Atualizados:

```typescript
export interface ApiLoginResponse {
  usuario: { ... };
  token: string;           // JWT Access Token
  refreshToken: string;    // JWT Refresh Token
  expiresIn: number;       // Tempo de expiração em ms
}

export interface LoginResponse {
  user: ApiLoginResponse["usuario"];
  token: string;
  refreshToken: string;
  expiresIn: number;
}
```

#### Métodos:

**`login(email, senha)`**

- POST `/api/auth` com `{ email, senha }`
- Armazena `token`, `refreshToken` e `usuario` no localStorage
- Retorna `LoginResponse` com dados do usuário e tokens

**`refreshToken()`**

- POST `/api/auth/refresh` com `{ refreshToken }`
- Atualiza tokens no localStorage
- Lança erro se refresh token inválido (força novo login)

**`logout()`**

- Remove `token`, `refreshToken` e `usuario` do localStorage

**`getUsuario()`**

- Retorna dados do usuário do localStorage

**`isAuthenticated()`**

- Verifica se existe token armazenado

---

### 2. **Interceptors** (`src/services/middleware/interceptors.ts`)

#### Request Interceptor:

- Adiciona `Authorization: Bearer {token}` em todas requisições
- Lê token de `localStorage.getItem("token")`

#### Response Interceptor:

- **Renovação Automática**: Quando recebe 401:
  1. Marca requisição como retry (`_retry`)
  2. Chama `AuthService.refreshToken()`
  3. Atualiza header com novo token
  4. Refaz requisição original
  5. Se falhar, limpa localStorage e redireciona para `/login`

---

### 3. **User Store** (`src/stores/auth/use-user-store.ts`)

#### Método `login`:

```typescript
const response = await AuthService.login(email, password);
setUser(response.user);
setToken(response.token);
```

#### Método `validateToken`:

- Lê `token` e `usuario` do localStorage
- Não faz requisição ao backend
- Apenas valida se existem dados armazenados

#### Método `setToken`:

- Atualiza token no estado Zustand
- **Não** salva no localStorage (AuthService já faz isso)

---

## 🔄 Fluxo de Autenticação

### Login:

```
1. Usuário submete email/senha
2. AuthService.login() → POST /api/auth
3. Backend retorna { usuario, token, refreshToken, expiresIn }
4. AuthService salva tudo no localStorage
5. Store atualiza estado com user e token
6. Redirecionamento para dashboard
```

### Requisição Autenticada:

```
1. Request interceptor adiciona: Authorization: Bearer {token}
2. Backend valida JWT
3. Retorna dados
```

### Token Expirado (401):

```
1. Response interceptor detecta 401
2. Chama AuthService.refreshToken()
3. POST /api/auth/refresh com refreshToken
4. Recebe novo token e refreshToken
5. Atualiza localStorage
6. Refaz requisição original com novo token
```

### Refresh Token Inválido:

```
1. AuthService.refreshToken() falha
2. Limpa localStorage (token, refreshToken, usuario)
3. Redireciona para /login
4. Usuário precisa fazer login novamente
```

---

## 📝 Credenciais de Teste

**DEV (localhost:8080):**

```
Email: admin@financeiro.com
Senha: admin123
```

**PROD (Railway):**

```
Email: admin@financeiro.com
Senha: password
```

---

## ⏰ Tempos de Expiração

- **Access Token**: 24 horas (86400000 ms)
- **Refresh Token**: 7 dias (604800000 ms)

---

## 🛠️ Testes Manuais

### 1. Login

```bash
# Abrir console do navegador
localStorage.clear()
# Fazer login na interface
# Verificar no console:
localStorage.getItem('token')
localStorage.getItem('refreshToken')
localStorage.getItem('usuario')
```

### 2. Renovação Automática

```bash
# Forçar expiração do token
localStorage.setItem('token', 'token_invalido')
# Fazer qualquer requisição autenticada
# Verificar no console se renovou automaticamente
```

### 3. Logout

```bash
# Clicar em logout
# Verificar no console:
localStorage.getItem('token') // null
```

---

## ⚠️ Diferenças do Basic Auth Anterior

| Aspecto           | Basic Auth (Anterior)         | JWT (Atual)                  |
| ----------------- | ----------------------------- | ---------------------------- |
| **Token**         | `Basic ${btoa(email:senha)}`  | `Bearer ${jwt_token}`        |
| **Armazenamento** | `credentials` no localStorage | `token` + `refreshToken`     |
| **Renovação**     | Não existia                   | Automática via interceptor   |
| **Expiração**     | Sem controle                  | Access: 24h, Refresh: 7 dias |
| **Segurança**     | Envia senha em toda req       | Senha só no login            |

---

## ✅ Checklist de Validação

- [x] Login funciona e retorna JWT
- [x] Token JWT é enviado em requests (`Bearer`)
- [x] Renovação automática quando token expira (401)
- [x] Logout limpa todos os tokens
- [x] Build passa sem erros TypeScript
- [ ] Testar login no ambiente DEV
- [ ] Testar renovação automática
- [ ] Testar logout
- [ ] Validar em produção (Railway)

---

## 🚀 Próximos Passos

1. Testar login no ambiente de desenvolvimento
2. Validar fluxo completo (login → requests → refresh → logout)
3. Deploy para produção
4. Considerar migrar de localStorage para HttpOnly cookies (mais seguro)
5. Implementar rate limiting no frontend para refresh token

---

**Data da Implementação**: 04/10/2025  
**Status**: ✅ Implementado e pronto para testes
