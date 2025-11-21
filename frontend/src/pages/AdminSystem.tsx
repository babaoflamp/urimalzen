import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminCommon.css";

const AdminSystem = () => {
  const navigate = useNavigate();
  const [systemHealth] = useState({
    database: "Connected",
    api: "Running",
    storage: "45% Used",
    uptime: "7 days",
  });

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <button
          className="admin-back-button"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← 뒤로
        </button>
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

      <div className="admin-section">
        <h2 className="admin-section-title">관리 작업</h2>
        <div className="admin-actions-grid">
          <button className="admin-action-button">📊 백업 생성</button>
          <button className="admin-action-button">🔄 데이터 동기화</button>
          <button className="admin-action-button">🗑️ 캐시 삭제</button>
          <button className="admin-action-button">📝 로그 보기</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSystem;
