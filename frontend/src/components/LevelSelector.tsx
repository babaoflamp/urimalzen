import { useLearningStore } from '../store/useLearningStore';

interface LevelSelectorProps {
  onLevelSelect?: (level: number) => void;
}

const LevelSelector = ({ onLevelSelect }: LevelSelectorProps) => {
  const { selectedKiipLevel, setSelectedKiipLevel } = useLearningStore();

  const levels = [
    {
      kiip: 0,
      cefr: 'Pre-A1',
      name: '입문',
      nameMn: 'Танилцуулга',
      description: '한글 자모 및 기초',
      descriptionMn: 'Монгол үсэг, үндсэн ойлголт',
      color: '#94a3b8',
    },
    {
      kiip: 1,
      cefr: 'A1',
      name: '초급 1',
      nameMn: 'Анхан шат 1',
      description: '일상적인 기초 표현',
      descriptionMn: 'Өдөр тутмын үндсэн илэрхийлэл',
      color: '#60a5fa',
    },
    {
      kiip: 2,
      cefr: 'A2',
      name: '초급 2',
      nameMn: 'Анхан шат 2',
      description: '친숙한 일상 주제',
      descriptionMn: 'Танил өдөр тутмын сэдвүүд',
      color: '#34d399',
    },
    {
      kiip: 3,
      cefr: 'B1',
      name: '중급 1',
      nameMn: 'Дунд шат 1',
      description: '일상생활 및 업무',
      descriptionMn: 'Өдөр тутмын амьдрал болон ажил',
      color: '#fbbf24',
    },
    {
      kiip: 4,
      cefr: 'B2',
      name: '중급 2',
      nameMn: 'Дунд шат 2',
      description: '복잡한 주제 이해',
      descriptionMn: 'Нарийн төвөгтэй сэдвийг ойлгох',
      color: '#fb923c',
    },
    {
      kiip: 5,
      cefr: 'C1-C2',
      name: '고급',
      nameMn: 'Дээд шат',
      description: '전문적이고 추상적인 주제',
      descriptionMn: 'Мэргэжлийн болон хийсвэр сэдвүүд',
      color: '#f87171',
    },
  ];

  const handleLevelClick = (level: number) => {
    const newLevel = selectedKiipLevel === level ? null : level;
    setSelectedKiipLevel(newLevel);
    if (onLevelSelect && newLevel !== null) {
      onLevelSelect(newLevel);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>KIIP 단계 선택</h2>
      <div style={styles.subtitle}>한국 사회 통합 프로그램 레벨</div>

      <div style={styles.levelGrid}>
        {levels.map((level) => {
          const isSelected = selectedKiipLevel === level.kiip;

          return (
            <div
              key={level.kiip}
              style={{
                ...styles.levelCard,
                ...(isSelected ? styles.selectedCard : {}),
                borderTop: `4px solid ${level.color}`,
              }}
              onClick={() => handleLevelClick(level.kiip)}
            >
              <div style={styles.levelHeader}>
                <div
                  style={{
                    ...styles.levelBadge,
                    background: level.color,
                  }}
                >
                  {level.kiip}
                </div>
                <div style={styles.cefrBadge}>{level.cefr}</div>
              </div>

              <div style={styles.levelName}>{level.name}</div>
              <div style={styles.levelNameMn}>{level.nameMn}</div>
              <div style={styles.levelDescription}>{level.description}</div>
              <div style={styles.levelDescriptionMn}>{level.descriptionMn}</div>
            </div>
          );
        })}
      </div>

      {selectedKiipLevel !== null && (
        <div style={styles.infoBox}>
          <div style={styles.infoText}>
            선택됨: KIIP {selectedKiipLevel} - {levels[selectedKiipLevel].name}
          </div>
          <button
            style={styles.clearButton}
            onClick={() => setSelectedKiipLevel(null)}
          >
            선택 해제
          </button>
        </div>
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
    marginBottom: '8px',
    fontWeight: 'bold',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '24px',
  },
  levelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  levelCard: {
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
    gap: '8px',
  },
  selectedCard: {
    background: 'rgba(99, 102, 241, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    transform: 'scale(1.05)',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
  },
  levelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  levelBadge: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  cefrBadge: {
    background: 'rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  levelName: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  levelNameMn: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
  },
  levelDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '13px',
    marginTop: '4px',
  },
  levelDescriptionMn: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '12px',
  },
  infoBox: {
    background: 'rgba(99, 102, 241, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  infoText: {
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  clearButton: {
    background: 'rgba(239, 68, 68, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    whiteSpace: 'nowrap',
  },
};

export default LevelSelector;
