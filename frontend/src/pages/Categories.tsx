import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MainNav from "../components/MainNav";
import CategoryGrid from "../components/CategoryGrid";
import { useCategoryStore } from "../store/useCategoryStore";
import { useLearningStore } from "../store/useLearningStore";
import "./Categories.css";

const Categories = () => {
  const navigate = useNavigate();
  const { currentCategory } = useCategoryStore();
  const { fetchWordsByCategory } = useLearningStore();

  useEffect(() => {
    // Fetch all categories on mount (handled by CategoryGrid component)
  }, []);

  const handleCategorySelect = async (categoryName: string) => {
    // Fetch words for selected category
    await fetchWordsByCategory(categoryName);
    // Navigate to learning page with filtered words
    navigate("/learning");
  };

  return (
    <div className="categories-container">
      <Header />
      <MainNav />

      <div className="categories-content">
        <div className="categories-hero">
          <h1 className="categories-hero-title">카테고리 학습</h1>
          <p className="categories-hero-subtitle">
            14가지 주제로 체계적으로 한국어를 배워보세요
          </p>
        </div>

        <CategoryGrid onCategorySelect={handleCategorySelect} />

        {currentCategory && (
          <div className="categories-info-box">
            <div className="categories-info-text">
              "{currentCategory.name}" 카테고리가 선택되었습니다.
            </div>
            <button
              onClick={() => navigate("/learning")}
              className="categories-start-button"
            >
              학습 시작하기 →
            </button>
          </div>
        )}

        <div className="categories-description">
          <h3 className="categories-description-title">카테고리 학습의 장점</h3>
          <div className="categories-feature-grid">
            <div className="categories-feature-card">
              <div className="categories-feature-icon">📚</div>
              <div className="categories-feature-name">체계적 학습</div>
              <div className="categories-feature-desc">
                주제별로 관련 단어를 함께 학습하여 효과적
              </div>
            </div>
            <div className="categories-feature-card">
              <div className="categories-feature-icon">🎯</div>
              <div className="categories-feature-name">실생활 적용</div>
              <div className="categories-feature-desc">
                일상에서 자주 사용하는 주제별 단어 집중
              </div>
            </div>
            <div className="categories-feature-card">
              <div className="categories-feature-icon">🌟</div>
              <div className="categories-feature-name">맞춤 학습</div>
              <div className="categories-feature-desc">
                필요한 주제만 선택하여 학습 가능
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
