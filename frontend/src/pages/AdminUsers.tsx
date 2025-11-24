import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adminAPI } from "../services/api";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/ConfirmModal";
import type { IUser } from "../types";
import "./AdminCommon.css";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    username: string | null;
  }>({ isOpen: false, userId: null, username: null });

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers(page, 20);
      setUsers(response.users);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("사용자 로딩에 실패했습니다");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setPage(1);
      loadUsers();
      return;
    }

    try {
      setLoading(true);
      const response = await adminAPI.searchUsers({ q: searchQuery, page: 1, limit: 20 });
      setUsers(response.users);
      setTotalPages(response.pagination.pages);
      setPage(1);
      toast.success(`${response.pagination.total}명의 사용자를 찾았습니다`);
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("검색에 실패했습니다");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, loadUsers]);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.userId) return;

    try {
      await adminAPI.deleteUser(deleteModal.userId);
      toast.success(`사용자 "${deleteModal.username}"가 삭제되었습니다`);
      setDeleteModal({ isOpen: false, userId: null, username: null });
      loadUsers();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("사용자 삭제에 실패했습니다");
    }
  };

  const handleToggleAdmin = async (userId: string, username: string, currentStatus: boolean) => {
    try {
      await adminAPI.updateUserAdmin(userId, !currentStatus);
      toast.success(
        `"${username}"의 관리자 권한이 ${!currentStatus ? "부여" : "제거"}되었습니다`
      );
      loadUsers();
    } catch (error) {
      console.error("Toggle admin failed:", error);
      toast.error("권한 변경에 실패했습니다");
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <button
          className="admin-back-button"
          onClick={() => navigate("/admin/dashboard")}
          aria-label="대시보드로 돌아가기"
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
          aria-label="사용자 검색"
        />
        <button
          className="admin-search-button"
          onClick={handleSearch}
          aria-label="검색 실행"
        >
          🔍 검색
        </button>
        {searchQuery && (
          <button
            className="admin-search-button"
            onClick={() => {
              setSearchQuery("");
              setPage(1);
              loadUsers();
            }}
            aria-label="검색 초기화"
          >
            ✕ 초기화
          </button>
        )}
      </div>

      {loading ? (
        <Spinner size="large" message="사용자 목록을 불러오는 중..." />
      ) : users.length === 0 ? (
        <EmptyState
          icon="👥"
          title={searchQuery ? "검색 결과가 없습니다" : "등록된 사용자가 없습니다"}
          message={
            searchQuery
              ? "다른 검색어로 다시 시도해보세요"
              : "아직 가입한 사용자가 없습니다"
          }
          actionLabel={searchQuery ? "검색 초기화" : undefined}
          onAction={
            searchQuery
              ? () => {
                  setSearchQuery("");
                  loadUsers();
                }
              : undefined
          }
        />
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
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      Lv{user.level?.kiip || 0} ({user.level?.cefr || "N/A"})
                    </td>
                    <td>{user.country || "-"}</td>
                    <td>{user.region || "-"}</td>
                    <td>{user.totalScore || 0}</td>
                    <td>
                      <button
                        className={`admin-badge ${user.isAdmin ? "admin-badge-success" : "admin-badge-default"}`}
                        onClick={() =>
                          handleToggleAdmin(user._id, user.username, user.isAdmin)
                        }
                        title={`${user.isAdmin ? "관리자 권한 제거" : "관리자 권한 부여"}`}
                        aria-label={`${user.username} 관리자 권한 ${user.isAdmin ? "제거" : "부여"}`}
                      >
                        {user.isAdmin ? "✅ 관리자" : "❌ 일반"}
                      </button>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString("ko-KR")}</td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="admin-action-button"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          aria-label={`${user.username} 정보 보기`}
                        >
                          👁️ 보기
                        </button>
                        <button
                          className="admin-action-button admin-action-button-delete"
                          onClick={() =>
                            setDeleteModal({
                              isOpen: true,
                              userId: user._id,
                              username: user.username,
                            })
                          }
                          aria-label={`${user.username} 삭제`}
                        >
                          🗑️ 삭제
                        </button>
                      </div>
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
              aria-label="이전 페이지"
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
              aria-label="다음 페이지"
            >
              다음
            </button>
          </div>
        </>
      )}

      {/* 사용자 정보 모달 */}
      {showEditModal && selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal-title">👤 사용자 정보</h2>
            <div style={{ marginBottom: "24px" }}>
              <div className="admin-modal-field">
                <strong>사용자명:</strong> {selectedUser.username}
              </div>
              <div className="admin-modal-field">
                <strong>이메일:</strong> {selectedUser.email}
              </div>
              <div className="admin-modal-field">
                <strong>레벨:</strong> KIIP Lv{selectedUser.level?.kiip || 0},{" "}
                CEFR {selectedUser.level?.cefr || "N/A"}
              </div>
              <div className="admin-modal-field">
                <strong>국가:</strong> {selectedUser.country || "미설정"}
              </div>
              <div className="admin-modal-field">
                <strong>지역:</strong> {selectedUser.region || "미설정"}
              </div>
              <div className="admin-modal-field">
                <strong>총 점수:</strong> {selectedUser.totalScore || 0}점
              </div>
              <div className="admin-modal-field">
                <strong>관리자:</strong> {selectedUser.isAdmin ? "✅ 예" : "❌ 아니오"}
              </div>
              <div className="admin-modal-field">
                <strong>가입일:</strong>{" "}
                {new Date(selectedUser.createdAt).toLocaleString("ko-KR")}
              </div>
              {selectedUser.updatedAt && (
                <div className="admin-modal-field">
                  <strong>최종 활동:</strong>{" "}
                  {new Date(selectedUser.updatedAt).toLocaleString("ko-KR")}
                </div>
              )}
            </div>
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

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="사용자 삭제 확인"
        message={`정말로 "${deleteModal.username}" 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 사용자의 모든 학습 기록과 녹음이 함께 삭제됩니다.`}
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, userId: null, username: null })}
        isDangerous={true}
      />
    </div>
  );
};

export default AdminUsers;
