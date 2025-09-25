# 💰 Finanças Pessoais - Frontend

Um sistema moderno de controle financeiro pessoal desenvolvido com React, TypeScript e design mobile-first.

## ✨ Características

- 🎨 **Design Moderno**: Interface moderna com gradientes atraentes e componentes shadcn/ui
- 📱 **Mobile First**: Layout responsivo otimizado para dispositivos móveis
- 🏗️ **Arquitetura Escalável**: Estrutura de pastas bem organizada com separação de responsabilidades
- 🔄 **Estado Global**: Gerenciamento de estado com Zustand
- 🚀 **Performance**: Cache inteligente com React Query
- ✅ **Validação**: Validação robusta de dados com Zod
- 🌐 **API Ready**: Configurado para consumir API Spring Boot

## 🛠️ Tecnologias Utilizadas

### Core

- **React 18** - Biblioteca para construção da interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna e rápida

### UI/Styling

- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes de interface modernos
- **Lucide React** - Ícones modernos
- **Class Variance Authority** - Variantes de componentes

### Estado e Dados

- **Zustand** - Gerenciamento de estado global
- **React Query (@tanstack/react-query)** - Cache e sincronização de dados
- **Axios** - Cliente HTTP para API

### Validação

- **Zod** - Schema de validação TypeScript-first

## 🚀 Como Executar

A aplicação está rodando em: **http://localhost:5173**

```bash
# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

## 🎯 Funcionalidades Implementadas

### ✅ Dashboard

- Cards de resumo financeiro com gradientes
- Exibição de saldo, receitas, despesas e economias
- Lista de transações recentes
- Design responsivo mobile-first

### ✅ Layout

- Sidebar responsiva com navegação
- Header com informações do usuário
- Logo personalizada
- Transições e animações suaves

### ✅ Arquitetura

- Stores do Zustand configuradas
- Hooks personalizados para API
- Schemas de validação com Zod
- Serviços de API prontos para uso

## 🔗 Integração com API Spring Boot

Configurado para consumir os endpoints:

- `/api/categorias` - Gerenciamento de categorias
- `/api/transacoes` - Gerenciamento de transações
- `/api/transacoes/resumo` - Resumos financeiros

---

**Projeto frontend pronto para uso! 🎉**
