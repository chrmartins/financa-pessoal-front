/**
 * Configuração centralizada de todas as rotas da aplicação
 */

export const ROUTES = {
  // Rotas públicas
  PUBLIC: {
    LOGIN: "/login",
  },

  // Rotas protegidas (autenticadas)
  PRIVATE: {
    HOME: "/",
    DASHBOARD: "/dashboard",
    TRANSACOES: "/transacoes",
    CATEGORIAS: "/categorias",
    USUARIOS: "/usuarios",
  },
} as const;

// Type-safe route paths
export type PublicRoute = (typeof ROUTES.PUBLIC)[keyof typeof ROUTES.PUBLIC];
export type PrivateRoute = (typeof ROUTES.PRIVATE)[keyof typeof ROUTES.PRIVATE];
export type AppRoute = PublicRoute | PrivateRoute;

/**
 * Verifica se uma rota é pública
 */
export function isPublicRoute(path: string): boolean {
  return Object.values(ROUTES.PUBLIC).some((route) => path.startsWith(route));
}

/**
 * Verifica se uma rota é privada
 */
export function isPrivateRoute(path: string): boolean {
  return Object.values(ROUTES.PRIVATE).some((route) => path.startsWith(route));
}
