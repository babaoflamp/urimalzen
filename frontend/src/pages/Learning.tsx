import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useLearningStore } from "../store/useLearningStore";
import { wordAPI, progressAPI, rankingAPI } from "../services/api";
import Header from "../components/Header";
import MainNav from "../components/MainNav";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import WordList from "../components/WordList";
import LearningArea from "../components/LearningArea";
import FunStoryContent from "../components/FunStoryContent";
import SelfStudy from "../components/SelfStudy";
import RankingInfo from "../components/RankingInfo";
import Navigation from "../components/Navigation";
import "./Learning.css";

const Learning = () => {
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

  return (
    <div className="learning-container">
      <Header />
      <MainNav />

      <div className="learning-content">
        <div className="learning-main-content">
          <div className="learning-left-panel">
            <SearchBar />
            <FilterPanel />
            <WordList />
          </div>

          <div className="learning-center-area">
            <Navigation />
            {/* 단어가 선택되어 있으면 LearningArea */}
            <LearningArea />
          </div>

          <div className="learning-right-panel">
            <RankingInfo />
            <SelfStudy />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
