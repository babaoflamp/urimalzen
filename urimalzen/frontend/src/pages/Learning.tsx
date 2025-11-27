import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLearningStore } from '../store/useLearningStore';
import { wordAPI, progressAPI, rankingAPI } from '../services/api';
import Header from '../components/Header';
import WordList from '../components/WordList';
import LearningArea from '../components/LearningArea';
import SelfStudy from '../components/SelfStudy';
import RankingInfo from '../components/RankingInfo';
import Navigation from '../components/Navigation';

const Learning = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { words, setWords, setUserProgress, setRanking, setCurrentWordIndex } = useLearningStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load initial data
    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    try {
      // Load words
      const wordsResponse = await wordAPI.getAllWords();
      setWords(wordsResponse.data);

      if (wordsResponse.data.length > 0) {
        setCurrentWordIndex(0);
      }

      // Load user progress
      const progressResponse = await progressAPI.getUserProgress();
      setUserProgress(progressResponse.data);

      // Load ranking
      const rankingResponse = await rankingAPI.getUserRanking();
      setRanking(rankingResponse.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  return (
    <div style={styles.container}>
      <Header />

      <div style={styles.mainContent}>
        <WordList />

        <div style={styles.centerArea}>
          <LearningArea />
          <Navigation />
        </div>

        <div style={styles.rightPanel}>
          <SelfStudy />
          <RankingInfo />
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    backgroundAttachment: 'fixed',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr 300px',
    gap: '24px',
    padding: '24px',
    maxWidth: '1600px',
    margin: '0 auto',
  },
  centerArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
};

export default Learning;
