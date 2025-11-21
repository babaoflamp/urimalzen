import { useLearningStore } from "../store/useLearningStore";
import "./Navigation.css";

const Navigation = () => {
  const { previousWord, nextWord, setCurrentWordIndex } = useLearningStore();

  const goToHome = () => {
    setCurrentWordIndex(0);
  };

  return (
    <div className="navigation-container">
      <button onClick={previousWord} className="nav-button">
        ◀ 이전 학습
      </button>

      <button onClick={goToHome} className="nav-button nav-button-home">
        처음 화면
      </button>

      <button onClick={nextWord} className="nav-button">
        다음 학습 ▶
      </button>
    </div>
  );
};

export default Navigation;
