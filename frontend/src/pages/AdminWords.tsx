import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { adminAPI } from "../services/api";
import type { Word } from "../types";
import AdminLayout from "../components/AdminLayout";
import "./AdminCommon.css";

const AdminWords = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Word>>({});

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getWords();
      setWords(response);
    } catch (error) {
      console.error("Failed to load words:", error);
      toast.error("단어 로딩 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [words, searchQuery, selectedLevel, selectedCategory]);

  const applyFilters = () => {
    let filtered = [...words];

    // 검색어 필터
    if (searchQuery) {
      filtered = filtered.filter(
        (w) =>
          w.koreanWord.includes(searchQuery) ||
          w.mongolianWord.includes(searchQuery) ||
          w.pronunciation?.includes(searchQuery)
      );
    }

    // 레벨 필터
    if (selectedLevel !== "all") {
      filtered = filtered.filter(
        (w) => w.level.kiip === parseInt(selectedLevel)
      );
    }

    // 카테고리 필터
    if (selectedCategory !== "all") {
      filtered = filtered.filter((w) => w.mainCategory === selectedCategory);
    }

    setFilteredWords(filtered);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedLevel("all");
    setSelectedCategory("all");
  };

  const handleEdit = (word: Word) => {
    setSelectedWord(word);
    setEditForm(word);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!selectedWord) return;
    try {
      await adminAPI.updateWord(selectedWord._id, editForm);
      toast.success("단어 수정 완료");
      setShowEditModal(false);
      loadWords();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("수정 실패");
    }
  };

  const handleDelete = async (wordId: string) => {
    if (!confirm("정말 이 단어를 삭제하시겠습니까?")) return;
    try {
      await adminAPI.deleteWord(wordId);
      toast.success("단어 삭제 완료");
      loadWords();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("삭제 실패");
    }
  };

  const categories = Array.from(new Set(words.map((w) => w.mainCategory)));

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div className="admin-page-header">
          <h1 className="admin-page-title">📚 단어 관리</h1>
          <div className="admin-page-info">총 {filteredWords.length}개</div>
        </div>

        {/* 필터 섹션 */}
        <div className="admin-filter-bar">
          <div className="admin-filter-group">
            <label className="admin-filter-label">검색</label>
            <input
              type="text"
              placeholder="한국어/몽골어/발음 검색..."
              className="admin-filter-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="admin-filter-group">
            <label className="admin-filter-label">레벨</label>
            <select
              className="admin-filter-input"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="all">전체</option>
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <option key={level} value={level}>
                  Level {level}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-filter-group">
            <label className="admin-filter-label">카테고리</label>
            <select
              className="admin-filter-input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">전체</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            className="admin-refresh-button"
            onClick={resetFilters}
          >
            🔄 초기화
          </button>
        </div>

      {loading ? (
        <div className="admin-loading">로딩 중...</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>순서</th>
                <th>한국어</th>
                <th>몽골어</th>
                <th>발음</th>
                <th>레벨</th>
                <th>카테고리</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredWords.slice(0, 50).map((word, idx) => (
                <tr
                  key={word._id}
                  className={
                    idx % 2 === 0
                      ? "admin-table-row-even"
                      : "admin-table-row-odd"
                  }
                >
                  <td>{word.order}</td>
                  <td>{word.koreanWord}</td>
                  <td>{word.mongolianWord}</td>
                  <td>{word.pronunciation}</td>
                  <td>Lv{word.level.kiip}</td>
                  <td>{word.mainCategory}</td>
                  <td>
                    <button
                      className="admin-action-button"
                      onClick={() => handleEdit(word)}
                    >
                      수정
                    </button>
                    <button
                      className="admin-action-button admin-action-button-delete"
                      onClick={() => handleDelete(word._id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showEditModal && selectedWord && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h2 className="admin-modal-title">단어 수정</h2>
            <div className="admin-form-group">
              <label className="admin-form-label">한국어:</label>
              <input
                className="admin-form-input"
                value={editForm.koreanWord || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, koreanWord: e.target.value })
                }
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">몽골어:</label>
              <input
                className="admin-form-input"
                value={editForm.mongolianWord || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, mongolianWord: e.target.value })
                }
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">발음:</label>
              <input
                className="admin-form-input"
                value={editForm.pronunciation || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, pronunciation: e.target.value })
                }
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">설명:</label>
              <textarea
                className="admin-form-textarea"
                value={editForm.description || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </div>
            <div className="admin-modal-actions">
              <button className="admin-modal-button" onClick={handleSave}>
                저장
              </button>
              <button
                className="admin-modal-button admin-modal-button-cancel"
                onClick={() => setShowEditModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminWords;
