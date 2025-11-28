import { useLearningStore } from "../store/useLearningStore";
import { useLanguageStore } from "../store/useLanguageStore";
import "./Navigation.css";

const Navigation = () => {
  const { previousWord, nextWord } = useLearningStore();
  const { language } = useLanguageStore();

  return (
    <div className="navigation-container">
      <button onClick={previousWord} className="nav-button">
        {"◀ "}
        {language === "zh"
          ? "上一个学习"
          : language === "mn"
          ? "Өмнөх хичээл"
          : "이전 학습"}
      </button>

      <button className="nav-button nav-button-sentence">
        {language === "zh"
          ? "句子学习"
          : language === "mn"
          ? "Өгүүлбэрийн хичээл"
          : "문장학습"}
      </button>

      <button onClick={nextWord} className="nav-button">
        {language === "zh"
          ? "下一个学习"
          : language === "mn"
          ? "Дараагийн хичээл"
          : "다음 학습"}
        {" ▶"}
      </button>
    </div>
  );
};

export default Navigation;
