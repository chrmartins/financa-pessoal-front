import { Suspense } from "react";
import { Routes } from "react-router-dom";
import { PageLoader } from "./components/PageLoader";
import { protectedRoutes } from "./ProtectedRoutes";
import { publicRoutes } from "./PublicRoutes";

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {publicRoutes}
        {protectedRoutes}
      </Routes>
    </Suspense>
  );
}
