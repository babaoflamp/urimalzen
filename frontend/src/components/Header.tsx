import { useAuthStore } from '../store/useAuthStore';
import { useLearningStore } from '../store/useLearningStore';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { currentWord, userProgress, ranking } = useLearningStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 완료한 단어 수 계산
  const completedWords = userProgress.filter((p) => p.completed).length;
  const totalWords = 9;

  return (
    <div style={styles.header}>
      {/* 좌측: 국기 + 앱 이름 */}
      <div style={styles.leftSection}>
        <div style={styles.flags}>
          <span style={styles.flag}>🇰🇷</span>
          <span style={styles.flag}>🇲🇳</span>
        </div>
        <h1 style={styles.appName}>우리말젠</h1>
      </div>

      {/* 중앙: 사용자 정보 + 진도 + 현재 학습 단어 */}
      <div style={styles.centerSection}>
        <div style={styles.infoRow}>
          {user && (
            <>
              <span style={styles.infoText}>
                <strong>{user.username}</strong>
              </span>
              <span style={styles.separator}>|</span>
              <span style={styles.infoText}>CEFR {user.level.cefr}</span>
              <span style={styles.separator}>|</span>
              <span style={styles.infoText}>
                진도 {completedWords}/{totalWords}
              </span>
            </>
          )}
        </div>
        {currentWord && (
          <div style={styles.currentWord}>
            현재 학습: {currentWord.koreanWord} ({currentWord.mongolianWord})
          </div>
        )}
      </div>

      {/* 우측: 점수 + 순위 + 로그아웃 */}
      <div style={styles.rightSection}>
        <div style={styles.scoreInfo}>
          {user && (
            <>
              <span style={styles.scoreText}>
                🏆 {user.totalScore}점
              </span>
              {ranking && ranking.globalRank > 0 && (
                <>
                  <span style={styles.separator}>|</span>
                  <span style={styles.rankText}>
                    세계 {ranking.globalRank}위
                  </span>
                </>
              )}
            </>
          )}
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          로그아웃
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '24px 40px',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr',
    gap: '20px',
    alignItems: 'center',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
    borderRadius: '0 0 24px 24px',
    margin: '0 24px',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  flags: {
    display: 'flex',
    gap: '10px',
    fontSize: '32px',
  },
  flag: {
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  },
  appName: {
    color: 'white',
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  centerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'center',
  },
  infoRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  infoText: {
    color: 'white',
    fontSize: '16px',
  },
  separator: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
  },
  currentWord: {
    color: 'white',
    fontSize: '14px',
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '8px 20px',
    borderRadius: '20px',
    fontStyle: 'italic',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  rightSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'flex-end',
  },
  scoreInfo: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  scoreText: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  rankText: {
    color: 'white',
    fontSize: '14px',
  },
  logoutButton: {
    background: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    padding: '10px 20px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
};

export default Header;
