import { useState } from "react";
import { adminTTSAPI, adminSTTAPI } from "../services/api";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "./AdminCommon.css";

const AdminSystem = () => {
  const [systemHealth] = useState({
    database: "Connected",
    api: "Running",
    storage: "45% Used",
    uptime: "7 days",
  });

  // SpeechPro API 설정 상태
  const [speechProUrl, setSpeechProUrl] = useState<string>(
    import.meta.env.VITE_SPEECHPRO_API_URL ||
      "http://112.220.79.222:33005/speechpro"
  );
  const [speechProStatus, setSpeechProStatus] = useState<string>("");
  const [speechProTestLoading, setSpeechProTestLoading] = useState(false);

  // MzTTS API 설정 상태
  const [mzttsUrl, setMzttsUrl] = useState<string>(
    import.meta.env.VITE_MZTTS_API_URL || "http://192.168.123.33:7779"
  );
  const [mzttsStatus, setMzttsStatus] = useState<string>("");
  const [mzttsTestLoading, setMzttsTestLoading] = useState(false);
  const [ttsUrl, setTtsUrl] = useState<string>(
    import.meta.env.VITE_TTS_API_URL || "http://112.220.79.218:56014"
  );
  // MzTTS API 연결 테스트
  const handleTestMzTTS = async () => {
    setMzttsTestLoading(true);
    setMzttsStatus("");
    try {
      const res = await axios.get(`${mzttsUrl}/health`, { timeout: 5000 });
      if (res.data && res.data.code === 200) {
        setMzttsStatus(
          "✅ 연결 성공: " + (res.data.message || "MzTTS 서버 정보 확인됨")
        );
      } else {
        setMzttsStatus("⚠️ 연결은 되었으나 응답 오류");
      }
    } catch (e: any) {
      setMzttsStatus("❌ 연결 실패: " + (e?.message || "오류"));
    } finally {
      setMzttsTestLoading(false);
    }
  };

  // TTS 설정 상태
  const [ttsStatus, setTTSStatus] = useState<string>("");
  const [ttsTestLoading, setTTSTestLoading] = useState(false);

  // STT 설정 상태
  const [sttStatus, setSTTStatus] = useState<string>("");
  const [sttTestLoading, setSTTTestLoading] = useState(false);

  // SpeechPro API 연결 테스트
  const handleTestSpeechPro = async () => {
    setSpeechProTestLoading(true);
    setSpeechProStatus("");
    try {
      // /gtp 엔드포인트에 샘플 요청
      const res = await axios.post(
        `${speechProUrl}/gtp`,
        { id: "test", text: "테스트" },
        { headers: { "Content-Type": "application/json" }, timeout: 5000 }
      );
      if (res.data && res.data["error code"] === 0) {
        setSpeechProStatus("✅ 연결 성공");
      } else {
        setSpeechProStatus("⚠️ 연결은 되었으나 응답 오류");
      }
    } catch (e: any) {
      setSpeechProStatus("❌ 연결 실패: " + (e?.message || "오류"));
    } finally {
      setSpeechProTestLoading(false);
    }
  };

  // TTS 연결 테스트
  const handleTestTTS = async () => {
    setTTSTestLoading(true);
    setTTSStatus("");
    try {
      const res = await adminTTSAPI.testConnection();
      if (res && res.success) {
        setTTSStatus("✅ 연결 성공");
      } else {
        setTTSStatus("❌ 연결 실패: " + (res?.message || "오류"));
      }
    } catch (e: any) {
      setTTSStatus("❌ 연결 실패: " + (e?.message || "오류"));
    } finally {
      setTTSTestLoading(false);
    }
  };

  // STT 연결 테스트
  const handleTestSTT = async () => {
    setSTTTestLoading(true);
    setSTTStatus("");
    try {
      const res = await adminSTTAPI.testConnection();
      setSTTStatus(res.message || "✅ 연결 성공");
    } catch (e: any) {
      setSTTStatus("❌ 연결 실패: " + (e?.message || "오류"));
    } finally {
      setSTTTestLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div className="admin-page-header">
          <h1 className="admin-page-title">⚙️ 시스템 설정</h1>
        </div>

        <div className="admin-section">
          <h2 className="admin-section-title">시스템 상태</h2>
          <div className="admin-health-grid">
            <div className="admin-health-card">
              <div className="admin-health-icon">💾</div>
              <div className="admin-health-label">데이터베이스</div>
              <div className="admin-health-value">{systemHealth.database}</div>
            </div>
            <div className="admin-health-card">
              <div className="admin-health-icon">🚀</div>
              <div className="admin-health-label">API 서버</div>
              <div className="admin-health-value">{systemHealth.api}</div>
            </div>
            <div className="admin-health-card">
              <div className="admin-health-icon">📦</div>
              <div className="admin-health-label">저장공간</div>
              <div className="admin-health-value">{systemHealth.storage}</div>
            </div>
            <div className="admin-health-card">
              <div className="admin-health-icon">⏱️</div>
              <div className="admin-health-label">가동시간</div>
              <div className="admin-health-value">{systemHealth.uptime}</div>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h2 className="admin-section-title">환경 설정</h2>
          <div className="admin-config-box">
            <div className="admin-config-item">
              <span className="admin-config-label">API URL:</span>
              <span className="admin-config-value">
                {import.meta.env.VITE_API_URL}
              </span>
            </div>
            <div className="admin-config-item">
              <span className="admin-config-label">환경:</span>
              <span className="admin-config-value">{import.meta.env.MODE}</span>
            </div>
          </div>
        </div>

        {/* 음성 엔진(TTS/STT/SpeechPro/MzTTS) 통합 설정 섹션 */}
        <div className="admin-section">
          <h2 className="admin-section-title">
            음성 엔진 설정 (TTS / STT / SpeechPro / MzTTS)
          </h2>
          <div className="admin-form-inline-box">
            {/* TTS 서버 주소 고정 텍스트 삭제됨 */}
            {/* MzTTS API URL 항목 삭제됨 */}
            {/* SpeechPro 설정 - 인라인 스타일 적용 */}
            <div className="admin-form-inline-group">
              <label className="admin-form-inline-label">
                SpeechPro API URL
              </label>
              <input
                type="text"
                className="admin-form-inline-input"
                value={speechProUrl}
                onChange={(e) => setSpeechProUrl(e.target.value)}
                placeholder="SpeechPro API URL"
                disabled={speechProTestLoading}
              />
              <button
                className="admin-form-inline-button admin-primary-button admin-form-inline-minwidth"
                onClick={handleTestSpeechPro}
                disabled={speechProTestLoading}
              >
                {speechProTestLoading ? "테스트 중..." : "연결 테스트"}
              </button>
              <span className="admin-form-inline-status admin-form-inline-minwidth">
                {speechProStatus}
              </span>
            </div>
            {/* TTS 설정 - 인라인 스타일 적용 */}
            <div className="admin-form-inline-group">
              <label className="admin-form-inline-label">TTS 서비스 상태</label>
              <input
                type="text"
                className="admin-form-inline-input"
                value={ttsUrl}
                onChange={(e) => setTtsUrl(e.target.value)}
                placeholder={
                  import.meta.env.VITE_TTS_API_URL ||
                  "http://112.220.79.218:56014"
                }
                style={{ minWidth: 220, marginRight: 8 }}
              />
              <button
                className="admin-form-inline-button admin-primary-button admin-form-inline-minwidth"
                onClick={handleTestTTS}
                disabled={ttsTestLoading}
              >
                {ttsTestLoading ? "테스트 중..." : "연결 테스트"}
              </button>
              <span className="admin-form-inline-status admin-form-inline-minwidth">
                {ttsStatus}
              </span>
            </div>
            {/* STT 설정 - 인라인 스타일 적용 */}
            <div className="admin-form-inline-group">
              <label className="admin-form-inline-label">STT 서비스 상태</label>
              <button
                className="admin-form-inline-button admin-primary-button admin-form-inline-minwidth"
                onClick={handleTestSTT}
                disabled={sttTestLoading}
              >
                {sttTestLoading ? "테스트 중..." : "연결 테스트"}
              </button>
              <span className="admin-form-inline-status admin-form-inline-minwidth">
                {sttStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h2 className="admin-section-title">관리 작업</h2>
        <div className="admin-actions-grid">
          <button className="admin-action-button">📊 백업 생성</button>
          <button className="admin-action-button">🔄 데이터 동기화</button>
          <button className="admin-action-button">🗑️ 캐시 삭제</button>
          <button className="admin-action-button">📝 로그 보기</button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSystem;
