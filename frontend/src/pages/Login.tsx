import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    region: "",
    country: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const response = await authAPI.register(formData);
        login(response.user, response.token);
      } else {
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });
        login(response.user, response.token);
      }
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "오류가 발생했습니다");
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
      {/* Left Side - Platform Introduction */}
      <div style={styles.introSection}>
        <div style={styles.introContent}>
          <h1 style={styles.platformTitle}>
            우리말젠 <span style={styles.platformSubtitle}>Urimalzen</span>
          </h1>
          <p style={styles.platformTagline}>
            KIIP 기반 한국어 학습 플랫폼
          </p>
          <p style={styles.platformDescription}>
            대한민국 이주민을 위한 체계적인 한국어 교육 솔루션
          </p>

          <div style={styles.featuresSection}>
            <h3 style={styles.featuresTitle}>✨ 주요 특징</h3>
            <ul style={styles.featuresList}>
              <li style={styles.featureItem}>
                📚 법무부 KIIP 공식 커리큘럼 기반
              </li>
              <li style={styles.featureItem}>
                🎯 6단계 레벨 시스템 (0-5급)
              </li>
              <li style={styles.featureItem}>
                🌏 다국어 지원 (모국어 기반 학습)
              </li>
              <li style={styles.featureItem}>
                🎤 발음 연습 및 음성 녹음
              </li>
              <li style={styles.featureItem}>
                📊 진도 추적 및 순위 시스템
              </li>
            </ul>
          </div>

          <div style={styles.languagesSection}>
            <h3 style={styles.languagesTitle}>🌐 지원 언어</h3>
            <div style={styles.languageFlags}>
              <span style={styles.flagItem} title="몽골어">🇲🇳</span>
              <span style={{...styles.flagItem, ...styles.flagComingSoon}} title="베트남어 (예정)">🇻🇳</span>
              <span style={{...styles.flagItem, ...styles.flagComingSoon}} title="인도네시아어 (예정)">🇮🇩</span>
              <span style={{...styles.flagItem, ...styles.flagComingSoon}} title="일본어 (예정)">🇯🇵</span>
              <span style={{...styles.flagItem, ...styles.flagComingSoon}} title="중국어 (예정)">🇨🇳</span>
              <span style={{...styles.flagItem, ...styles.flagComingSoon}} title="필리핀어 (예정)">🇵🇭</span>
            </div>
            <p style={styles.languageNote}>
              * 현재 몽골어 지원 | 다국어 확장 예정
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={styles.formWrapper}>
        <h1 style={styles.title}>우리말젠</h1>
        <h2 style={styles.subtitle}>{isRegister ? "회원가입" : "로그인"}</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <input
              type="text"
              name="username"
              placeholder="사용자 이름"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {isRegister && (
            <>
              <input
                type="text"
                name="country"
                placeholder="국가"
                value={formData.country}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                type="text"
                name="region"
                placeholder="지역"
                value={formData.region}
                onChange={handleChange}
                style={styles.input}
              />
            </>
          )}

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "처리 중..." : isRegister ? "회원가입" : "로그인"}
          </button>
        </form>

        <p style={styles.toggle}>
          {isRegister ? "이미 계정이 있으신가요? " : "계정이 없으신가요? "}
          <span onClick={() => setIsRegister(!isRegister)} style={styles.link}>
            {isRegister ? "로그인" : "회원가입"}
          </span>
        </p>

        <p style={styles.adminLink}>
          <span onClick={() => navigate("/admin/login")} style={styles.link}>
            👨‍💼 관리자 로그인
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
      "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    backgroundAttachment: "fixed",
    padding: "40px 20px",
    gap: "40px",
  },
  introSection: {
    flex: "1",
    maxWidth: "600px",
    minWidth: "400px",
  },
  introContent: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.3)",
    color: "white",
  },
  platformTitle: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "8px",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    lineHeight: "1.2",
  },
  platformSubtitle: {
    fontSize: "28px",
    fontWeight: "300",
    opacity: "0.9",
  },
  platformTagline: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "rgba(255, 255, 255, 0.95)",
  },
  platformDescription: {
    fontSize: "16px",
    marginBottom: "32px",
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: "1.6",
  },
  featuresSection: {
    marginBottom: "32px",
  },
  featuresTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "rgba(255, 255, 255, 0.95)",
  },
  featuresList: {
    listStyle: "none",
    padding: "0",
    margin: "0",
  },
  featureItem: {
    fontSize: "15px",
    marginBottom: "12px",
    padding: "12px 16px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    lineHeight: "1.5",
  },
  languagesSection: {
    marginTop: "32px",
    paddingTop: "24px",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
  },
  languagesTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "rgba(255, 255, 255, 0.95)",
  },
  languageFlags: {
    display: "flex",
    gap: "16px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  flagItem: {
    fontSize: "40px",
    cursor: "pointer",
    transition: "transform 0.2s ease",
    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
  },
  flagComingSoon: {
    opacity: "0.4",
    filter: "grayscale(70%) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
  },
  languageNote: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.7)",
    fontStyle: "italic",
    margin: "0",
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
    maxWidth: "480px",
  },
  title: {
    textAlign: "center",
    color: "white",
    marginBottom: "12px",
    fontSize: "32px",
    fontWeight: "bold",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  subtitle: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: "32px",
    fontSize: "20px",
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
    background: "rgba(99, 102, 241, 0.5)",
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
  toggle: {
    textAlign: "center",
    marginTop: "24px",
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "14px",
  },
  adminLink: {
    textAlign: "center",
    marginTop: "16px",
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "14px",
    paddingTop: "16px",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
  },
  link: {
    color: "white",
    cursor: "pointer",
    textDecoration: "underline",
    fontWeight: "bold",
  },
};

export default Login;
