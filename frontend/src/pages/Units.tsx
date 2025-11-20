import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MainNav from '../components/MainNav';
import { UnitCard } from '../components/UnitCard';
import { useUnitStore } from '../store/useUnitStore';

const Units = () => {
  const navigate = useNavigate();
  const { units, fetchUnits, isLoading } = useUnitStore();
  const [filterLevel, setFilterLevel] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchUnits(filterLevel ?? undefined, filterCategory ?? undefined);
  }, [fetchUnits, filterLevel, filterCategory]);

  const handleUnitClick = (unitId: string) => {
    // Navigate to unit detail page (can be implemented later)
    console.log('Unit clicked:', unitId);
  };

  const levels = [0, 1, 2, 3, 4, 5];

  return (
    <div style={styles.container}>
      <Header />
      <MainNav />

      <div style={styles.content}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>학습 경로</h1>
          <p style={styles.heroSubtitle}>
            체계적인 유닛과 레슨으로 구성된 학습 경로를 따라가세요
          </p>
          <p style={styles.heroSubtitleMn}>
            Систематик нэгж, хичээлээр бүрдсэн сургалтын замыг дагаарай
          </p>
        </div>

        {/* Filter Section */}
        <div style={styles.filterSection}>
          <div style={styles.filterGroup}>
            <div style={styles.filterLabel}>KIIP 레벨:</div>
            <div style={styles.filterButtons}>
              <button
                onClick={() => setFilterLevel(null)}
                style={{
                  ...styles.filterButton,
                  ...(filterLevel === null ? styles.activeFilterButton : {}),
                }}
              >
                전체
              </button>
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level)}
                  style={{
                    ...styles.filterButton,
                    ...(filterLevel === level ? styles.activeFilterButton : {}),
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Units Grid */}
        {isLoading ? (
          <div style={styles.loading}>
            <div style={styles.loadingText}>유닛을 불러오는 중...</div>
          </div>
        ) : units.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📚</div>
            <div style={styles.emptyText}>
              아직 생성된 학습 유닛이 없습니다
            </div>
            <div style={styles.emptySubtext}>
              관리자가 곧 학습 콘텐츠를 추가할 예정입니다
            </div>
          </div>
        ) : (
          <>
            <div style={styles.unitsGrid}>
              {units.map((unit) => (
                <UnitCard
                  key={unit._id}
                  unit={unit}
                  onClick={() => handleUnitClick(unit._id)}
                />
              ))}
            </div>

            <div style={styles.infoBox}>
              <div style={styles.infoIcon}>💡</div>
              <div style={styles.infoContent}>
                <div style={styles.infoTitle}>학습 경로란?</div>
                <div style={styles.infoText}>
                  각 유닛은 여러 레슨으로 구성되어 있으며, 순차적으로 학습하면서
                  점진적으로 실력을 향상시킬 수 있습니다. 유닛을 완료하면 도전 과제에
                  도전할 수 있습니다!
                </div>
              </div>
            </div>
          </>
        )}
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
    maxWidth: '1400px',
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
  filterSection: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '24px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  filterLabel: {
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  filterButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  activeFilterButton: {
    background: 'rgba(99, 102, 241, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
  },
  loading: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  loadingText: {
    color: 'white',
    fontSize: '18px',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },
  emptyText: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  emptySubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
  },
  unitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
  },
  infoBox: {
    background: 'rgba(99, 102, 241, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    padding: '24px',
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: '40px',
    flexShrink: 0,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '15px',
    lineHeight: '1.6',
  },
};

export default Units;
