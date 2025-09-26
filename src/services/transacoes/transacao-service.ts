import type {
  CreateTransacaoRequest,
  TransacaoResponse,
  UpdateTransacaoRequest,
} from "@/types";
import type { AxiosResponse } from "axios";
import { api } from "../middleware/interceptors";

/**
 * Parâmetros para filtrar transações
 */
export interface TransacaoListParams {
  page?: number;
  size?: number;
  tipo?: "RECEITA" | "DESPESA";
  categoriaId?: string;
  dataInicio?: string;
  dataFim?: string;
  descricao?: string;
}

/**
 * IDs de usuários para mock temporário
 * Usando UUIDs reais cadastrados no banco
 */
export const MOCK_USER_IDS = {
  DEFAULT: "550e8400-e29b-41d4-a716-446655440001", // UUID real do banco
  ALTERNATIVE: "550e8400-e29b-41d4-a716-446655440002", // UUID real alternativo
  TERCEIRO: "550e8400-e29b-41d4-a716-446655440003", // UUID real terceiro
} as const;

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

    const searchParams = new URLSearchParams();

    // Adicionar apenas os parâmetros aceitos pelo backend
    if (params) {
      // Backend aceita apenas dataInicio e dataFim, ignorar page/size
      const { dataInicio, dataFim } = params;

      // Garantir formato ISO (YYYY-MM-DD) para as datas
      if (
        dataInicio !== undefined &&
        dataInicio !== null &&
        dataInicio !== ""
      ) {
        const dataInicioFormatted = new Date(dataInicio)
          .toISOString()
          .split("T")[0];
        console.log(
          `📅 Data início formatada: ${dataInicio} -> ${dataInicioFormatted}`
        );
        searchParams.append("dataInicio", dataInicioFormatted);
      }
      if (dataFim !== undefined && dataFim !== null && dataFim !== "") {
        const dataFimFormatted = new Date(dataFim).toISOString().split("T")[0];
        console.log(`📅 Data fim formatada: ${dataFim} -> ${dataFimFormatted}`);
        searchParams.append("dataFim", dataFimFormatted);
      }
    }

    console.log(
      "🔍 Buscando transações com parâmetros:",
      Object.fromEntries(searchParams)
    );

    console.log(`🆔 Usando usuarioId: ${usuarioId}`);
    console.log(
      `🔗 URL completa: /transacoes/usuario/${usuarioId}?${searchParams.toString()}`
    );

    try {
      const response: AxiosResponse<TransacaoResponse[]> = await api.get(
        `/transacoes/usuario/${usuarioId}?${searchParams.toString()}`
      );

      // Implementar paginação no frontend já que o backend não suporta
      const allTransactions = response.data;

      const page = params?.page || 0;
      const size = params?.size || 10;

      // Para buscar "transações recentes" (size pequeno), ordenar ANTES de paginar
      // para garantir que pegamos as mais recentes, não aleatórias
      const isRecentTransactions = size <= 10; // Dashboard usa size=5, considerar <=10 como "recentes"

      let processedTransactions = allTransactions;
      if (isRecentTransactions) {
        // Ordenar por dataCriacao decrescente ANTES de paginar
        processedTransactions = [...allTransactions].sort((a, b) => {
          const dateA = new Date(a.dataCriacao).getTime();
          const dateB = new Date(b.dataCriacao).getTime();
          return dateB - dateA; // Decrescente: mais recente criada primeiro
        });
      }

      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedContent = processedTransactions.slice(
        startIndex,
        endIndex
      );
      const totalPages = Math.ceil(allTransactions.length / size);

      // Transformar resposta em formato paginado
      const transacaoListResponse: TransacaoListResponse = {
        content: paginatedContent,
        totalElements: allTransactions.length,
        totalPages: totalPages,
        number: page,
        size: size,
      };

      console.log(
        `📋 Encontradas ${transacaoListResponse.content.length} transações de ${
          transacaoListResponse.totalElements
        } total (página ${page + 1} de ${totalPages})${
          isRecentTransactions ? " - PRÉ-ORDENADAS por data decrescente" : ""
        }`
      );

      return transacaoListResponse;
    } catch (error) {
      console.error("❌ Erro ao buscar transações:", error);
      throw error;
    }
  },

  /**
   * Buscar transação por ID
   */
  getById: async (id: string): Promise<TransacaoResponse> => {
    const response: AxiosResponse<TransacaoResponse> = await api.get(
      `/transacoes/${id}`
    );
    return response.data;
  },

  /**
   * Criar nova transação (simples ou recorrente)
   * Backend processa automaticamente as parcelas quando recorrente=true
   */
  create: async (data: CreateTransacaoRequest): Promise<TransacaoResponse> => {
    // 🚧 MOCK TEMPORÁRIO - usuarioId fixo válido do banco
    // TODO: Em produção, este ID deve vir da autenticação do usuário logado
    const usuarioId = MOCK_USER_IDS.DEFAULT;

    console.log("📤 Dados sendo enviados:", data);
    console.log("� Usuario ID usado:", usuarioId);

    try {
      const response: AxiosResponse<TransacaoResponse> = await api.post(
        `/transacoes?usuarioId=${usuarioId}`,
        data
      );

      console.log("✅ Transação criada com sucesso:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Erro ao criar transação:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        payload: data,
        usuarioId,
      });
      throw error;
    }
  },

  /**
   * Atualizar transação existente
   */
  update: async (
    id: string,
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
  delete: async (id: string): Promise<void> => {
    await api.delete(`/transacoes/${id}`);
  },

  /**
   * Obter resumo financeiro por período
   * Fallback: Se endpoint /resumo não existir, calcula baseado nas transações
   */
  getResumo: async (dataInicio?: string, dataFim?: string): Promise<any> => {
    const usuarioId = MOCK_USER_IDS.DEFAULT;

    // Se não informar datas, usar o mês atual como padrão
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    const dataInicioFinal = dataInicio || inicioMes;
    const dataFimFinal = dataFim || fimMes;

    console.log(`📊 Buscando resumo financeiro:`, {
      usuarioId,
      dataInicio: dataInicioFinal,
      dataFim: dataFimFinal,
    });

    // Backend requer todos os parâmetros obrigatórios
    const params = new URLSearchParams({
      usuarioId: usuarioId,
      dataInicio: dataInicioFinal,
      dataFim: dataFimFinal,
    });

    const response: AxiosResponse<any> = await api.get(
      `/transacoes/resumo?${params.toString()}`
    );

    console.log("✅ Resumo obtido do backend:", response.data);
    return response.data;
  },

  /**
   * MÉTODOS PARA TRANSAÇÕES RECORRENTES
   * (Mantidos para compatibilidade, mas não necessários no novo fluxo)
   */

  /**
   * Listar transações recorrentes ativas
   */
  listRecorrentes: async (): Promise<TransacaoResponse[]> => {
    const usuarioId = MOCK_USER_IDS.DEFAULT;
    const response: AxiosResponse<TransacaoResponse[]> = await api.get(
      `/transacoes/recorrentes?usuarioId=${usuarioId}`
    );
    return response.data;
  },

  /**
   * Cancelar recorrência (pausar próximas parcelas)
   */
  cancelarRecorrencia: async (recorrenciaId: string): Promise<void> => {
    await api.delete(`/transacoes/recorrentes/${recorrenciaId}`);
  },

  /**
   * Atualizar configuração de recorrência
   */
  updateRecorrencia: async (
    recorrenciaId: string,
    data: {
      ativa?: boolean;
      proximasQuantidade?: number;
      valor?: number;
    }
  ): Promise<TransacaoResponse> => {
    const response: AxiosResponse<TransacaoResponse> = await api.put(
      `/transacoes/recorrentes/${recorrenciaId}`,
      data
    );
    return response.data;
  },
};
