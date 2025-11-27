import { useEffect } from "react";
import Header from "../components/Header";
import MainNav from "../components/MainNav";
import PronunciationAnalyzer from "../components/PronunciationAnalyzer";
import { usePronunciationStore } from "../store/usePronunciationStore";
import "./Pronunciation.css";

const Pronunciation = () => {
  const { phonemeRules, fetchPhonemeRules } = usePronunciationStore();

  useEffect(() => {
    if (phonemeRules.length === 0) {
      fetchPhonemeRules();
    }
  }, [phonemeRules.length, fetchPhonemeRules]);

  // 5가지 주요 발음 규칙 카드 복원
  const ruleCategories = [
    {
      name: "연음",
      icon: "🔗",
      description: "받침이 뒤의 모음으로 이어지는 현상",
      examples: ["옷이 → [오시]", "밥을 → [바블]"],
    },
    {
      name: "비음화",
      icon: "👃",
      description: "비음 소리로 변하는 현상",
      examples: ["국물 → [궁물]", "밥만 → [밤만]"],
    },
    {
      name: "유음화",
      icon: "🌊",
      description: "ㄴ이 ㄹ로 바뀌는 현상",
      examples: ["신라 → [실라]", "난로 → [날로]"],
    },
    {
      name: "구개음화",
      icon: "🎭",
      description: "ㄷ, ㅌ이 ㅈ, ㅊ으로 바뀌는 현상",
      examples: ["같이 → [가치]", "굳이 → [구지]"],
    },
    {
      name: "경음화",
      icon: "💪",
      description: "된소리로 발음되는 현상",
      examples: ["국밥 → [국빱]", "학교 → [학꾜]"],
    },
  ];

  return (
    <div className="pronunciation-container">
      <Header />
      <MainNav />

      <div className="pronunciation-content">
        <div className="pronunciation-hero">
          <h1 className="pronunciation-hero-title">발음 분석</h1>
          <p className="pronunciation-hero-subtitle">
            한국어 발음 규칙을 배우고 정확한 발음을 익혀보세요
          </p>
        </div>

        {/* 발음 규칙 안내 카드가 먼저 */}
        <div className="pronunciation-rules-section">
          <h2 className="pronunciation-section-title">5가지 주요 발음 규칙</h2>
          <div className="pronunciation-rules-row">
            {ruleCategories.map((rule) => (
              <div key={rule.name} className="pronunciation-rule-card">
                <div className="pronunciation-rule-icon">{rule.icon}</div>
                <div className="pronunciation-rule-name">{rule.name}</div>
                <div className="pronunciation-rule-description">
                  {rule.description}
                </div>
                <div className="pronunciation-examples-list">
                  {rule.examples.map((example, index) => (
                    <div key={index} className="pronunciation-example-text">
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 발음 분석 기능이 아래로 */}
        <PronunciationAnalyzer />
      </div>
    </div>
  );
};

export default Pronunciation;
