import { useEffect } from 'react';
import Header from '../components/Header';
import MainNav from '../components/MainNav';
import PronunciationAnalyzer from '../components/PronunciationAnalyzer';
import { usePronunciationStore } from '../store/usePronunciationStore';

const Pronunciation = () => {
  const { phonemeRules, fetchPhonemeRules } = usePronunciationStore();

  useEffect(() => {
    if (phonemeRules.length === 0) {
      fetchPhonemeRules();
    }
  }, [phonemeRules.length, fetchPhonemeRules]);

  const ruleCategories = [
    {
      name: '연음',
      icon: '🔗',
      description: '받침이 뒤의 모음으로 이어지는 현상',
      examples: ['옷이 → [오시]', '밥을 → [바블]'],
    },
    {
      name: '비음화',
      icon: '👃',
      description: '비음 소리로 변하는 현상',
      examples: ['국물 → [궁물]', '밥만 → [밤만]'],
    },
    {
      name: '유음화',
      icon: '🌊',
      description: 'ㄴ이 ㄹ로 바뀌는 현상',
      examples: ['신라 → [실라]', '난로 → [날로]'],
    },
    {
      name: '구개음화',
      icon: '🎭',
      description: 'ㄷ, ㅌ이 ㅈ, ㅊ으로 바뀌는 현상',
      examples: ['같이 → [가치]', '굳이 → [구지]'],
    },
    {
      name: '경음화',
      icon: '💪',
      description: '된소리로 발음되는 현상',
      examples: ['국밥 → [국빱]', '학교 → [학꾜]'],
    },
  ];

  return (
    <div style={styles.container}>
      <Header />
      <MainNav />

      <div style={styles.content}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>발음 분석</h1>
          <p style={styles.heroSubtitle}>
            한국어 발음 규칙을 배우고 정확한 발음을 익혀보세요
          </p>
          <p style={styles.heroSubtitleMn}>
            Солонгос хэлний дуудлагын дүрмийг сурч, зөв дуудлагыг эзэмшээрэй
          </p>
        </div>

        <PronunciationAnalyzer />

        <div style={styles.rulesSection}>
          <h2 style={styles.sectionTitle}>5가지 주요 발음 규칙</h2>
          <div style={styles.rulesGrid}>
            {ruleCategories.map((rule) => (
              <div key={rule.name} style={styles.ruleCard}>
                <div style={styles.ruleIcon}>{rule.icon}</div>
                <div style={styles.ruleName}>{rule.name}</div>
                <div style={styles.ruleDescription}>{rule.description}</div>
                <div style={styles.examplesList}>
                  {rule.examples.map((example, index) => (
                    <div key={index} style={styles.exampleText}>
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.tipSection}>
          <h3 style={styles.tipTitle}>발음 학습 팁</h3>
          <div style={styles.tipGrid}>
            <div style={styles.tipCard}>
              <div style={styles.tipIcon}>🎯</div>
              <div style={styles.tipContent}>
                <div style={styles.tipHeading}>규칙 이해</div>
                <div style={styles.tipText}>
                  각 발음 규칙의 원리를 이해하면 더 쉽게 적용할 수 있습니다
                </div>
              </div>
            </div>
            <div style={styles.tipCard}>
              <div style={styles.tipIcon}>🔊</div>
              <div style={styles.tipContent}>
                <div style={styles.tipHeading}>반복 연습</div>
                <div style={styles.tipText}>
                  같은 단어를 여러 번 들고 따라 말하며 연습하세요
                </div>
              </div>
            </div>
            <div style={styles.tipCard}>
              <div style={styles.tipIcon}>📝</div>
              <div style={styles.tipContent}>
                <div style={styles.tipHeading}>패턴 인식</div>
                <div style={styles.tipText}>
                  비슷한 패턴의 단어들을 함께 학습하면 효과적입니다
                </div>
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
  rulesSection: {
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
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 24px 0',
    textAlign: 'center',
  },
  rulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  ruleCard: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  ruleIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  ruleName: {
    color: 'white',
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  ruleDescription: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '14px',
    marginBottom: '16px',
    lineHeight: '1.5',
  },
  examplesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  exampleText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '13px',
    background: 'rgba(0, 0, 0, 0.1)',
    padding: '8px 12px',
    borderRadius: '8px',
    fontFamily: 'monospace',
  },
  tipSection: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '32px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  },
  tipTitle: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
    textAlign: 'center',
  },
  tipGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  tipCard: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: '32px',
    flexShrink: 0,
  },
  tipContent: {
    flex: 1,
  },
  tipHeading: {
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  tipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '13px',
    lineHeight: '1.5',
  },
};

export default Pronunciation;
