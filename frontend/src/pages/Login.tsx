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
      <div style={styles.contentWrapper}>
        {/* 왼쪽: 솔루션 설명 */}
        <div style={styles.infoSection}>
          <h1 style={styles.mainTitle}>KIIP 기반 AI 한국어 학습 플랫폼</h1>
          <p style={styles.description}>
            이주민의 성공적인 사회통합을 위한 맞춤형 한국어 교육 솔루션
          </p>

          <div style={styles.targetAudience}>
            <h3 style={styles.sectionTitle}>🎯 이런 분들을 위한 서비스입니다</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>한국에서 생활하는 이주민</li>
              <li style={styles.listItem}>사회통합프로그램(KIIP) 학습자</li>
              <li style={styles.listItem}>한국어 어휘 학습이 필요한 외국인</li>
              <li style={styles.listItem}>체계적인 발음 연습을 원하는 학습자</li>
            </ul>
          </div>

          <div style={styles.features}>
            <h3 style={styles.sectionTitle}>✨ 주요 특징</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>KIIP 단계별 학습:</strong> 입문부터 고급까지 체계적 커리큘럼
              </li>
              <li style={styles.listItem}>
                <strong>AI 발음 분석:</strong> 실시간 발음 교정 및 피드백
              </li>
              <li style={styles.listItem}>
                <strong>카테고리별 어휘:</strong> 주제별로 분류된 맞춤 학습
              </li>
              <li style={styles.listItem}>
                <strong>게임화 학습:</strong> 순위 시스템으로 재미있게 학습
              </li>
              <li style={styles.listItem}>
                <strong>다국어 지원:</strong> 중국어, 일본어, 필리핀어, 베트남어, 인도네시아어, 몽골어 등 번역으로 쉬운 이해
              </li>
            </ul>
          </div>

          <div style={styles.benefits}>
            <h3 style={styles.sectionTitle}>🌟 학습 효과</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>일상생활에 필요한 실용적인 어휘 습득</li>
              <li style={styles.listItem}>정확한 발음으로 자신감 있는 의사소통</li>
              <li style={styles.listItem}>사회통합프로그램 시험 준비</li>
              <li style={styles.listItem}>한국 사회 적응력 향상</li>
            </ul>
          </div>
        </div>

        {/* 오른쪽: 로그인 폼 */}
        <div style={styles.formWrapper}>
          <h2 style={styles.formTitle}>{isRegister ? "회원가입" : "로그인"}</h2>

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
  },
  contentWrapper: {
    display: "flex",
    gap: "40px",
    maxWidth: "1400px",
    width: "100%",
    alignItems: "stretch",
  },
  infoSection: {
    flex: "1",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "48px",
    borderRadius: "24px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.3)",
    color: "white",
  },
  mainTitle: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "16px",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    color: "white",
  },
  description: {
    fontSize: "18px",
    lineHeight: "1.6",
    marginBottom: "32px",
    color: "rgba(255, 255, 255, 0.95)",
  },
  targetAudience: {
    marginBottom: "32px",
  },
  features: {
    marginBottom: "32px",
  },
  benefits: {
    marginBottom: "0",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "white",
  },
  list: {
    listStyle: "none",
    padding: "0",
    margin: "0",
  },
  listItem: {
    fontSize: "16px",
    lineHeight: "1.8",
    marginBottom: "8px",
    paddingLeft: "24px",
    position: "relative",
    color: "rgba(255, 255, 255, 0.9)",
  },
  formWrapper: {
    flex: "0 0 420px",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "48px",
    borderRadius: "24px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.3)",
  },
  formTitle: {
    textAlign: "center",
    color: "white",
    marginBottom: "32px",
    fontSize: "28px",
    fontWeight: "bold",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
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
