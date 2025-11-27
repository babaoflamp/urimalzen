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
      </div>
    </div>
  );
};

export default Levels;
