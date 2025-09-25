import type {
  CategoriaResponse,
  CreateCategoriaRequest,
  UpdateCategoriaRequest,
} from "@/types";
import type { AxiosResponse } from "axios";
import { api } from "../middleware/interceptors";

/**
 * Serviço para operações relacionadas a Categorias
 */
export const categoriaService = {
  /**
   * Listar todas as categorias
   */
  list: async (): Promise<CategoriaResponse[]> => {
    try {
      const response: AxiosResponse<CategoriaResponse[]> = await api.get(
        "/categorias"
      );
      console.log("📂 Categorias carregadas:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao carregar categorias:", error);
      throw error;
    }
  },

  /**
   * Buscar categoria por ID
   */
  getById: async (id: number): Promise<CategoriaResponse> => {
    try {
      const response: AxiosResponse<CategoriaResponse> = await api.get(
        `/categorias/${id}`
      );
      console.log(`📂 Categoria ${id} carregada:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao carregar categoria ${id}:`, error);
      throw error;
    }
  },

  /**
   * Criar nova categoria
   */
  create: async (data: CreateCategoriaRequest): Promise<CategoriaResponse> => {
    try {
      const response: AxiosResponse<CategoriaResponse> = await api.post(
        "/categorias",
        data
      );
      console.log("✅ Categoria criada:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao criar categoria:", error);
      throw error;
    }
  },

  /**
   * Atualizar categoria
   */
  update: async (
    id: number,
    data: UpdateCategoriaRequest
  ): Promise<CategoriaResponse> => {
    const response: AxiosResponse<CategoriaResponse> = await api.put(
      `/categorias/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Deletar uma categoria
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },
};

/**
 * Função para testar se o endpoint de categorias está funcionando
 */
export const testCategorias = async (): Promise<boolean> => {
  try {
    await categoriaService.list();
    console.log("🟢 Categorias endpoint working");
    return true;
  } catch (error) {
    console.warn("🔴 Categorias endpoint failed:", error);
    return false;
  }
};
