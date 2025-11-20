import { useLearningStore } from '../store/useLearningStore';

const WordList = () => {
  const { filteredWords, currentWordIndex, setCurrentWordIndex, userProgress } =
    useLearningStore();

  const getWordProgress = (wordId: string) => {
    return userProgress.find((p) => p.wordId === wordId);
  };

  const getLevelColor = (kiipLevel?: number) => {
    const colors: { [key: number]: string } = {
      0: '#94a3b8',
      1: '#60a5fa',
      2: '#34d399',
      3: '#fbbf24',
      4: '#fb923c',
      5: '#f87171',
    };
    return kiipLevel !== undefined ? colors[kiipLevel] || '#667eea' : '#667eea';
  };

  if (filteredWords.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>학습 단어 목록</h2>
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📝</div>
          <div style={styles.emptyText}>단어가 없습니다</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>학습 단어 목록</h2>
      <div style={styles.count}>{filteredWords.length}개 단어</div>

      <div style={styles.list}>
        {filteredWords.map((word, index) => {
          const progress = getWordProgress(word._id);
          const isActive = index === currentWordIndex;
          const levelColor = getLevelColor(word.level?.kiip);

          return (
            <div
              key={word._id}
              style={{
                ...styles.wordItem,
                ...(isActive ? styles.activeItem : {}),
              }}
              onClick={() => setCurrentWordIndex(index)}
            >
              <div
                style={{
                  ...styles.wordNumber,
                  background: levelColor,
                  color: 'white',
                }}
              >
                {word.order}
              </div>
              <div style={styles.wordContent}>
                <div style={styles.wordName}>{word.koreanWord}</div>
                <div style={styles.wordMongolian}>{word.mongolianWord}</div>
                {word.mainCategory && (
                  <div style={styles.wordCategory}>{word.mainCategory}</div>
                )}
              </div>
              <div style={styles.wordAttempts}>{progress?.attempts || 0}</div>
              <button style={styles.playButton}>▶</button>
            </div>
          );
        })}
      </div>

      <div style={styles.footer}>
        {filteredWords.length > 0 && `현재 단어: ${currentWordIndex + 1} / ${filteredWords.length}`}
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
    height: 'fit-content',
  },
  title: {
    color: 'white',
    textAlign: 'center',
    fontSize: '22px',
    marginBottom: '8px',
    fontWeight: 'bold',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  count: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '16px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
    maxHeight: '600px',
    overflowY: 'auto',
  },
  wordItem: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '12px',
    borderRadius: '16px',
    display: 'grid',
    gridTemplateColumns: '45px 1fr 45px 40px',
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
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  wordContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  wordName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '1.2',
  },
  wordMongolian: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '13px',
    lineHeight: '1.2',
  },
  wordCategory: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '11px',
    marginTop: '2px',
  },
  wordAttempts: {
    background: 'rgba(255,255,255,0.3)',
    color: 'white',
    padding: '6px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    padding: '12px',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: 'bold',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '16px',
  },
};

export default WordList;
