import { useUserStore } from "@/stores/auth/use-user-store";
import type {
  CategoriaResponse,
  CreateCategoriaRequest,
  UpdateCategoriaRequest,
} from "@/types";
import type { AxiosResponse } from "axios";
import { api } from "../middleware/interceptors";

const getAuthenticatedUserId = (): string => {
  const { user } = useUserStore.getState();

  if (!user?.id) {
    throw new Error("Usuário não autenticado. Faça login para continuar.");
  }

  return user.id;
};

/**
 * Serviço para operações relacionadas a Categorias
 */
export const categoriaService = {
  /**
   * Listar todas as categorias
   */
  list: async (): Promise<CategoriaResponse[]> => {
    const usuarioId = getAuthenticatedUserId();

    const response: AxiosResponse<CategoriaResponse[]> = await api.get(
      "/categorias",
      {
        params: { usuarioId },
      }
    );
    return response.data;
  },

  /**
   * Buscar categoria por ID
   */
  getById: async (id: string): Promise<CategoriaResponse> => {
    const usuarioId = getAuthenticatedUserId();

    const response: AxiosResponse<CategoriaResponse> = await api.get(
      `/categorias/${id}`,
      {
        params: { usuarioId },
      }
    );
    return response.data;
  },

  /**
   * Criar nova categoria
   */
  create: async (data: CreateCategoriaRequest): Promise<CategoriaResponse> => {
    const usuarioId = getAuthenticatedUserId();

    const response: AxiosResponse<CategoriaResponse> = await api.post(
      "/categorias",
      data,
      {
        params: { usuarioId },
      }
    );
    return response.data;
  },

  /**
   * Atualizar categoria
   */
  update: async (
    id: string,
    data: UpdateCategoriaRequest
  ): Promise<CategoriaResponse> => {
    const usuarioId = getAuthenticatedUserId();

    const response: AxiosResponse<CategoriaResponse> = await api.put(
      `/categorias/${id}`,
      data,
      {
        params: { usuarioId },
      }
    );
    return response.data;
  },

  /**
   * Deletar uma categoria
   */
  delete: async (id: string): Promise<void> => {
    const usuarioId = getAuthenticatedUserId();

    await api.delete(`/categorias/${id}`, {
      params: { usuarioId },
    });
  },
};

/**
 * Função para testar se o endpoint de categorias está funcionando
 */
export const testCategorias = async (): Promise<boolean> => {
  try {
    await categoriaService.list();
    return true;
  } catch {
    return false;
  }
};
