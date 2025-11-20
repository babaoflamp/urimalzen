import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MainNav from '../components/MainNav';
import LevelSelector from '../components/LevelSelector';
import { useLearningStore } from '../store/useLearningStore';

const Levels = () => {
  const navigate = useNavigate();
  const { selectedKiipLevel, fetchWordsByLevel } = useLearningStore();

  const handleLevelSelect = async (level: number) => {
    // Fetch words for selected level
    await fetchWordsByLevel(level);
    // Navigate to learning page with filtered words
    navigate('/learning');
  };

  return (
    <div style={styles.container}>
      <Header />
      <MainNav />

      <div style={styles.content}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>KIIP 단계별 학습</h1>
          <p style={styles.heroSubtitle}>
            한국 사회 통합 프로그램 레벨에 맞춰 학습하세요
          </p>
          <p style={styles.heroSubtitleMn}>
            Солонгосын нийгмийн нэгдлийн хөтөлбөрийн түвшингээр суралцаарай
          </p>
        </div>

        <LevelSelector onLevelSelect={handleLevelSelect} />

        {selectedKiipLevel !== null && (
          <div style={styles.infoBox}>
            <div style={styles.infoContent}>
              <div style={styles.infoTitle}>
                KIIP {selectedKiipLevel} 단계 선택됨
              </div>
              <div style={styles.infoText}>
                이 레벨에 맞는 단어들을 학습할 준비가 되었습니다
              </div>
            </div>
            <button
              onClick={() => navigate('/learning')}
              style={styles.startButton}
            >
              학습 시작하기 →
            </button>
          </div>
        )}

        <div style={styles.infoSection}>
          <h3 style={styles.sectionTitle}>KIIP 프로그램이란?</h3>
          <div style={styles.infoCard}>
            <p style={styles.infoParagraph}>
              <strong>KIIP (Korea Immigration Integration Program)</strong>는
              한국 사회통합프로그램으로, 외국인이 한국 사회 구성원으로 적응하고
              자립할 수 있도록 돕는 교육 프로그램입니다.
            </p>
            <p style={styles.infoParagraph}>
              <strong>KIIP (Солонгосын нэгдлийн нэгдэх хөтөлбөр)</strong> нь
              гадаадын иргэдийг Солонгос нийгмийн гишүүн болгон дасан зохицож,
              бие даан амьдрах боломжийг олгох сургалтын хөтөлбөр юм.
            </p>
          </div>

          <h3 style={styles.sectionTitle}>단계별 목표</h3>
          <div style={styles.levelGoals}>
            <div style={styles.goalCard}>
              <div style={styles.goalLevel}>입문 (0)</div>
              <div style={styles.goalDesc}>
                한글 자모와 기초적인 한국어 표현 학습
              </div>
            </div>
            <div style={styles.goalCard}>
              <div style={styles.goalLevel}>초급 (1-2)</div>
              <div style={styles.goalDesc}>
                일상생활에 필요한 기본적인 의사소통 능력 향상
              </div>
            </div>
            <div style={styles.goalCard}>
              <div style={styles.goalLevel}>중급 (3-4)</div>
              <div style={styles.goalDesc}>
                사회생활과 업무에 필요한 한국어 능력 배양
              </div>
            </div>
            <div style={styles.goalCard}>
              <div style={styles.goalLevel}>고급 (5)</div>
              <div style={styles.goalDesc}>
                전문적이고 추상적인 주제를 다루는 고급 한국어 구사
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
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
    whiteSpace: 'nowrap',
  },
  infoSection: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '32px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  },
  sectionTitle: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
  },
  infoCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '32px',
  },
  infoParagraph: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '15px',
    lineHeight: '1.8',
    margin: '0 0 16px 0',
  },
  levelGoals: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  goalCard: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    padding: '20px',
  },
  goalLevel: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  goalDesc: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    lineHeight: '1.5',
  },
};

export default Levels;
