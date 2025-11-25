import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./AdminCommon.css";
import { useAuthStore } from "../store/useAuthStore";
import { adminTTSAPI, wordAPI } from "../services/api";
import type { Word } from "../types";

const AdminTTS = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"single" | "library" | "batch" | "dictionary">("single");
  const [words, setWords] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("");

  // MzTTS controls
  const [speaker, setSpeaker] = useState<string>("Jieun-neutral");
  const [tempo, setTempo] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [gain, setGain] = useState<number>(1.0);
  const [audioUrl, setAudioUrl] = useState<string>("");

  // Audio library state
  const [audioLibrary, setAudioLibrary] = useState<any[]>([]);
  const [libraryPage, setLibraryPage] = useState(1);
  const [libraryTotal, setLibraryTotal] = useState(0);
  const [libraryLoading, setLibraryLoading] = useState(false);

  // Speaker options (8 voices)
  const speakers = [
    { value: "Jieun-neutral", label: "지은 (중립)" },
    { value: "Jieun-pleasure", label: "지은 (기쁨)" },
    { value: "Jieun-anger", label: "지은 (화남)" },
    { value: "Jieun-sadness", label: "지은 (슬픔)" },
    { value: "Seojun-neutral", label: "서준 (중립)" },
    { value: "Seojun-pleasure", label: "서준 (기쁨)" },
    { value: "Seojun-anger", label: "서준 (화남)" },
    { value: "Seojun-sadness", label: "서준 (슬픔)" },
  ];

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/admin/login");
      return;
    }
    loadWords();
    testTTSConnection();
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === "library") {
      loadAudioLibrary(1);
    }
  }, [activeTab]);

  const loadWords = async () => {
    try {
      const response = await wordAPI.getAllWords();
      setWords(response.data);
    } catch (error) {
      console.error("Failed to load words:", error);
    }
  };

  const testTTSConnection = async () => {
    try {
      const response = await adminTTSAPI.testConnection();
      setConnectionStatus(response.data.message);
    } catch (error: any) {
      setConnectionStatus(`연결 실패: ${error.message}`);
    }
  };

  const loadAudioLibrary = async (page: number = 1) => {
    setLibraryLoading(true);
    try {
      const response = await adminTTSAPI.getAllAudio(page, 20);
      setAudioLibrary(response.data);
      setLibraryTotal(response.total);
      setLibraryPage(page);
    } catch (error: any) {
      console.error("Failed to load audio library:", error);
      toast.error(`오디오 라이브러리 로드 실패: ${error.message}`);
    } finally {
      setLibraryLoading(false);
    }
  };

  const handleDeleteAudio = async (audioId: string) => {
    if (!window.confirm("이 오디오 파일을 삭제하시겠습니까?")) return;

    try {
      await adminTTSAPI.deleteAudio(audioId);
      toast.success("오디오 파일이 삭제되었습니다.");
      loadAudioLibrary(libraryPage);
    } catch (error: any) {
      toast.error(`삭제 실패: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleGenerateWordAudio = async () => {
    if (!selectedWord) {
      toast.error("단어를 선택해주세요");
      return;
    }

    setLoading(true);
    setResult(null);
    setAudioUrl("");

    try {
      const response = await adminTTSAPI.generateWordAudio(selectedWord, {
        speaker,
        tempo,
        pitch,
        gain,
      });
      setResult(response);

      // Extract audio URL from response
      if (response.data?.audioUrl) {
        // audioUrl already includes /uploads/tts/ prefix
        const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
        setAudioUrl(`${baseUrl}${response.data.audioUrl}`);
        console.log('Audio URL:', `${baseUrl}${response.data.audioUrl}`);
      }

      toast.success("단어 오디오 생성 완료!");
    } catch (error: any) {
      toast.error(`오류: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderSingleGeneration = () => (
    <>
      <div className="admin-card">
        <h2 className="admin-card-title">단어 선택</h2>
        <select
          value={selectedWord}
          onChange={(e) => setSelectedWord(e.target.value)}
          className="admin-select"
        >
          <option value="">-- 단어를 선택하세요 --</option>
          {words.map((word) => (
            <option key={word._id} value={word._id}>
              {word.koreanWord} ({word.mongolianWord})
            </option>
          ))}
        </select>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">음성 설정</h2>

        <div style={{ marginBottom: "20px" }}>
          <label className="admin-label">화자 선택</label>
          <select
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            className="admin-select"
          >
            {speakers.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label className="admin-label">
            말하기 속도 (Tempo): {tempo.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={tempo}
            onChange={(e) => setTempo(parseFloat(e.target.value))}
            style={{ width: "100%", height: "8px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#666" }}>
            <span>느림 (0.1)</span>
            <span>보통 (1.0)</span>
            <span>빠름 (2.0)</span>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label className="admin-label">
            음높이 (Pitch): {pitch.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            style={{ width: "100%", height: "8px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#666" }}>
            <span>낮음 (0.1)</span>
            <span>보통 (1.0)</span>
            <span>높음 (2.0)</span>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label className="admin-label">
            음량 (Gain): {gain.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={gain}
            onChange={(e) => setGain(parseFloat(e.target.value))}
            style={{ width: "100%", height: "8px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#666" }}>
            <span>작음 (0.1)</span>
            <span>보통 (1.0)</span>
            <span>큼 (2.0)</span>
          </div>
        </div>

        <button
          onClick={() => {
            setSpeaker("Jieun-neutral");
            setTempo(1.0);
            setPitch(1.0);
            setGain(1.0);
          }}
          className="admin-action-button"
          style={{ marginTop: "10px", width: "100%" }}
        >
          기본값으로 초기화
        </button>
      </div>

      <div className="admin-action-grid">
        <button
          onClick={handleGenerateWordAudio}
          disabled={loading || !selectedWord}
          className="admin-action-button"
        >
          {loading ? "생성 중..." : "🎵 단어 오디오 생성"}
        </button>
      </div>

      {audioUrl && (
        <div className="admin-card">
          <h2 className="admin-card-title">오디오 미리보기</h2>
          <audio controls src={audioUrl} style={{ width: "100%", marginTop: "10px" }}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {result && (
        <div className="admin-result-card">
          <h2 className="admin-card-title">생성 결과</h2>
          <pre className="admin-result-pre">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </>
  );

  const renderAudioLibrary = () => (
    <>
      <div className="admin-card">
        <h2 className="admin-card-title">오디오 라이브러리</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          생성된 TTS 오디오 파일 목록입니다. 총 {libraryTotal}개
        </p>

        {libraryLoading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            로딩 중...
          </div>
        ) : audioLibrary.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
            생성된 오디오 파일이 없습니다.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>단어</th>
                  <th>타입</th>
                  <th>음성</th>
                  <th>속도</th>
                  <th>크기</th>
                  <th>생성일</th>
                  <th>재생</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {audioLibrary.map((audio) => (
                  <tr key={audio._id}>
                    <td>
                      {audio.wordId?.koreanWord || "N/A"}
                      <br />
                      <small style={{ color: "#666" }}>
                        {audio.wordId?.mongolianWord || ""}
                      </small>
                    </td>
                    <td>{audio.audioType}</td>
                    <td>{audio.voice}</td>
                    <td>{audio.speed}x</td>
                    <td>{(audio.fileSize / 1024).toFixed(1)} KB</td>
                    <td>{new Date(audio.createdAt).toLocaleDateString("ko-KR")}</td>
                    <td>
                      <audio
                        controls
                        src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${audio.fileUrl}`}
                        style={{ width: "200px", height: "40px" }}
                        onError={() => {
                          console.error('Audio load error:', audio.fileUrl);
                          console.error('Full URL:', `${import.meta.env.VITE_API_URL.replace('/api', '')}${audio.fileUrl}`);
                        }}
                        onLoadedMetadata={() => {
                          console.log('Audio loaded successfully:', audio.fileUrl);
                        }}
                      >
                        브라우저가 오디오를 지원하지 않습니다.
                      </audio>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteAudio(audio._id)}
                        className="admin-delete-button"
                        style={{ padding: "5px 10px", fontSize: "12px" }}
                      >
                        🗑️ 삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {libraryTotal > 20 && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={() => loadAudioLibrary(libraryPage - 1)}
              disabled={libraryPage === 1}
              className="admin-action-button"
              style={{ marginRight: "10px" }}
            >
              이전
            </button>
            <span style={{ color: "#666", margin: "0 10px" }}>
              {libraryPage} / {Math.ceil(libraryTotal / 20)}
            </span>
            <button
              onClick={() => loadAudioLibrary(libraryPage + 1)}
              disabled={libraryPage >= Math.ceil(libraryTotal / 20)}
              className="admin-action-button"
              style={{ marginLeft: "10px" }}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </>
  );

  const renderBatchGeneration = () => (
    <div className="admin-card">
      <h2 className="admin-card-title">대량 생성</h2>
      <p style={{ color: "#666", padding: "20px" }}>
        이 기능은 곧 구현될 예정입니다. 여러 단어를 선택하여 한 번에 TTS 오디오를 생성할 수 있습니다.
      </p>
    </div>
  );

  const renderWordDictionary = () => (
    <div className="admin-card">
      <h2 className="admin-card-title">발음 사전 관리</h2>
      <p style={{ color: "#666", padding: "20px" }}>
        이 기능은 곧 구현될 예정입니다. MzTTS 단어 치환 규칙을 추가하거나 삭제할 수 있습니다.
      </p>
    </div>
  );

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="admin-back-button"
        >
          ← 대시보드로
        </button>
        <h1 className="admin-page-title">TTS 오디오 관리</h1>
      </div>

      <div className="admin-status-card">
        <div className="admin-status-label">MzTTS 서비스 연결 상태:</div>
        <div
          className={
            connectionStatus.includes("성공")
              ? "admin-status-success"
              : "admin-status-error"
          }
        >
          {connectionStatus || "확인 중..."}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "single" ? "admin-tab-active" : ""}`}
          onClick={() => setActiveTab("single")}
        >
          🎤 단일 생성
        </button>
        <button
          className={`admin-tab ${activeTab === "library" ? "admin-tab-active" : ""}`}
          onClick={() => setActiveTab("library")}
        >
          📁 오디오 라이브러리
        </button>
        <button
          className={`admin-tab ${activeTab === "batch" ? "admin-tab-active" : ""}`}
          onClick={() => setActiveTab("batch")}
        >
          ⚡ 대량 생성
        </button>
        <button
          className={`admin-tab ${activeTab === "dictionary" ? "admin-tab-active" : ""}`}
          onClick={() => setActiveTab("dictionary")}
        >
          📖 발음 사전
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-tab-content">
        {activeTab === "single" && renderSingleGeneration()}
        {activeTab === "library" && renderAudioLibrary()}
        {activeTab === "batch" && renderBatchGeneration()}
        {activeTab === "dictionary" && renderWordDictionary()}
      </div>
    </div>
  );
};

export default AdminTTS;
