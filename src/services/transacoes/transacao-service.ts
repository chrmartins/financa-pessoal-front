import { useUserStore } from "@/stores/auth/use-user-store";
import type {
  CreateTransacaoRequest,
  TransacaoResponse,
  UpdateTransacaoRequest,
} from "@/types";
import type { AxiosResponse } from "axios";
import { api } from "../middleware/interceptors";

/**
 * Função para obter o ID do usuário autenticado
 */
const getAuthenticatedUserId = (): string => {
  const { user } = useUserStore.getState();

  if (!user?.id) {
    throw new Error("Usuário não autenticado. Faça login para continuar.");
  }

  return user.id;
};

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
    // Obter dados do usuário autenticado
    const { user } = useUserStore.getState();

    if (!user?.id) {
      throw new Error("Usuário não autenticado. Faça login para continuar.");
    }

    console.log(
      "🔍 Buscando transações para usuário:",
      user.nome,
      "- Papel:",
      user.papel
    );

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
        searchParams.append("dataInicio", dataInicioFormatted);
      }
      if (dataFim !== undefined && dataFim !== null && dataFim !== "") {
        const dataFimFormatted = new Date(dataFim).toISOString().split("T")[0];
        searchParams.append("dataFim", dataFimFormatted);
      }
    }

    try {
      let response: AxiosResponse<TransacaoResponse[]>;

      // Se é admin, buscar todas as transações; senão, buscar apenas do usuário
      if (user.papel === "ADMIN") {
        console.log("👑 Admin: buscando todas as transações");
        response = await api.get(`/transacoes?${searchParams.toString()}`);
      } else {
        console.log("👤 Usuário normal: buscando transações específicas");
        response = await api.get(
          `/transacoes/usuario/${user.id}?${searchParams.toString()}`
        );
      }

      const allTransactions = response.data;
      console.log(
        "📊 Total de transações encontradas:",
        allTransactions.length
      );

      const page = params?.page || 0;
      const size = params?.size || 10;

      const isRecentTransactions = size <= 10;

      let processedTransactions = allTransactions;
      if (isRecentTransactions) {
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
    // Obter ID do usuário autenticado
    const usuarioId = getAuthenticatedUserId();

    try {
      const response: AxiosResponse<TransacaoResponse> = await api.post(
        `/transacoes?usuarioId=${usuarioId}`,
        data
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "❌ SERVICE - Erro:",
        error.response?.status,
        error.response?.data
      );
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
    // Obter ID do usuário autenticado
    const usuarioId = getAuthenticatedUserId();

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

    // Backend requer todos os parâmetros obrigatórios
    const params = new URLSearchParams({
      usuarioId: usuarioId,
      dataInicio: dataInicioFinal,
      dataFim: dataFimFinal,
    });

    const response: AxiosResponse<any> = await api.get(
      `/transacoes/resumo?${params.toString()}`
    );

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
    // Obter ID do usuário autenticado
    const usuarioId = getAuthenticatedUserId();
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
