import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";

const AdminLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

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

      // TODO: 관리자 권한 체크
      // if (!response.user.isAdmin) {
      //   setError('관리자 권한이 없습니다');
      //   return;
      // }

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
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <div style={styles.iconWrapper}>
          <span style={styles.adminIcon}>👨‍💼</span>
        </div>
        <h1 style={styles.title}>관리자 로그인</h1>
        <p style={styles.subtitle}>우리말젠 Admin</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="관리자 이메일"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
            autoComplete="email"
          />

          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
            autoComplete="current-password"
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "로그인 중..." : "관리자 로그인"}
          </button>
        </form>

        <p style={styles.footer}>
          일반 사용자이신가요?{" "}
          <span onClick={() => navigate("/login")} style={styles.link}>
            사용자 로그인
          </span>
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
    backgroundAttachment: "fixed",
  },
  formWrapper: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "48px",
    borderRadius: "24px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.3)",
    minWidth: "420px",
  },
  iconWrapper: {
    textAlign: "center",
    marginBottom: "20px",
  },
  adminIcon: {
    fontSize: "64px",
    display: "inline-block",
  },
  title: {
    textAlign: "center",
    color: "white",
    marginBottom: "8px",
    fontSize: "32px",
    fontWeight: "bold",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  subtitle: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: "32px",
    fontSize: "16px",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  input: {
    padding: "14px 16px",
    fontSize: "16px",
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "12px",
    color: "white",
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
  button: {
    padding: "14px",
    fontSize: "18px",
    background: "rgba(30, 58, 138, 0.6)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "white",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    marginTop: "8px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
  },
  error: {
    color: "#FCA5A5",
    textAlign: "center",
    margin: "0",
    background: "rgba(239, 68, 68, 0.2)",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(239, 68, 68, 0.3)",
  },
  footer: {
    textAlign: "center",
    marginTop: "24px",
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "14px",
  },
  link: {
    color: "white",
    cursor: "pointer",
    textDecoration: "underline",
    fontWeight: "bold",
  },
};

export default AdminLogin;
