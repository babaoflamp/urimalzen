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
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(135, 206, 235, 0.15) 50%, rgba(38, 198, 218, 0.1) 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(79, 195, 247, 0.3)',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
  },
  title: {
    color: '#1a1a1a',
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '24px',
    fontWeight: 'bold',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  categoryCard: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(135, 206, 235, 0.15) 100%)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(79, 195, 247, 0.25)',
    borderRadius: '20px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    minHeight: '180px',
  },
  selectedCard: {
    background: 'linear-gradient(135deg, rgba(79, 195, 247, 0.35) 0%, rgba(38, 198, 218, 0.3) 100%)',
    border: '1px solid rgba(79, 195, 247, 0.5)',
    transform: 'scale(1.05)',
    boxShadow: '0 8px 24px rgba(79, 195, 247, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
  },
  iconContainer: {
    width: '60px',
    height: '60px',
    background: 'rgba(79, 195, 247, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    border: '1px solid rgba(79, 195, 247, 0.3)',
  },
  icon: {
    fontSize: '32px',
  },
  categoryName: {
    color: '#1a1a1a',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  categoryNameMn: {
    color: '#4a4a4a',
    fontSize: '14px',
    marginBottom: '8px',
  },
  categoryDescription: {
    color: '#757575',
    fontSize: '12px',
    lineHeight: '1.4',
  },
  loading: {
    color: '#1a1a1a',
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.1) 100%)',
    borderRadius: '12px',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  clearButton: {
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0.2) 100%)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#dc2626',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '14px',
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    width: '100%',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
  },
};

export default CategoryGrid;
