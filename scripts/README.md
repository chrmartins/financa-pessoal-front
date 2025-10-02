# 📊 Scripts de Configuração do Banco de Dados

Este diretório contém scripts SQL para configurar dados de teste no banco de dados da aplicação de finanças pessoais.

## 📁 Arquivos Disponíveis

### 🚀 **setup-completo-banco.sql** (RECOMENDADO)

Script completo que configura tudo de uma vez:

- ✅ Limpa dados existentes
- ✅ Cria 3 usuários de teste
- ✅ Cria 11 categorias (4 receitas + 7 despesas)
- ✅ Insere 10 transações para cada usuário (3 receitas + 7 despesas)
- ✅ Mostra relatório de verificação

### 📋 Scripts Individuais

- `insert-usuarios-ficticios.sql` - Apenas usuários
- `popular-transacoes-todos-usuarios.sql` - Apenas transações
- `dados-ficticios-completos.sql` - Script antigo (não usar)

## 👥 Usuários de Teste Criados

| ID                                     | Nome          | Email                  | Papel | Senha\*  |
| -------------------------------------- | ------------- | ---------------------- | ----- | -------- |
| `550e8400-e29b-41d4-a716-446655440001` | João Silva    | joao.silva@email.com   | USER  | -        |
| `550e8400-e29b-41d4-a716-446655440002` | Maria Santos  | maria.santos@email.com | USER  | -        |
| `550e8400-e29b-41d4-a716-446655440003` | Admin Sistema | admin@financeiro.com   | ADMIN | admin123 |

\*A autenticação usa Basic Auth, então a senha é definida no backend/API.

## 💰 Dados Criados por Usuário

### João Silva (Desenvolvedor)

- **Receitas**: R$ 7.500,00 (Salário + Freelance + Venda)
- **Despesas**: R$ 3.130,00 (Moradia, Alimentação, etc.)
- **Saldo**: R$ 4.370,00

### Maria Santos (Designer)

- **Receitas**: R$ 6.300,00 (Salário + Freelance + Venda)
- **Despesas**: R$ 2.405,00 (Moradia, Alimentação, etc.)
- **Saldo**: R$ 3.895,00

### Admin Sistema (Administrador)

- **Receitas**: R$ 12.000,00 (Salário + Freelance + Investimentos)
- **Despesas**: R$ 4.220,00 (Moradia, Alimentação, etc.)
- **Saldo**: R$ 7.780,00

## 🎯 Categorias Criadas

### Receitas (4)

- Salário
- Freelance
- Investimentos
- Vendas

### Despesas (7)

- Alimentação
- Transporte
- Moradia
- Saúde
- Entretenimento
- Educação
- Utilidades

## 🚀 Como Executar

### Opção 1: Script Completo (Recomendado)

```sql
-- Execute no seu banco PostgreSQL
\i scripts/setup-completo-banco.sql
```

### Opção 2: Via psql

```bash
psql -d seu_banco -f scripts/setup-completo-banco.sql
```

### Opção 3: Copiar e Colar

1. Abra o arquivo `setup-completo-banco.sql`
2. Copie todo o conteúdo
3. Execute no seu cliente PostgreSQL (pgAdmin, DBeaver, etc.)

## ⚠️ Importante

- **ATENÇÃO**: O script `setup-completo-banco.sql` apaga dados existentes!
- Use apenas em ambiente de desenvolvimento
- Verifique as conexões da aplicação antes de executar
- Os IDs são UUIDs fixos para compatibilidade com o frontend

## 🔍 Verificação

Após executar o script, você deve ver:

- ✅ 3 usuários criados
- ✅ 11 categorias criadas
- ✅ 30 transações criadas (10 por usuário)
- ✅ Relatório de saldo por usuário
- ✅ Exemplos de transações

## 🐛 Solução de Problemas

### Erro de permissão

```sql
-- Certifique-se de ter permissões adequadas
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO seu_usuario;
```

### Conflito de IDs

```sql
-- Se já existem dados, delete primeiro
DELETE FROM transacoes;
DELETE FROM categorias;
DELETE FROM usuarios WHERE id IN (...);
```

### Verificar dados

```sql
-- Contar registros
SELECT 'usuarios' as tabela, count(*) as total FROM usuarios
UNION ALL
SELECT 'categorias', count(*) FROM categorias
UNION ALL
SELECT 'transacoes', count(*) FROM transacoes;
```

## 🎉 Resultado Esperado

Após executar com sucesso, você poderá:

- ✅ Fazer login com qualquer usuário
- ✅ Ver transações específicas de cada usuário
- ✅ Testar funcionalidades de admin
- ✅ Ver dados realistas no dashboard
- ✅ Testar filtros e relatórios

Pronto para testar a aplicação! 🚀
