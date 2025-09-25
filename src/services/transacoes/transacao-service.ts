import type {
  CreateTransacaoRequest,
  TransacaoResponse,
  UpdateTransacaoRequest,
} from "@/types";
import type { AxiosResponse } from "axios";
import { api } from "../middleware/interceptors";

// 🚧 MOCK TEMPORÁRIO - IDs de usuário válidos do banco
// TODO: Remover quando implementar autenticação
const MOCK_USER_IDS = {
  DEFAULT: "550e8400-e29b-41d4-a716-446655440001",
  USER_2: "550e8400-e29b-41d4-a716-446655440002",
  USER_3: "550e8400-e29b-41d4-a716-446655440003",
} as const;

/**
 * Parâmetros para filtrar transações
 */
export interface TransacaoListParams {
  page?: number;
  size?: number;
  dataInicio?: string;
  dataFim?: string;
  categoriaId?: number;
  tipo?: "RECEITA" | "DESPESA";
}

/**
 * Resposta paginada de transações
 */
export interface TransacaoListResponse {
  content: TransacaoResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

/**
 * Serviço para operações relacionadas a Transações
 */
export const transacaoService = {
  /**
   * Listar transações com filtros opcionais
   */
  list: async (
    params?: TransacaoListParams
  ): Promise<TransacaoListResponse> => {
    // 🚧 MOCK TEMPORÁRIO - usuarioId fixo válido do banco
    // TODO: Em produção, este ID deve vir da autenticação do usuário logado
    const usuarioId = MOCK_USER_IDS.DEFAULT;

    const response = await api.get(`/transacoes/usuario/${usuarioId}`, {
      params,
    });

    // O backend retorna uma lista simples, vamos simular paginação
    const transacoes = response.data || [];

    // Ordenar por data mais recente primeiro (dataTransacao DESC, depois dataCriacao DESC como fallback)
    const transacoesOrdenadas = transacoes.sort((a: any, b: any) => {
      // Primeiro critério: dataTransacao (mais recente primeiro)
      const dataA = new Date(a.dataTransacao);
      const dataB = new Date(b.dataTransacao);

      if (dataA.getTime() !== dataB.getTime()) {
        return dataB.getTime() - dataA.getTime(); // DESC
      }

      // Segundo critério: dataCriacao (mais recente primeiro) como fallback
      const criacaoA = new Date(a.dataCriacao);
      const criacaoB = new Date(b.dataCriacao);
      return criacaoB.getTime() - criacaoA.getTime(); // DESC
    });

    // Aplicar paginação manual se necessário
    const page = params?.page || 0;
    const size = params?.size || 10;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedData = transacoesOrdenadas.slice(startIndex, endIndex);

    return {
      content: paginatedData,
      totalElements: transacoesOrdenadas.length,
      totalPages: Math.ceil(transacoesOrdenadas.length / size),
      number: page,
      size: size,
    };
  },

  /**
   * Buscar transação por ID
   */
  getById: async (id: number): Promise<TransacaoResponse> => {
    const response: AxiosResponse<TransacaoResponse> = await api.get(
      `/transacoes/${id}`
    );
    return response.data;
  },

  /**
   * Criar nova transação
   */
  create: async (data: CreateTransacaoRequest): Promise<TransacaoResponse> => {
    // 🚧 MOCK TEMPORÁRIO - usuarioId fixo válido do banco
    // TODO: Em produção, este ID deve vir da autenticação do usuário logado
    const usuarioId = MOCK_USER_IDS.DEFAULT;

    const response: AxiosResponse<TransacaoResponse> = await api.post(
      `/transacoes?usuarioId=${usuarioId}`,
      data
    );

    return response.data;
    return response.data;
  },

  /**
   * Atualizar transação existente
   */
  update: async (
    id: number,
    data: UpdateTransacaoRequest
  ): Promise<TransacaoResponse> => {
    const response: AxiosResponse<TransacaoResponse> = await api.put(
      `/transacoes/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Deletar transação
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/transacoes/${id}`);
  },

  /**
   * Obter resumo financeiro
   */
  getResumo: async (dataInicio?: string, dataFim?: string) => {
    const params = {
      ...(dataInicio && { dataInicio }),
      ...(dataFim && { dataFim }),
    };
    const response = await api.get("/transacoes/resumo", { params });
    return response.data;
  },
};
