import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MainNav from '../components/MainNav';
import CategoryGrid from '../components/CategoryGrid';
import { useCategoryStore } from '../store/useCategoryStore';
import { useLearningStore } from '../store/useLearningStore';

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
    navigate('/learning');
  };

  return (
    <div style={styles.container}>
      <Header />
      <MainNav />

      <div style={styles.content}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>카테고리별 학습</h1>
          <p style={styles.heroSubtitle}>
            14가지 주제로 체계적으로 한국어를 배워보세요
          </p>
          <p style={styles.heroSubtitleMn}>
            14 сэдвээр эмх цэгцтэй солонгос хэл сурах
          </p>
        </div>

        <CategoryGrid onCategorySelect={handleCategorySelect} />

        {currentCategory && (
          <div style={styles.infoBox}>
            <div style={styles.infoText}>
              "{currentCategory.name}" 카테고리가 선택되었습니다.
            </div>
            <button
              onClick={() => navigate('/learning')}
              style={styles.startButton}
            >
              학습 시작하기 →
            </button>
          </div>
        )}

        <div style={styles.description}>
          <h3 style={styles.descriptionTitle}>카테고리 학습의 장점</h3>
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📚</div>
              <div style={styles.featureName}>체계적 학습</div>
              <div style={styles.featureDesc}>
                주제별로 관련 단어를 함께 학습하여 효과적
              </div>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🎯</div>
              <div style={styles.featureName}>실생활 적용</div>
              <div style={styles.featureDesc}>
                일상에서 자주 사용하는 주제별 단어 집중
              </div>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🌟</div>
              <div style={styles.featureName}>맞춤 학습</div>
              <div style={styles.featureDesc}>
                필요한 주제만 선택하여 학습 가능
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    backgroundAttachment: 'fixed',
    padding: '20px',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  hero: {
    textAlign: 'center',
    padding: '40px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  },
  heroTitle: {
    color: 'white',
    fontSize: '48px',
    fontWeight: 'bold',
    margin: '0 0 16px 0',
    textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '20px',
    margin: '0 0 8px 0',
  },
  heroSubtitleMn: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
    margin: 0,
  },
  infoBox: {
    background: 'rgba(99, 102, 241, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
  },
  infoText: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  startButton: {
    background: 'rgba(34, 197, 94, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '14px 32px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  description: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '32px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  },
  descriptionTitle: {
    color: 'white',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 24px 0',
    textAlign: 'center',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  featureCard: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  featureName: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  featureDesc: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    lineHeight: '1.5',
  },
};

export default Categories;
