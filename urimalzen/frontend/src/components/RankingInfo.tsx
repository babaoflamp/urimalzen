import { useLearningStore } from '../store/useLearningStore';

const RankingInfo = () => {
  const { ranking } = useLearningStore();

  const rankingItems = [
    { id: 1, label: '세계 순위', value: ranking?.globalRank || 0 },
    { id: 2, label: '나라 순위', value: ranking?.countryRank || 0 },
    { id: 3, label: '한국 순위', value: ranking?.koreaRank || 0 },
    { id: 4, label: '지역 순위', value: ranking?.regionRank || 0 },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>순위 정보</h2>

      <div style={styles.grid}>
        {rankingItems.map((item) => (
          <div key={item.id} style={styles.rankingBox}>
            <div style={styles.rankingLabel}>{item.label}</div>
            <div style={styles.rankingValue}>
              {item.value > 0 ? `${item.value}위` : '-'}
            </div>
          </div>
        ))}
      </div>

      {ranking && (
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>완료한 단어:</span>
            <span style={styles.statValue}>{ranking.wordsCompleted}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>총 점수:</span>
            <span style={styles.statValue}>{ranking.score}</span>
          </div>
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
    fontSize: '22px',
    marginBottom: '24px',
    fontWeight: 'bold',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
  },
  rankingBox: {
    background: 'rgba(16, 185, 129, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
    padding: '18px',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  rankingLabel: {
    color: 'white',
    fontSize: '12px',
    marginBottom: '8px',
  },
  rankingValue: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  stats: {
    background: 'rgba(16, 185, 129, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    color: 'white',
  },
  statLabel: {
    fontSize: '14px',
  },
  statValue: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default RankingInfo;
