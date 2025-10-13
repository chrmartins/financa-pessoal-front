import { lazy } from "react";
import { Route } from "react-router-dom";

// Lazy loading das páginas públicas
const Login = lazy(() =>
  import("@/pages/login").then((module) => ({ default: module.Login }))
);

export const publicRoutes = [
  <Route key="login" path="/login" element={<Login />} />,
];
