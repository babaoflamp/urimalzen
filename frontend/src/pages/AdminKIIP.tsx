import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "./AdminCommon.css";
import { unitAPI } from "../services/api";
import AdminLayout from "../components/AdminLayout";

const AdminKIIP = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      setLoading(true);
      const response = await unitAPI.getAllUnits();
      setUnits(response.data || []);
    } catch (error) {
      console.error("Failed to load units:", error);
      toast.error("유닛 로딩 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div className="admin-page-header">
          <h1 className="admin-page-title">🎓 KIIP 컨텐츠 관리</h1>
        </div>

      <div className="admin-info-box">
        <h3 className="admin-info-title">KIIP 커리큘럼</h3>
        <p className="admin-info-text">
          Korea Immigration & Integration Program (KIIP) 단계별 학습 컨텐츠를
          관리합니다.
        </p>
        <p className="admin-info-text">
          총 {units.length}개의 유닛이 등록되어 있습니다.
        </p>
      </div>

      {loading ? (
        <div className="admin-loading">로딩 중...</div>
      ) : (
        <div className="admin-units-grid">
          {units.map((unit) => (
            <div key={unit._id} className="admin-unit-card">
              <div className="admin-unit-header">
                <h3 className="admin-unit-title">{unit.title}</h3>
                <span className="admin-unit-level">Level {unit.kiipLevel}</span>
              </div>
              <p className="admin-unit-subtitle">{unit.titleMn}</p>
              <div className="admin-unit-stats">
                <span className="admin-stat-item">
                  📚 {unit.lessons?.length || 0} 레슨
                </span>
                <span className="admin-stat-item">✅ 챌린지 포함</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="admin-action-section">
        <button className="admin-primary-button">+ 새 유닛 추가</button>
        <button className="admin-secondary-button">카테고리 관리</button>
      </div>
      </div>
    </AdminLayout>
  );
};

export default AdminKIIP;
