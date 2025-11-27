import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  // 인증되지 않은 경우 관리자 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // 인증은 되었지만 관리자가 아닌 경우 일반 로그인 페이지로 리다이렉트
  if (!user?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // 관리자 권한이 있는 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default ProtectedAdminRoute;
