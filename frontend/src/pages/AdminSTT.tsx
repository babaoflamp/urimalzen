import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminCommon.css";
import { useAuthStore } from "../store/useAuthStore";
import { adminSTTAPI } from "../services/api";
import AdminLayout from "../components/AdminLayout";

const AdminSTT = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("");

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/admin/login");
      return;
    }
    testSTTConnection();
    loadEvaluations();
    loadStats();
  }, [user, navigate]);

  const testSTTConnection = async () => {
    try {
      const response = await adminSTTAPI.testConnection();
      setConnectionStatus(response.data.message);
    } catch (error: any) {
      setConnectionStatus(`연결 실패: ${error.message}`);
    }
  };

  const loadEvaluations = async () => {
    setLoading(true);
    try {
      const response = await adminSTTAPI.getAllEvaluations(1, 10);
      setEvaluations(response.data || []);
    } catch (error) {
      console.error("Failed to load evaluations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await adminSTTAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div className="admin-page-header">
          <h1 className="admin-page-title">🎙️ STT 발음 평가 관리</h1>
        </div>

      <div className="admin-status-card">
        <div className="admin-status-label">STT 서비스 연결 상태:</div>
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

      {stats && (
        <div className="admin-stats-card">
          <h2 className="admin-card-title">전체 통계</h2>
          <div className="admin-stats-grid">
            <div className="admin-stat-item">
              <div className="admin-stat-label">총 평가 수</div>
              <div className="admin-stat-value">{stats.total || 0}</div>
            </div>
            <div className="admin-stat-item">
              <div className="admin-stat-label">평균 정확도</div>
              <div className="admin-stat-value">
                {stats.averages?.avgAccuracy
                  ? `${(stats.averages.avgAccuracy * 100).toFixed(1)}%`
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card">
        <h2 className="admin-card-title">최근 평가 목록</h2>
        {loading ? (
          <div className="admin-loading-text">로딩 중...</div>
        ) : evaluations.length === 0 ? (
          <div className="admin-empty-text">평가 내역이 없습니다</div>
        ) : (
          <div className="admin-evaluation-list">
            {evaluations.map((evaluation) => (
              <div key={evaluation._id} className="admin-evaluation-item">
                <div className="admin-evaluation-info">
                  <div>평가 ID: {evaluation._id}</div>
                  <div>
                    정확도: {(evaluation.accuracyScore * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSTT;
