import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MainNav from "../components/MainNav";
import LevelSelector from "../components/LevelSelector";
import { useLearningStore } from "../store/useLearningStore";
import "./Levels.css";

const Levels = () => {
  const navigate = useNavigate();
  const { selectedKiipLevel, fetchWordsByLevel } = useLearningStore();

  const handleLevelSelect = async (level: number) => {
    // Fetch words for selected level
    await fetchWordsByLevel(level);
    // Navigate to learning page with filtered words
    navigate("/learning");
  };

  return (
    <div className="levels-container">
      <Header />
      <MainNav />

      <div className="levels-content">
        <div className="levels-hero">
          <h1 className="levels-hero-title">KIIP 단계별 학습</h1>
          <p className="levels-hero-subtitle">
            한국 사회 통합 프로그램 레벨에 맞춰 학습하세요
          </p>
          <p className="levels-hero-subtitle-mn">
            Солонгосын нийгмийн нэгдлийн хөтөлбөрийн түвшингээр суралцаарай
          </p>
        </div>

        <LevelSelector onLevelSelect={handleLevelSelect} />

        {selectedKiipLevel !== null && (
          <div className="levels-info-box">
            <div className="levels-info-content">
              <div className="levels-info-title">
                KIIP {selectedKiipLevel} 단계 선택됨
              </div>
              <div className="levels-info-text">
                이 레벨에 맞는 단어들을 학습할 준비가 되었습니다
              </div>
            </div>
            <button
              onClick={() => navigate("/learning")}
              className="levels-start-button"
            >
              학습 시작하기 →
            </button>
          </div>
        )}

        <div className="levels-info-section">
          <h3 className="levels-section-title">KIIP 프로그램이란?</h3>
          <div className="levels-info-card">
            <p className="levels-info-paragraph">
              <strong>KIIP (Korea Immigration Integration Program)</strong>는
              한국 사회통합프로그램으로, 외국인이 한국 사회 구성원으로 적응하고
              자립할 수 있도록 돕는 교육 프로그램입니다.
            </p>
            <p className="levels-info-paragraph">
              <strong>KIIP (Солонгосын нэгдлийн нэгдэх хөтөлбөр)</strong> нь
              гадаадын иргэдийг Солонгос нийгмийн гишүүн болгон дасан зохицож,
              бие даан амьдрах боломжийг олгох сургалтын хөтөлбөр юм.
            </p>
          </div>

          <h3 className="levels-section-title">단계별 목표</h3>
          <div className="levels-goal-grid">
            <div className="levels-goal-card">
              <div className="levels-goal-level">입문 (0)</div>
              <div className="levels-goal-desc">
                한글 자모와 기초적인 한국어 표현 학습
              </div>
            </div>
            <div className="levels-goal-card">
              <div className="levels-goal-level">초급 (1-2)</div>
              <div className="levels-goal-desc">
                일상생활에 필요한 기본적인 의사소통 능력 향상
              </div>
            </div>
            <div className="levels-goal-card">
              <div className="levels-goal-level">중급 (3-4)</div>
              <div className="levels-goal-desc">
                사회생활과 업무에 필요한 한국어 능력 배양
              </div>
            </div>
            <div className="levels-goal-card">
              <div className="levels-goal-level">고급 (5)</div>
              <div className="levels-goal-desc">
                전문적이고 추상적인 주제를 다루는 고급 한국어 구사
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Levels;
