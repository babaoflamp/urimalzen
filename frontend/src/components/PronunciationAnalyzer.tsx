import { useState } from 'react';
import { usePronunciationStore } from '../store/usePronunciationStore';

const PronunciationAnalyzer = () => {
  const [inputWord, setInputWord] = useState('');
  const { analysisResult, isLoading, error, analyzeWord, clearAnalysis } =
    usePronunciationStore();

  const handleAnalyze = () => {
    if (inputWord.trim()) {
      analyzeWord(inputWord.trim());
    }
  };

  const handleClear = () => {
    setInputWord('');
    clearAnalysis();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>발음 분석기</h2>
      <div style={styles.subtitle}>한국어 단어의 발음 규칙을 분석합니다</div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="한국어 단어를 입력하세요..."
          style={styles.input}
        />
        <button
          onClick={handleAnalyze}
          disabled={!inputWord.trim() || isLoading}
          style={{
            ...styles.analyzeButton,
            ...((!inputWord.trim() || isLoading) ? styles.buttonDisabled : {}),
          }}
        >
          {isLoading ? '분석 중...' : '분석'}
        </button>
        {(inputWord || analysisResult) && (
          <button onClick={handleClear} style={styles.clearButton}>
            지우기
          </button>
        )}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {analysisResult && (
        <div style={styles.resultContainer}>
          <div style={styles.resultHeader}>
            <div style={styles.analyzedWord}>{analysisResult.word}</div>
            <div style={styles.ruleCount}>
              {analysisResult.rulesFound}개의 발음 규칙 발견
            </div>
          </div>

          {analysisResult.rulesFound === 0 ? (
            <div style={styles.noRules}>
              이 단어에 해당하는 발음 규칙이 없습니다.
            </div>
          ) : (
            <div style={styles.rulesList}>
              {analysisResult.rules.map((rule, index) => (
                <div key={rule.ruleId} style={styles.ruleCard}>
                  <div style={styles.ruleHeader}>
                    <div style={styles.ruleNumber}>{index + 1}</div>
                    <div>
                      <div style={styles.ruleName}>{rule.ruleName}</div>
                      <div style={styles.ruleNameMn}>{rule.ruleNameMn}</div>
                    </div>
                  </div>

                  <div style={styles.ruleDescription}>{rule.description}</div>
                  <div style={styles.ruleDescriptionMn}>
                    {rule.descriptionMn}
                  </div>

                  {rule.examples && rule.examples.length > 0 && (
                    <div style={styles.examplesContainer}>
                      <div style={styles.examplesTitle}>예시:</div>
                      {rule.examples.slice(0, 3).map((example, i) => (
                        <div key={i} style={styles.exampleItem}>
                          <div style={styles.exampleWord}>
                            {example.word}: {example.written} → {example.pronounced}
                          </div>
                          <div style={styles.exampleMn}>
                            {example.writtenMn} → {example.pronouncedMn}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!analysisResult && !isLoading && (
        <div style={styles.placeholder}>
          <div style={styles.placeholderIcon}>🎯</div>
          <div style={styles.placeholderText}>
            단어를 입력하고 분석 버튼을 눌러주세요
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
  inputContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
  },
  analyzeButton: {
    background: 'rgba(99, 102, 241, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    whiteSpace: 'nowrap',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  clearButton: {
    background: 'rgba(239, 68, 68, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '12px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  error: {
    color: '#ff6b6b',
    textAlign: 'center',
    padding: '12px',
    background: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 107, 107, 0.3)',
    marginBottom: '20px',
  },
  resultContainer: {
    marginTop: '20px',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    padding: '16px',
    background: 'rgba(99, 102, 241, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  analyzedWord: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  ruleCount: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '6px 12px',
    borderRadius: '8px',
  },
  noRules: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    padding: '32px',
    fontSize: '16px',
  },
  rulesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  ruleCard: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  ruleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  ruleNumber: {
    width: '40px',
    height: '40px',
    background: 'rgba(99, 102, 241, 0.5)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  ruleName: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  ruleNameMn: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
  },
  ruleDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    marginBottom: '4px',
    lineHeight: '1.5',
  },
  ruleDescriptionMn: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '13px',
    marginBottom: '12px',
    lineHeight: '1.5',
  },
  examplesContainer: {
    background: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    padding: '12px',
    marginTop: '12px',
  },
  examplesTitle: {
    color: 'white',
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  exampleItem: {
    padding: '8px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  exampleWord: {
    color: 'white',
    fontSize: '14px',
    marginBottom: '4px',
  },
  exampleMn: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '12px',
  },
  placeholder: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  placeholderIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '16px',
  },
};

export default PronunciationAnalyzer;
