import { useNavigate } from "react-router-dom";
import { useTopikStore } from "../store/useTopikStore";
import { useLanguageStore } from "../store/useLanguageStore";
import Header from "../components/Header";
import MainNav from "../components/MainNav";
import "./TOPIKLevels.css";

const TOPIKLevels = () => {
  const navigate = useNavigate();
  const { setSelectedLevel, selectedLevel } = useTopikStore();
  const { language } = useLanguageStore();

  const handleLevelSelect = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    setSelectedLevel(level);
  };

  const handleSectionSelect = (section: "listening" | "reading" | "writing") => {
    if (!selectedLevel) {
      alert(language === "ko" ? "레벨을 먼저 선택해주세요" : "Түвшингээ сонгоно уу");
      return;
    }
    navigate("/topik/test", {
      state: { topikLevel: selectedLevel, testSection: section },
    });
  };

  const levels = [
    {
      level: 1 as 1 | 2 | 3 | 4 | 5 | 6,
      title: "TOPIK I - 1급",
      titleMn: "TOPIK I - 1 шат",
      desc: "한국어 기초 문법과 필수 어휘",
      descMn: "Солонгос хэлний үндсэн дүрэм, шаардлагатай үг",
    },
    {
      level: 2 as 1 | 2 | 3 | 4 | 5 | 6,
      title: "TOPIK I - 2급",
      titleMn: "TOPIK I - 2 шат",
      desc: "일상생활 의사소통",
      descMn: "Өдөр тутмын харилцаа",
    },
    {
      level: 3 as 1 | 2 | 3 | 4 | 5 | 6,
      title: "TOPIK II - 3급",
      titleMn: "TOPIK II - 3 шат",
      desc: "사회생활과 업무 기본 의사소통",
      descMn: "Нийгэм, ажлын үндсэн харилцаа",
    },
    {
      level: 4 as 1 | 2 | 3 | 4 | 5 | 6,
      title: "TOPIK II - 4급",
      titleMn: "TOPIK II - 4 шат",
      desc: "전문적인 업무와 뉴스 이해",
      descMn: "Мэргэжлийн ажил, мэдээ ойлгох",
    },
    {
      level: 5 as 1 | 2 | 3 | 4 | 5 | 6,
      title: "TOPIK II - 5급",
      titleMn: "TOPIK II - 5 шат",
      desc: "전문 분야의 학습과 연구",
      descMn: "Мэргэжлийн салбарын судалгаа",
    },
    {
      level: 6 as 1 | 2 | 3 | 4 | 5 | 6,
      title: "TOPIK II - 6급",
      titleMn: "TOPIK II - 6 шат",
      desc: "고급 한국어 유창한 구사",
      descMn: "Өндөр түвшний чөлөөтэй ярих",
    },
  ];

  const sections = [
    {
      id: "listening" as const,
      icon: "🎧",
      title: language === "ko" ? "듣기" : "Сонсох",
      desc: language === "ko" ? "듣기 영역 연습" : "Сонсох дасгал",
      color: "#4285f4",
    },
    {
      id: "reading" as const,
      icon: "📖",
      title: language === "ko" ? "읽기" : "Унших",
      desc: language === "ko" ? "읽기 영역 연습" : "Унших дасгал",
      color: "#34a853",
    },
    {
      id: "writing" as const,
      icon: "✍️",
      title: language === "ko" ? "쓰기" : "Бичих",
      desc: language === "ko" ? "쓰기 영역 연습" : "Бичих дасгал",
      color: "#ea4335",
    },
  ];

  return (
    <div className="topik-levels-container">
      <Header />
      <MainNav />

      <div className="topik-levels-content">
        <div className="topik-levels-hero">
          <h1 className="topik-levels-hero-title">
            {language === "ko" ? "TOPIK 레벨 선택" : "TOPIK түвшин сонгох"}
          </h1>
          <p className="topik-levels-hero-subtitle">
            {language === "ko"
              ? "자신의 수준에 맞는 레벨을 선택하세요"
              : "Өөрийн түвшинд тохирсон түвшингээ сонгоно уу"}
          </p>
        </div>

        <div className="topik-levels-grid">
          {levels.map((lvl) => (
            <div
              key={lvl.level}
              className={`topik-level-item ${
                selectedLevel === lvl.level ? "selected" : ""
              }`}
              onClick={() => handleLevelSelect(lvl.level)}
            >
              <div className="topik-level-item-number">{lvl.level}</div>
              <div className="topik-level-item-title">
                {language === "ko" ? lvl.title : lvl.titleMn}
              </div>
              <div className="topik-level-item-desc">
                {language === "ko" ? lvl.desc : lvl.descMn}
              </div>
            </div>
          ))}
        </div>

        {selectedLevel && (
          <div className="topik-sections-container">
            <h2 className="topik-sections-title">
              {language === "ko" ? "시험 영역 선택" : "Шалгалтын хэсэг сонгох"}
            </h2>
            <div className="topik-sections-grid">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="topik-section-card"
                  style={{ borderColor: section.color }}
                  onClick={() => handleSectionSelect(section.id)}
                >
                  <div className="topik-section-icon">{section.icon}</div>
                  <div className="topik-section-title">{section.title}</div>
                  <div className="topik-section-desc">{section.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TOPIKLevels;
