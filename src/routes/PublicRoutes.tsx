import { Route } from "react-router-dom";
import { LandingPageGuard } from "./LandingPageGuard";
import { LoginPageGuard } from "./LoginPageGuard";

export const publicRoutes = [
  <Route key="landing" path="/" element={<LandingPageGuard />} />,
  <Route key="login" path="/login" element={<LoginPageGuard />} />,
];
