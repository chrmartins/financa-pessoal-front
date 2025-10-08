import { useUserStore } from "@/stores/auth/use-user-store";
import type {
  CreateTransacaoRequest,
  TransacaoResponse,
  UpdateTransacaoRequest,
} from "@/types";
import type { ResumoFinanceiro } from "@/utils/financeiro";
import type { AxiosResponse } from "axios";
import { isAxiosError } from "axios";
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

    const queryParams: Record<string, string> = {
      usuarioId: user.id,
    };

    if (params) {
      const { dataInicio, dataFim, tipo, categoriaId, descricao } = params;

      if (dataInicio) {
        queryParams.dataInicio = new Date(dataInicio)
          .toISOString()
          .split("T")[0];
      }

      if (dataFim) {
        queryParams.dataFim = new Date(dataFim).toISOString().split("T")[0];
      }

      if (tipo) {
        queryParams.tipo = tipo;
      }

      if (categoriaId) {
        queryParams.categoriaId = categoriaId;
      }

      if (descricao) {
        queryParams.descricao = descricao;
      }
    }

    try {
      // Todos os usuários (incluindo ADMIN) veem apenas suas próprias transações
      const response: AxiosResponse<TransacaoResponse[]> = await api.get(
        "/transacoes",
        {
          params: queryParams,
        }
      );

      let allTransactions = response.data;

      // WORKAROUND: Filtrar transações por data no frontend
      // TODO: O backend deveria fazer isso, mas não está respeitando os filtros de data
      if (params?.dataInicio || params?.dataFim) {
        const dataInicioTimestamp = params.dataInicio
          ? new Date(params.dataInicio).getTime()
          : 0;
        const dataFimTimestamp = params.dataFim
          ? new Date(params.dataFim).getTime()
          : Number.MAX_SAFE_INTEGER;

        allTransactions = allTransactions.filter((t) => {
          const dataTransacao = new Date(t.dataTransacao).getTime();
          return (
            dataTransacao >= dataInicioTimestamp &&
            dataTransacao <= dataFimTimestamp
          );
        });
      }

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
        "/transacoes",
        data,
        {
          params: { usuarioId },
        }
      );

      return response.data;
    } catch (error: unknown) {
      console.error("❌ SERVICE - Erro ao criar transação:", error);

      if (isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error("Dados:", error.response?.data);
        console.error("Headers:", error.response?.headers);
        console.error("Config URL:", error.config?.url);
        throw error;
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Erro ao criar transação.");
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
  getResumo: async (
    dataInicio?: string,
    dataFim?: string
  ): Promise<ResumoFinanceiro> => {
    // Obter dados do usuário autenticado
    const { user } = useUserStore.getState();

    if (!user?.id) {
      throw new Error("Usuário não autenticado. Faça login para continuar.");
    }

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

    // Construir parâmetros baseado no papel do usuário
    const params = new URLSearchParams({
      dataInicio: dataInicioFinal,
      dataFim: dataFimFinal,
    });

    // Todos os usuários (incluindo ADMIN) veem apenas seu próprio resumo
    params.append("usuarioId", user.id);

    const response: AxiosResponse<ResumoFinanceiro | Record<string, unknown>> =
      await api.get(`/transacoes/resumo?${params.toString()}`);

    const resumoBruto = response.data ?? {};
    const resumoRecord = resumoBruto as Record<string, unknown>;

    const getNumber = (...keys: string[]): number => {
      for (const key of keys) {
        const value = resumoRecord[key];

        if (value === undefined || value === null) {
          continue;
        }

        if (typeof value === "number") {
          if (!Number.isNaN(value)) {
            return value;
          }
          continue;
        }

        if (typeof value === "string" && value.trim() !== "") {
          const parsed = Number(value);
          if (!Number.isNaN(parsed)) {
            return parsed;
          }
        }
      }
      return 0;
    };

    const saldo = getNumber("saldo", "totalSaldo");
    const receitas = getNumber("receitas", "totalReceitas");
    const despesas = getNumber("despesas", "totalDespesas");
    const totalTransacoes = getNumber("totalTransacoes", "quantidade", "total");

    const economiaInformada = getNumber("economias", "totalEconomias");
    const economias = economiaInformada || (saldo > 0 ? saldo * 0.2 : 0);

    const resumoNormalizado: ResumoFinanceiro = {
      saldo: isNaN(saldo) ? 0 : saldo,
      receitas: isNaN(receitas) ? 0 : receitas,
      despesas: isNaN(despesas) ? 0 : despesas,
      economias: isNaN(economias) ? 0 : economias,
      totalTransacoes: isNaN(totalTransacoes) ? 0 : totalTransacoes,
    };

    return resumoNormalizado;
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
