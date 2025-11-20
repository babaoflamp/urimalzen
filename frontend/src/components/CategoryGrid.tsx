import { useEffect } from 'react';
import { useCategoryStore } from '../store/useCategoryStore';
import { useLearningStore } from '../store/useLearningStore';

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
      <div style={styles.container}>
        <div style={styles.loading}>카테고리를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>학습 카테고리</h2>
      <div style={styles.grid}>
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;

          return (
            <div
              key={category._id}
              style={{
                ...styles.categoryCard,
                ...(isSelected ? styles.selectedCard : {}),
                borderLeft: `4px solid ${category.color}`,
              }}
              onClick={() => handleCategoryClick(category.name)}
            >
              <div style={styles.iconContainer}>
                <span style={styles.icon}>{category.icon}</span>
              </div>
              <div style={styles.categoryName}>{category.name}</div>
              <div style={styles.categoryNameMn}>{category.nameMn}</div>
              <div style={styles.categoryDescription}>{category.description}</div>
            </div>
          );
        })}
      </div>

      {selectedCategory && (
        <button
          style={styles.clearButton}
          onClick={() => setSelectedCategory(null)}
        >
          필터 지우기
        </button>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  },
  title: {
    color: 'white',
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '24px',
    fontWeight: 'bold',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  categoryCard: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    minHeight: '180px',
  },
  selectedCard: {
    background: 'rgba(99, 102, 241, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    transform: 'scale(1.05)',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
  },
  iconContainer: {
    width: '60px',
    height: '60px',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
  },
  icon: {
    fontSize: '32px',
  },
  categoryName: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  categoryNameMn: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    marginBottom: '8px',
  },
  categoryDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '12px',
    lineHeight: '1.4',
  },
  loading: {
    color: 'white',
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
  },
  error: {
    color: '#ff6b6b',
    textAlign: 'center',
    padding: '20px',
    background: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 107, 107, 0.3)',
  },
  clearButton: {
    background: 'rgba(239, 68, 68, 0.4)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    width: '100%',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
};

export default CategoryGrid;
