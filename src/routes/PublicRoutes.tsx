import { lazy } from "react";
import { Route } from "react-router-dom";

// Lazy loading das páginas públicas
const Landing = lazy(() =>
  import("@/pages/landing").then((module) => ({ default: module.LandingPage }))
);

const Login = lazy(() =>
  import("@/pages/login").then((module) => ({ default: module.Login }))
);

export const publicRoutes = [
  <Route key="landing" path="/" element={<Landing />} />,
  <Route key="login" path="/login" element={<Login />} />,
];
