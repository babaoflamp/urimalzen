import { useEffect } from 'react';
import { useLearningStore } from '../store/useLearningStore';
import { useCategoryStore } from '../store/useCategoryStore';

const FilterPanel = () => {
  const {
    selectedKiipLevel,
    selectedCategory,
    setSelectedKiipLevel,
    setSelectedCategory,
    clearFilters,
    filteredWords,
    words,
  } = useLearningStore();

  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  const levels = [
    { value: 0, label: '입문', color: '#94a3b8' },
    { value: 1, label: '초급1', color: '#60a5fa' },
    { value: 2, label: '초급2', color: '#34d399' },
    { value: 3, label: '중급1', color: '#fbbf24' },
    { value: 4, label: '중급2', color: '#fb923c' },
    { value: 5, label: '고급', color: '#f87171' },
  ];

  const hasActiveFilters = selectedKiipLevel !== null || selectedCategory !== null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>필터</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} style={styles.clearAllButton}>
            모두 지우기
          </button>
        )}
      </div>

      {/* KIIP Level Filter */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>KIIP 단계</div>
        <div style={styles.levelButtons}>
          {levels.map((level) => {
            const isSelected = selectedKiipLevel === level.value;
            return (
              <button
                key={level.value}
                onClick={() =>
                  setSelectedKiipLevel(isSelected ? null : level.value)
                }
                style={{
                  ...styles.levelButton,
                  ...(isSelected
                    ? { ...styles.selectedButton, background: level.color }
                    : {}),
                }}
              >
                {level.value}
                <div style={styles.levelLabel}>{level.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>카테고리</div>
        <div style={styles.categoryList}>
          {categories.slice(0, 8).map((category) => {
            const isSelected = selectedCategory === category.name;
            return (
              <button
                key={category._id}
                onClick={() =>
                  setSelectedCategory(isSelected ? null : category.name)
                }
                style={{
                  ...styles.categoryButton,
                  ...(isSelected ? styles.selectedCategoryButton : {}),
                  borderLeft: `3px solid ${category.color}`,
                }}
              >
                <span style={styles.categoryIcon}>{category.icon}</span>
                <span style={styles.categoryName}>{category.name}</span>
              </button>
            );
          })}
        </div>
        {categories.length > 8 && (
          <div style={styles.moreCategories}>
            +{categories.length - 8}개 더 보기
          </div>
        )}
      </div>

      {/* Filter Results */}
      <div style={styles.resultBox}>
        <div style={styles.resultText}>
          {filteredWords.length} / {words.length} 단어
        </div>
        {hasActiveFilters && (
          <div style={styles.activeFilters}>
            {selectedKiipLevel !== null && (
              <div style={styles.filterTag}>
                KIIP {selectedKiipLevel}
                <button
                  onClick={() => setSelectedKiipLevel(null)}
                  style={styles.filterTagClose}
                >
                  ✕
                </button>
              </div>
            )}
            {selectedCategory && (
              <div style={styles.filterTag}>
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory(null)}
                  style={styles.filterTagClose}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}
      </div>
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
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: 0,
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  clearAllButton: {
    background: 'rgba(239, 68, 68, 0.4)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '13px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  levelButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  levelButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    color: 'white',
    padding: '10px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  selectedButton: {
    border: '2px solid rgba(255, 255, 255, 0.6)',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  levelLabel: {
    fontSize: '11px',
    fontWeight: 'normal',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  categoryButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    color: 'white',
    padding: '10px 12px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textAlign: 'left',
  },
  selectedCategoryButton: {
    background: 'rgba(99, 102, 241, 0.4)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    transform: 'translateX(4px)',
  },
  categoryIcon: {
    fontSize: '18px',
  },
  categoryName: {
    flex: 1,
  },
  moreCategories: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '12px',
    textAlign: 'center',
    marginTop: '4px',
  },
  resultBox: {
    background: 'rgba(99, 102, 241, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  resultText: {
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeFilters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
  },
  filterTag: {
    background: 'rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  filterTagClose: {
    background: 'rgba(239, 68, 68, 0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default FilterPanel;
