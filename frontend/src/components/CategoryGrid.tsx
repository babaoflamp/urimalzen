import { useEffect } from "react";
import { useCategoryStore } from "../store/useCategoryStore";
import { useLearningStore } from "../store/useLearningStore";

interface CategoryGridProps {
  onCategorySelect?: (categoryName: string) => void;
}

const CategoryGrid = ({ onCategorySelect }: CategoryGridProps) => {
  const { categories, isLoading, error, fetchCategories } = useCategoryStore();
  const { selectedCategory, setSelectedCategory } = useLearningStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
  };

  if (isLoading) {
    return (
      <div className="categories-feature-container">
        <div className="categories-loading">카테고리를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-feature-container">
        <div className="categories-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="categories-feature-container">
      <h2 className="categories-description-title">학습 카테고리</h2>
      <div className="categories-feature-grid">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;
          return (
            <div
              key={category._id}
              className={`categories-feature-card${
                isSelected ? " selected" : ""
              }`}
              style={{ borderLeft: `4px solid ${category.color}` }}
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="categories-feature-icon">{category.icon}</div>
              <div className="categories-feature-name">{category.name}</div>
              <div className="categories-feature-desc">
                {category.description}
              </div>
            </div>
          );
        })}
      </div>
      {selectedCategory && (
        <button
          className="categories-clear-button"
          onClick={() => setSelectedCategory(null)}
        >
          필터 지우기
        </button>
      )}
    </div>
  );
};

// ...기존 styles 객체 전체 제거 (더 이상 사용하지 않음)

export default CategoryGrid;
