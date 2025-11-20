import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Learning from "./pages/Learning";
import Categories from "./pages/Categories";
import Levels from "./pages/Levels";
import Pronunciation from "./pages/Pronunciation";
import Units from "./pages/Units";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        {/* 사용자 라우트 */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={isAuthenticated ? <Learning /> : <Navigate to="/login" />}
        />
        <Route
          path="/learning"
          element={isAuthenticated ? <Learning /> : <Navigate to="/login" />}
        />
        <Route
          path="/categories"
          element={isAuthenticated ? <Categories /> : <Navigate to="/login" />}
        />
        <Route
          path="/levels"
          element={isAuthenticated ? <Levels /> : <Navigate to="/login" />}
        />
        <Route
          path="/pronunciation"
          element={
            isAuthenticated ? <Pronunciation /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/units"
          element={isAuthenticated ? <Units /> : <Navigate to="/login" />}
        />

        {/* 관리자 라우트 */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            isAuthenticated ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />

        {/* 기타 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
