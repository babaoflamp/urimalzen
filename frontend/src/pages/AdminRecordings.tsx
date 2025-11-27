import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "./AdminCommon.css";
import { adminAPI } from "../services/api";
import AdminLayout from "../components/AdminLayout";

const AdminRecordings = () => {
  const [recordings, setRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadRecordings();
  }, [page]);

  const loadRecordings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getRecordings(page, 50);
      setRecordings(response.recordings);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error("Failed to load recordings:", error);
      toast.error("녹음 로딩 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (_id: string) => {
    if (!window.confirm("정말 이 녹음을 삭제하시겠습니까?")) return;
    try {
      await adminAPI.deleteRecording(_id);
      toast.success("녹음 삭제 완료");
      loadRecordings();
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(`삭제 실패: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div className="admin-page-header">
          <h1 className="admin-page-title">🎤 녹음 관리</h1>
          <div className="admin-page-info">총 {recordings.length}개</div>
        </div>

      {loading ? (
        <div className="admin-loading">로딩 중...</div>
      ) : (
        <>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>사용자</th>
                  <th>단어</th>
                  <th>파일 크기</th>
                  <th>녹음일</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {recordings.map((rec, idx) => (
                  <tr
                    key={rec._id}
                    className={
                      idx % 2 === 0
                        ? "admin-table-row-even"
                        : "admin-table-row-odd"
                    }
                  >
                    <td>{rec.userId?.username || "Unknown"}</td>
                    <td>{rec.wordId?.koreanWord || "Unknown"}</td>
                    <td>{Math.round((rec.fileSize || 0) / 1024)} KB</td>
                    <td>{new Date(rec.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="admin-action-button admin-action-button-delete"
                        onClick={() => handleDelete(rec._id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-pagination">
            <button
              className="admin-page-button"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              이전
            </button>
            <span className="admin-page-info">
              {page} / {totalPages}
            </span>
            <button
              className="admin-page-button"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              다음
            </button>
          </div>
        </>
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminRecordings;
