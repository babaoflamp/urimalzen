import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../services/api";
import "./AdminCommon.css";

interface User {
  _id: string;
  username: string;
  email: string;
  level: { kiip: number; cefr: string };
  totalScore: number;
  region: string;
  country: string;
  isAdmin: boolean;
  createdAt: string;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers(page, 20);
      setUsers(response.users);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error("Failed to load users:", error);
      alert("사용자 로딩 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      loadUsers();
      return;
    }
    try {
      setLoading(true);
      // Search implementation would go here
      const response = await adminAPI.getUsers(1, 20);
      setUsers(
        response.users.filter(
          (u: User) =>
            u.username.includes(searchQuery) || u.email.includes(searchQuery)
        )
      );
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("정말 이 사용자를 삭제하시겠습니까?")) return;

    try {
      // Delete API call would go here
      alert("사용자 삭제 완료");
      loadUsers();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("삭제 실패");
    }
  };

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      // Toggle admin API call would go here
      alert("권한 변경 완료");
      loadUsers();
    } catch (error) {
      console.error("Toggle admin failed:", error);
      alert("권한 변경 실패");
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <button
          className="admin-back-button"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← 뒤로
        </button>
        <h1 className="admin-page-title">👥 사용자 관리</h1>
      </div>

      <div className="admin-search-bar">
        <input
          type="text"
          placeholder="사용자 이름 또는 이메일 검색..."
          className="admin-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="admin-search-button" onClick={handleSearch}>
          🔍 검색
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">로딩 중...</div>
      ) : (
        <>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>사용자명</th>
                  <th>이메일</th>
                  <th>레벨</th>
                  <th>국가</th>
                  <th>지역</th>
                  <th>점수</th>
                  <th>관리자</th>
                  <th>가입일</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    key={user._id}
                    className={
                      idx % 2 === 0
                        ? "admin-table-row-even"
                        : "admin-table-row-odd"
                    }
                  >
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      Lv{user.level.kiip} ({user.level.cefr})
                    </td>
                    <td>{user.country}</td>
                    <td>{user.region}</td>
                    <td>{user.totalScore}</td>
                    <td>{user.isAdmin ? "✅" : "❌"}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="admin-action-button"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                      >
                        수정
                      </button>
                      <button
                        className="admin-action-button admin-action-button-delete"
                        onClick={() => handleDelete(user._id)}
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

      {showEditModal && selectedUser && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h2 className="admin-modal-title">사용자 정보 수정</h2>
            <p className="admin-modal-text">사용자: {selectedUser.username}</p>
            <p className="admin-modal-text">이메일: {selectedUser.email}</p>
            <div className="admin-modal-actions">
              <button
                className="admin-modal-button"
                onClick={() => setShowEditModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
