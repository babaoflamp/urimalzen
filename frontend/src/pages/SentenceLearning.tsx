import { useEffect } from "react";
// public 폴더의 정적 이미지 사용
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useLearningStore } from "../store/useLearningStore";
import { wordAPI, progressAPI, rankingAPI } from "../services/api";
import Header from "../components/Header";
import MainNav from "../components/MainNav";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import StoryList from "../components/StoryList";
import { useState } from "react";
import LearningArea from "../components/LearningArea";
import SelfStudy from "../components/SelfStudy";
import RankingInfo from "../components/RankingInfo";
import Navigation from "../components/Navigation";
import "./Learning.css";

const SentenceLearning = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setWords, setUserProgress, setRanking, setCurrentWordIndex } =
    useLearningStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Load initial data
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
        console.error("Failed to load data:", error);
      }
    };

    loadData();
  }, [
    isAuthenticated,
    navigate,
    setWords,
    setCurrentWordIndex,
    setUserProgress,
    setRanking,
  ]);

  // 이야기 데이터(StoryList와 동일하게 유지)
  const stories = [
    {
      id: 1,
      title: "나무꾼과 선녀",
      description: "착한 나무꾼과 하늘에서 내려온 선녀의 만남과 이별 이야기.",
      content: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            minHeight: 260,
          }}
        >
          <img
            src={"/images/story01.png"}
            alt="나무꾼과 선녀 그림"
            style={{
              width: 220,
              height: 220,
              objectFit: "cover",
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            }}
          />
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
              나무꾼과 선녀
            </h3>
            <p style={{ fontSize: 17, color: "#333", lineHeight: 1.7 }}>
              옛날 옛적에 착한 나무꾼이 숲에서 나무를 하다가 하늘에서 내려온
              선녀를 만나게 됩니다.
              <br />
              두 사람은 사랑에 빠지지만, 선녀는 다시 하늘로 돌아가야만 했습니다.
              <br />
              나무꾼은 슬퍼했지만, 선녀와의 추억을 소중히 간직하며 살아갑니다.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "토끼와 거북이",
      description: "경주에서 거북이가 토끼를 이기는 교훈적인 이야기.",
      content: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            minHeight: 260,
          }}
        >
          <img
            src={"/images/story02.png"}
            alt="토끼와 거북이 그림"
            style={{
              width: 220,
              height: 220,
              objectFit: "cover",
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            }}
          />
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
              토끼와 거북이
            </h3>
            <p style={{ fontSize: 17, color: "#333", lineHeight: 1.7 }}>
              빠른 토끼와 느린 거북이가 경주를 하게 됩니다.
              <br />
              토끼는 자신만만하게 경주 중에 잠이 들고, 거북이는 포기하지 않고
              끝까지 달려 결국 승리합니다.
              <br />
              꾸준함의 중요성을 알려주는 이야기입니다.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);

  const selectedStory = stories.find((s) => s.id === selectedStoryId);

  return (
    <div className="learning-container">
      <Header />
      <MainNav />

      <div className="learning-content">
        <div className="learning-main-content">
          <div className="learning-left-panel">
            <StoryList
              onSelect={setSelectedStoryId}
              selectedId={selectedStoryId ?? undefined}
            />
          </div>

          <div className="learning-center-area">
            {selectedStory ? (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  padding: 24,
                  marginBottom: 24,
                }}
              >
                {selectedStory.content}
              </div>
            ) : (
              <>
                <LearningArea />
                <Navigation />
              </>
            )}
          </div>

          <div className="learning-right-panel">
            <SelfStudy />
            <RankingInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentenceLearning;
