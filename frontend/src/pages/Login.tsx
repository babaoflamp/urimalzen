import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    programType: "kiip" as "kiip" | "topik",
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
    <div className="login-container">
      <div className="login-content-wrapper">
        {/* 왼쪽: 솔루션 설명 */}
        <div className="login-info-section">
          <h1 className="login-main-title">KIIP 기반 AI 한국어 학습 플랫폼</h1>
          <p className="login-description">
            이주민의 성공적인 사회통합을 위한 맞춤형 한국어 교육 솔루션
          </p>

          <div className="login-section-block">
            <h3 className="login-section-title">
              🎯 이런 분들을 위한 서비스입니다
            </h3>
            <ul className="login-list">
              <li className="login-list-item">한국에서 생활하는 이주민</li>
              <li className="login-list-item">사회통합프로그램(KIIP) 학습자</li>
              <li className="login-list-item">
                한국어 어휘 학습이 필요한 외국인
              </li>
              <li className="login-list-item">
                체계적인 발음 연습을 원하는 학습자
              </li>
            </ul>
          </div>

          <div className="login-section-block">
            <h3 className="login-section-title">✨ 주요 특징</h3>
            <ul className="login-list">
              <li className="login-list-item">
                <strong>KIIP 단계별 학습:</strong> 입문부터 고급까지 체계적
                커리큘럼
              </li>
              <li className="login-list-item">
                <strong>AI 발음 분석:</strong> 실시간 발음 교정 및 피드백
              </li>
              <li className="login-list-item">
                <strong>카테고리별 어휘:</strong> 주제별로 분류된 맞춤 학습
              </li>
              <li className="login-list-item">
                <strong>게임화 학습:</strong> 순위 시스템으로 재미있게 학습
              </li>
              <li className="login-list-item">
                <strong>다국어 지원:</strong> 중국어, 일본어, 필리핀어,
                베트남어, 인도네시아어, 몽골어 등 번역으로 쉬운 이해
              </li>
            </ul>
          </div>

          <div className="login-section-block">
            <h3 className="login-section-title">🌟 학습 효과</h3>
            <ul className="login-list">
              <li className="login-list-item">
                일상생활에 필요한 실용적인 어휘 습득
              </li>
              <li className="login-list-item">
                정확한 발음으로 자신감 있는 의사소통
              </li>
              <li className="login-list-item">사회통합프로그램 시험 준비</li>
              <li className="login-list-item">한국 사회 적응력 향상</li>
            </ul>
          </div>
        </div>

        {/* 오른쪽: 로그인 폼 */}
        <div className="login-form-wrapper">
          <h2 className="login-form-title">
            {isRegister ? "회원가입" : "로그인"}
          </h2>

          <form onSubmit={handleSubmit} className="login-form">
            {isRegister && (
              <input
                type="text"
                name="username"
                placeholder="사용자 이름"
                value={formData.username}
                onChange={handleChange}
                className="login-input"
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={formData.email}
              onChange={handleChange}
              className="login-input"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
              required
            />

            {isRegister && (
              <>
                <div className="login-program-type-section">
                  <label className="login-program-type-label">학습 프로그램</label>
                  <div className="login-program-type-options">
                    <label className="login-radio-label">
                      <input
                        type="radio"
                        name="programType"
                        value="kiip"
                        checked={formData.programType === "kiip"}
                        onChange={handleChange}
                        className="login-radio"
                      />
                      <span>KIIP (사회통합프로그램)</span>
                    </label>
                    <label className="login-radio-label">
                      <input
                        type="radio"
                        name="programType"
                        value="topik"
                        checked={formData.programType === "topik"}
                        onChange={handleChange}
                        className="login-radio"
                      />
                      <span>TOPIK (한국어능력시험)</span>
                    </label>
                  </div>
                </div>

                <input
                  type="text"
                  name="country"
                  placeholder="국가"
                  value={formData.country}
                  onChange={handleChange}
                  className="login-input"
                />
                <input
                  type="text"
                  name="region"
                  placeholder="지역"
                  value={formData.region}
                  onChange={handleChange}
                  className="login-input"
                />
              </>
            )}

            {error && <p className="login-error">{error}</p>}

            <button type="submit" disabled={loading} className="login-button">
              {loading ? "처리 중..." : isRegister ? "회원가입" : "로그인"}
            </button>
          </form>

          <p className="login-toggle">
            {isRegister ? "이미 계정이 있으신가요? " : "계정이 없으신가요? "}
            <span
              onClick={() => setIsRegister(!isRegister)}
              className="login-link"
            >
              {isRegister ? "로그인" : "회원가입"}
            </span>
          </p>

          <p className="login-admin-link">
            <span
              onClick={() => navigate("/admin/login")}
              className="login-link"
            >
              👨‍💼 관리자 로그인
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
