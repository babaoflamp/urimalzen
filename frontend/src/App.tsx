import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAIContent from "./pages/AdminAIContent";
import AdminTTS from "./pages/AdminTTS";
import AdminSTT from "./pages/AdminSTT";
import AdminStatistics from "./pages/AdminStatistics";
import AdminUsers from "./pages/AdminUsers";
import AdminWords from "./pages/AdminWords";
import AdminRecordings from "./pages/AdminRecordings";
import AdminKIIP from "./pages/AdminKIIP";
import AdminSystem from "./pages/AdminSystem";
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
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/ai-content"
          element={
            <ProtectedAdminRoute>
              <AdminAIContent />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/tts"
          element={
            <ProtectedAdminRoute>
              <AdminTTS />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/stt"
          element={
            <ProtectedAdminRoute>
              <AdminSTT />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/statistics"
          element={
            <ProtectedAdminRoute>
              <AdminStatistics />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedAdminRoute>
              <AdminUsers />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/words"
          element={
            <ProtectedAdminRoute>
              <AdminWords />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/recordings"
          element={
            <ProtectedAdminRoute>
              <AdminRecordings />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/kiip"
          element={
            <ProtectedAdminRoute>
              <AdminKIIP />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/system"
          element={
            <ProtectedAdminRoute>
              <AdminSystem />
            </ProtectedAdminRoute>
          }
        />

        {/* 기타 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
