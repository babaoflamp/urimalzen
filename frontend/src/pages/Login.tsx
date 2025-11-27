import { useState } from "react";
import { useLanguageStore } from "../store/useLanguageStore";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    programType: "kiip" as "kiip" | "topik",
    region: "",
    country: "",
    language: "ko" as "ko" | "zh",
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
      // 언어 선택 반영 (중국어면 글로벌 상태도 변경)
      setLanguage(formData.language);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
          <h1 className="login-main-title">한국어 배우기</h1>
          <h2 className="login-main-title login-main-title-sub">
            AI-Powered Korean Learning
          </h2>
          <p className="login-description login-description-sub">
            AI로 배우는 <b>스마트한 한국어 학습</b>
            <br />
            인공지능이 생성하는 이미지와 콘텐츠로
            <br />
            효율적인 한국어 학습을 경험하세요.
          </p>

          <div className="login-section-block">
            <h3 className="login-section-title">✨ 주요 특징</h3>
            <ul className="login-list">
              <li className="login-list-item">
                <strong>AI 자동 생성</strong>
                <br />
                단어마다 자동으로 이미지와 예문을 생성합니다
              </li>
              <li className="login-list-item">
                <strong>간격 반복 학습</strong>
                <br />
                과학적인 복습 알고리즘으로 장기 기억을 향상시킵니다
              </li>
              <li className="login-list-item">
                <strong>학습 진도 추적</strong>
                <br />
                상세한 통계로 학습 성과를 확인하세요
              </li>
            </ul>
          </div>
        </div>

        {/* 오른쪽: 로그인 폼 */}
        <div className="login-form-wrapper">
          <h2 className="login-form-title">
            {isRegister ? "회원가입" : "로그인"}
          </h2>

          <form onSubmit={handleSubmit} className="login-form">
            {/* 언어 선택: 로그인/회원가입 모두 노출 */}
            <div className="login-language-section">
              <label htmlFor="language" className="login-language-label">
                언어 선택
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="login-language-select"
              >
                <option value="ko">한국어</option>
                <option value="zh">中文 (중국어)</option>
              </select>
            </div>
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
                  <label className="login-program-type-label">
                    학습 프로그램
                  </label>
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
