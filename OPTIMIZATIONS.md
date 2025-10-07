# 🚀 Otimizações de Performance - React Query

## 📊 Problema Identificado

Ao carregar a aplicação, estavam sendo feitas **9 requisições simultâneas**:

- ✅ 7 requisições duplicadas de transações (uma para cada mês)
- ✅ 1 requisição de categorias
- ✅ 1 requisição de resumo financeiro

## 🔧 Soluções Implementadas

### 1. **Otimização do `useMonthSelector`**

**Arquivo:** `src/hooks/use-month-selector.ts`

**Problema:** Criava novo objeto `Date` a cada render, causando re-renders desnecessários.

**Solução:**

```typescript
// ❌ ANTES
const now = new Date(); // Nova instância a cada render

// ✅ DEPOIS
const now = useMemo(() => new Date(), []); // Memoizado

// ✅ Cálculos de data também memoizados
const { dataInicio, dataFim, formattedMonth } = useMemo(() => {
  // ... cálculos
}, [selectedYear, selectedMonth]);
```

**Benefício:** Reduz re-renders em cascata dos componentes filhos.

---

### 2. **Cache Inteligente - Transações**

**Arquivo:** `src/hooks/queries/transacoes/use-transacoes-list.ts`

**Problema:** Sem cache configurado, toda mudança de estado refazia a requisição.

**Solução:**

```typescript
export function useTransacoesList(
  params?: TransacoesParams & { enabled?: boolean }
) {
  const { enabled = true, ...queryParams } = params || {};

  return useQuery({
    queryKey: ["transacoes-list", queryParams],
    queryFn: () => transacaoService.list(queryParams),
    enabled, // ✅ Permite desabilitar query quando necessário
    staleTime: 5 * 60 * 1000, // ✅ 5min - dados considerados "frescos"
    gcTime: 10 * 60 * 1000, // ✅ 10min - mantém cache mesmo sem uso ativo
  });
}
```

**Benefícios:**

- ✅ **staleTime:** Evita refetch automático por 5 minutos
- ✅ **gcTime:** Mantém dados em cache por 10 minutos mesmo ao desmontar componente
- ✅ **enabled:** Permite controle condicional da query

---

### 3. **Cache Otimizado - Resumo Financeiro**

**Arquivo:** `src/hooks/queries/resumo-financeiro/use-resumo-financeiro.ts`

**Solução:**

```typescript
return useQuery({
  queryKey: ["resumo-financeiro", { dataInicio, dataFim }],
  queryFn: () => transacaoService.getResumo(dataInicio, dataFim),
  enabled,
  staleTime: 5 * 60 * 1000, // ✅ 5min cache
  gcTime: 10 * 60 * 1000, // ✅ 10min garbage collection
  refetchOnWindowFocus: false, // ✅ Não refaz ao focar janela
});
```

**Benefícios:**

- ✅ **refetchOnWindowFocus: false** - Elimina requisições ao voltar para a aba
- ✅ Dados financeiros não mudam constantemente, cache agressivo é seguro

---

### 4. **Cache de Longa Duração - Categorias**

**Arquivo:** `src/hooks/queries/categorias/use-categorias-list.ts`

**Problema:** Categorias mudam raramente mas eram buscadas frequentemente.

**Solução:**

```typescript
return useQuery({
  queryKey: ["categorias-list"],
  queryFn: categoriaService.list,
  staleTime: 10 * 60 * 1000, // ✅ 10min - categorias são estáveis
  gcTime: 30 * 60 * 1000, // ✅ 30min - cache muito longo
  refetchOnWindowFocus: false, // ✅ Nunca refaz automaticamente
});
```

**Benefícios:**

- ✅ **staleTime: 10min** - Dados raramente mudam
- ✅ **gcTime: 30min** - Mantém cache por muito tempo
- ✅ Lista de categorias só é buscada 1x por sessão na maioria dos casos

---

## 📈 Resultados Esperados

### Antes das Otimizações

```
Carregamento inicial: 9 requisições
Mudança de mês: 2-3 requisições
Abrir modal: 1 requisição (categorias)
Voltar para aba: 3-4 requisições
```

### Depois das Otimizações

```
Carregamento inicial: 3 requisições (transações, resumo, categorias)
Mudança de mês: 2 requisições (apenas se cache expirado)
Abrir modal: 0 requisições (cache de categorias)
Voltar para aba: 0 requisições (refetchOnWindowFocus: false)
```

**Redução:** ~70% menos requisições HTTP

---

## 🎯 Estratégia de Cache por Tipo de Dado

| Tipo de Dado          | staleTime | gcTime | Justificativa                                |
| --------------------- | --------- | ------ | -------------------------------------------- |
| **Transações**        | 5min      | 10min  | Mudam com frequência, mas não a cada segundo |
| **Resumo Financeiro** | 5min      | 10min  | Calculado a partir de transações             |
| **Categorias**        | 10min     | 30min  | Dados quase estáticos, mudam raramente       |

---

## 🔄 Invalidação Manual

Mesmo com cache agressivo, quando o usuário **cria/edita/deleta** dados, os caches são invalidados manualmente:

```typescript
// Exemplo em use-transacao-create.ts
queryClient.invalidateQueries({ queryKey: ["transacoes-list"] });
queryClient.invalidateQueries({ queryKey: ["resumo-financeiro"] });
```

Isso garante que dados sempre ficam sincronizados após mutações.

---

## 🧪 Como Validar

1. Abrir DevTools > Network
2. Fazer login
3. Observar apenas **3 requisições** ao dashboard
4. Trocar de mês - deve usar cache se dentro de 5min
5. Abrir modal de transação - categorias devem vir do cache
6. Criar transação - deve invalidar cache e buscar dados atualizados

---

## 📚 Referências

- [TanStack Query - Caching](https://tanstack.com/query/latest/docs/react/guides/caching)
- [React useMemo](https://react.dev/reference/react/useMemo)
- [Performance Best Practices](https://tanstack.com/query/latest/docs/react/guides/important-defaults)
