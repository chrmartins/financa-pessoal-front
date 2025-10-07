import type {
  CreateUsuarioRequest,
  UpdateUsuarioRequest,
  Usuario,
} from "../../types";
import { api } from "../middleware/interceptors";

export class UsuarioService {
  private static BASE_URL = "/usuarios";

  /**
   * Lista todos os usuários ativos
   * Qualquer usuário autenticado pode acessar
   */
  static async listarUsuarios(): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>(this.BASE_URL);
    return response.data;
  }

  /**
   * Obtém o usuário atual (logado)
   * Qualquer usuário autenticado pode acessar
   */
  static async obterUsuarioAtual(): Promise<Usuario> {
    const response = await api.get<Usuario>(`${this.BASE_URL}/atual`);
    return response.data;
  }

  /**
   * Busca usuário por ID
   * Qualquer usuário autenticado pode acessar
   */
  static async buscarPorId(id: string): Promise<Usuario> {
    const response = await api.get<Usuario>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Busca usuário por email
   * Qualquer usuário autenticado pode acessar
   */
  static async buscarPorEmail(email: string): Promise<Usuario> {
    const response = await api.get<Usuario>(`${this.BASE_URL}/email/${email}`);
    return response.data;
  }

  /**
   * Cria novo usuário
   * 🔒 Apenas ADMIN pode acessar
   */
  static async criar(data: CreateUsuarioRequest): Promise<Usuario> {
    const response = await api.post<Usuario>(this.BASE_URL, data);
    return response.data;
  }

  /**
   * Atualiza usuário existente
   * 🔒 Apenas ADMIN pode acessar
   */
  static async atualizar(
    id: string,
    data: UpdateUsuarioRequest
  ): Promise<Usuario> {
    const response = await api.put<Usuario>(`${this.BASE_URL}/${id}`, data);
    return response.data;
  }

  /**
   * Desativa usuário (soft delete)
   * 🔒 Apenas ADMIN pode acessar
   * Não remove do banco, apenas define ativo = false
   */
  static async desativar(id: string): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`);
  }
}
