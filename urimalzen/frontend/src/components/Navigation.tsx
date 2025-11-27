import { useLearningStore } from '../store/useLearningStore';

const Navigation = () => {
  const { previousWord, nextWord, setCurrentWordIndex } = useLearningStore();

  const goToHome = () => {
    setCurrentWordIndex(0);
  };

  return (
    <div style={styles.container}>
      <button onClick={previousWord} style={styles.button}>
        ◀ 이전 학습
      </button>

      <button onClick={goToHome} style={styles.homeButton}>
        처음 화면
      </button>

      <button onClick={nextWord} style={styles.button}>
        다음 학습 ▶
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
    marginTop: '24px',
  },
  button: {
    background: 'rgba(251, 191, 36, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    borderRadius: '16px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  homeButton: {
    background: 'rgba(245, 158, 11, 0.4)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    borderRadius: '16px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
};

export default Navigation;
