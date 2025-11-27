import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { language } = useLanguageStore();
  const t = translations[language];

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      // 관리자 권한 체크
      if (!response.user.isAdmin) {
        setError(t.notAdminError || "관리자 권한이 없습니다");
        setLoading(false);
        return;
      }

      login(response.user, response.token);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "로그인에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-wrapper">
        <div className="admin-login-icon-wrapper">
          <span className="admin-login-icon">👨‍💼</span>
        </div>
        <h1 className="admin-login-title">관리자 로그인</h1>
        <p className="admin-login-subtitle">우리말젠 Admin</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <input
            type="text"
            name="email"
            placeholder="관리자 ID 또는 이메일"
            value={formData.email}
            onChange={handleChange}
            className="admin-login-input"
            required
            autoComplete="username"
          />

          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            className="admin-login-input"
            required
            autoComplete="current-password"
          />

          {error && <p className="admin-login-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="admin-login-button"
          >
            {loading ? "로그인 중..." : "관리자 로그인"}
          </button>
        </form>

        <p className="admin-login-footer">
          일반 사용자이신가요?{" "}
          <span onClick={() => navigate("/login")} className="admin-login-link">
            사용자 로그인
          </span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
