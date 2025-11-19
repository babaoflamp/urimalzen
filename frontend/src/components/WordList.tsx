import { useLearningStore } from '../store/useLearningStore';

const WordList = () => {
  const { words, currentWordIndex, setCurrentWordIndex, userProgress } = useLearningStore();

  const getWordProgress = (wordId: string) => {
    return userProgress.find((p) => p.wordId === wordId);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>학습 단어 순위</h2>

      <div style={styles.list}>
        {words.map((word, index) => {
          const progress = getWordProgress(word._id);
          const isActive = index === currentWordIndex;

          return (
            <div
              key={word._id}
              style={{
                ...styles.wordItem,
                ...(isActive ? styles.activeItem : {}),
              }}
              onClick={() => setCurrentWordIndex(index)}
            >
              <div style={styles.wordNumber}>{word.order}</div>
              <div style={styles.wordName}>{word.koreanWord}</div>
              <div style={styles.wordAttempts}>
                {progress?.attempts || 0}
              </div>
              <button style={styles.playButton}>▶</button>
            </div>
          );
        })}
      </div>

      <div style={styles.footer}>기타 정보</div>
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
    height: 'fit-content',
  },
  title: {
    color: 'white',
    textAlign: 'center',
    fontSize: '22px',
    marginBottom: '24px',
    fontWeight: 'bold',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    marginBottom: '20px',
  },
  wordItem: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '12px',
    borderRadius: '16px',
    display: 'grid',
    gridTemplateColumns: '40px 1fr 40px 40px',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  activeItem: {
    background: 'rgba(99, 102, 241, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    transform: 'scale(1.03) translateX(4px)',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
  },
  wordNumber: {
    background: 'white',
    color: '#333',
    width: '35px',
    height: '35px',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  wordName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  wordAttempts: {
    background: 'rgba(255,255,255,0.3)',
    color: 'white',
    padding: '5px',
    borderRadius: '3px',
    textAlign: 'center',
    fontSize: '14px',
  },
  playButton: {
    background: 'rgba(251, 191, 36, 0.4)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '35px',
    height: '35px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  footer: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '16px',
    borderRadius: '16px',
    textAlign: 'center',
    fontWeight: 'bold',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
};

export default WordList;
