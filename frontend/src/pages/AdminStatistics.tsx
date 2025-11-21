import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminCommon.css";
import { adminStatsAPI } from "../services/api";
import StatCard from "../components/charts/StatCard";
import MetricTile from "../components/charts/MetricTile";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type {
  DashboardStatsResponse,
  UserStatsResponse,
  LearningStatsResponse,
  PronunciationStatsResponse,
  ContentStatsResponse,
  TrendStatsResponse,
} from "../types";

const AdminStatistics = () => {
  const navigate = useNavigate();

  // State for all statistics data
  const [dashboardStats, setDashboardStats] =
    useState<DashboardStatsResponse | null>(null);
  const [userStats, setUserStats] = useState<UserStatsResponse | null>(null);
  const [learningStats, setLearningStats] =
    useState<LearningStatsResponse | null>(null);
  const [pronunciationStats, setPronunciationStats] =
    useState<PronunciationStatsResponse | null>(null);
  const [contentStats, setContentStats] = useState<ContentStatsResponse | null>(
    null
  );
  const [trendStats, setTrendStats] = useState<TrendStatsResponse | null>(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [selectedLevel, setSelectedLevel] = useState<number | undefined>(
    undefined
  );
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  // Load all statistics
  const loadAllStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const [dashboard, users, learning, pronunciation, content, trends] =
        await Promise.all([
          adminStatsAPI.getDashboardStats(
            dateRange.startDate,
            dateRange.endDate
          ),
          adminStatsAPI.getUserStats(dateRange.startDate, dateRange.endDate),
          adminStatsAPI.getLearningStats(
            selectedLevel,
            selectedCategory,
            dateRange.startDate,
            dateRange.endDate
          ),
          adminStatsAPI.getPronunciationStats(
            dateRange.startDate,
            dateRange.endDate
          ),
          adminStatsAPI.getContentStats(),
          adminStatsAPI.getTrendStats(30),
        ]);

      setDashboardStats(dashboard);
      setUserStats(users);
      setLearningStats(learning);
      setPronunciationStats(pronunciation);
      setContentStats(content);
      setTrendStats(trends);
    } catch (err: any) {
      console.error("Error loading statistics:", err);
      setError(err.response?.data?.message || "통계 데이터 로딩 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllStats();
  }, []);

  const handleRefresh = () => {
    loadAllStats();
  };

  const handleExport = async (format: "csv" | "json") => {
    try {
      const data = await adminStatsAPI.exportStats("dashboard", format);

      // Create download link
      const blob = new Blob(
        [format === "json" ? JSON.stringify(data, null, 2) : data],
        {
          type: format === "json" ? "application/json" : "text/csv",
        }
      );
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `statistics-${
        new Date().toISOString().split("T")[0]
      }.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Export error:", err);
      alert("엑스포트 실패");
    }
  };

  // Chart colors
  const COLORS = {
    primary: "#10b981",
    secondary: "#fbbf24",
    tertiary: "#3b82f6",
    danger: "#ef4444",
    purple: "#8b5cf6",
    pink: "#ec4899",
  };

  const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.danger];

  if (loading) {
    return (
      <div className="admin-page-container">
        <div className="admin-loading-text">통계 데이터 로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page-container">
        <div className="admin-empty-text">{error}</div>
        <button className="admin-action-button" onClick={handleRefresh}>
          재시도
        </button>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div
        className="admin-page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <button
            className="admin-back-button"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← 뒤로
          </button>
          <h1 className="admin-page-title">📊 통계 현황 대시보드</h1>
        </div>
        <button className="admin-refresh-button" onClick={handleRefresh}>
          🔄 새로고침
        </button>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <div className="admin-filter-group">
          <label className="admin-filter-label">시작일:</label>
          <input
            type="date"
            className="admin-filter-input"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, startDate: e.target.value })
            }
          />
        </div>
        <div className="admin-filter-group">
          <label className="admin-filter-label">종료일:</label>
          <input
            type="date"
            className="admin-filter-input"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, endDate: e.target.value })
            }
          />
        </div>
        <div className="admin-filter-group">
          <label className="admin-filter-label">레벨:</label>
          <select
            className="admin-filter-input"
            value={selectedLevel ?? ""}
            onChange={(e) =>
              setSelectedLevel(
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
          >
            <option value="">전체</option>
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <option key={level} value={level}>
                레벨 {level}
              </option>
            ))}
          </select>
        </div>
        <button className="admin-apply-button" onClick={loadAllStats}>
          적용
        </button>
      </div>

      {/* Overview Cards */}
      {dashboardStats && (
        <div className="admin-overview-grid">
          <StatCard
            title="총 사용자"
            value={dashboardStats.data.overview.totalUsers.toLocaleString()}
            icon="👥"
            color="rgba(16, 185, 129, 0.4)"
          />
          <StatCard
            title="활성 사용자"
            value={dashboardStats.data.overview.activeUsers.toLocaleString()}
            icon="🟢"
            color="rgba(59, 130, 246, 0.4)"
          />
          <StatCard
            title="총 단어"
            value={dashboardStats.data.overview.totalWords.toLocaleString()}
            icon="📚"
            color="rgba(251, 191, 36, 0.4)"
          />
          <StatCard
            title="총 녹음"
            value={dashboardStats.data.overview.totalRecordings.toLocaleString()}
            icon="🎤"
            color="rgba(139, 92, 246, 0.4)"
          />
        </div>
      )}

      {/* User Activity Section */}
      {userStats && (
        <div className="admin-section">
          <h2 className="admin-section-title">📈 사용자 활동 추이</h2>
          <div className="admin-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userStats.data.registrationTrends}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="_id" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  name="가입자 수"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="admin-metrics-grid">
            <MetricTile
              label="7일 활성 사용자"
              value={userStats.data.overview.activeUsers7d.toLocaleString()}
              color="rgba(16, 185, 129, 0.3)"
            />
            <MetricTile
              label="30일 활성 사용자"
              value={userStats.data.overview.activeUsers30d.toLocaleString()}
              color="rgba(59, 130, 246, 0.3)"
            />
            <MetricTile
              label="재방문율"
              value={`${userStats.data.overview.retentionRate}%`}
              color="rgba(251, 191, 36, 0.3)"
            />
          </div>

          {/* Users by Country */}
          <div className="admin-chart-container">
            <h3 className="admin-chart-title">국가별 사용자 분포</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userStats.data.usersByCountry.slice(0, 10)}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="_id" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill={COLORS.primary} name="사용자 수" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Learning Progress Section */}
      {learningStats && (
        <div className="admin-section">
          <h2 className="admin-section-title">📚 학습 진행 현황</h2>

          <div className="admin-metrics-grid">
            <MetricTile
              label="전체 완료율"
              value={`${learningStats.data.overview.completionRate}%`}
              color="rgba(16, 185, 129, 0.3)"
            />
            <MetricTile
              label="평균 점수"
              value={learningStats.data.overview.avgScore.toFixed(0)}
              color="rgba(59, 130, 246, 0.3)"
            />
            <MetricTile
              label="평균 시도 횟수"
              value={learningStats.data.overview.avgAttempts.toFixed(1)}
              color="rgba(251, 191, 36, 0.3)"
            />
            <MetricTile
              label="완료된 단어"
              value={learningStats.data.overview.totalCompleted.toLocaleString()}
              color="rgba(139, 92, 246, 0.3)"
            />
          </div>

          {/* Completion by Level */}
          <div className="admin-chart-container">
            <h3 className="admin-chart-title">레벨별 완료율</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={learningStats.data.completionByLevel}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="level"
                  stroke="rgba(255,255,255,0.7)"
                  tickFormatter={(value) => `Lv${value}`}
                />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: any) => [`${value.toFixed(0)}%`, "완료율"]}
                />
                <Bar
                  dataKey="completionRate"
                  fill={COLORS.secondary}
                  name="완료율 (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Most Practiced Words */}
          {learningStats.data.mostPracticedWords.length > 0 && (
            <div style={styles.wordList}>
              <h3 style={styles.chartTitle}>가장 많이 학습된 단어 TOP 10</h3>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>한국어</th>
                      <th style={styles.th}>몽골어</th>
                      <th style={styles.th}>시도 횟수</th>
                      <th style={styles.th}>평균 점수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {learningStats.data.mostPracticedWords.map((word, idx) => (
                      <tr
                        key={word.wordId}
                        style={idx % 2 === 0 ? styles.trEven : styles.trOdd}
                      >
                        <td style={styles.td}>{word.koreanWord}</td>
                        <td style={styles.td}>{word.mongolianWord}</td>
                        <td style={styles.td}>{word.totalAttempts}</td>
                        <td style={styles.td}>{word.avgScore.toFixed(0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pronunciation Statistics Section */}
      {pronunciationStats && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🎤 발음 평가 통계</h2>

          <div style={styles.metricsGrid}>
            <MetricTile
              label="평균 발음 점수"
              value={pronunciationStats.data.overview.avgPronunciation}
              color="rgba(16, 185, 129, 0.3)"
            />
            <MetricTile
              label="평균 유창성 점수"
              value={pronunciationStats.data.overview.avgFluency}
              color="rgba(59, 130, 246, 0.3)"
            />
            <MetricTile
              label="평균 완성도 점수"
              value={pronunciationStats.data.overview.avgCompleteness}
              color="rgba(251, 191, 36, 0.3)"
            />
            <MetricTile
              label="종합 평균"
              value={pronunciationStats.data.overview.avgOverall}
              color="rgba(139, 92, 246, 0.3)"
            />
          </div>

          {/* Score Distribution */}
          <div style={styles.twoColumnGrid}>
            <div style={styles.chartContainer}>
              <h3 style={styles.chartTitle}>점수 분포</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pronunciationStats.data.scoreDistribution}
                    dataKey="count"
                    nameKey="range"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.range}: ${entry.count}`}
                  >
                    {pronunciationStats.data.scoreDistribution.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Score Trends */}
            <div style={styles.chartContainer}>
              <h3 style={styles.chartTitle}>평균 점수 추이</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={pronunciationStats.data.scoreTrends}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="_id" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="avgScore"
                    stroke={COLORS.tertiary}
                    fill={COLORS.tertiary}
                    fillOpacity={0.6}
                    name="평균 점수"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Storage Info */}
          <div style={styles.metricsGrid}>
            <MetricTile
              label="총 평가 횟수"
              value={pronunciationStats.data.overview.totalEvaluations.toLocaleString()}
              color="rgba(16, 185, 129, 0.3)"
            />
            <MetricTile
              label="총 녹음 수"
              value={pronunciationStats.data.overview.totalRecordings.toLocaleString()}
              color="rgba(59, 130, 246, 0.3)"
            />
            <MetricTile
              label="저장공간 사용"
              value={`${pronunciationStats.data.overview.totalStorageMB} MB`}
              color="rgba(251, 191, 36, 0.3)"
            />
            <MetricTile
              label="평균 녹음 시간"
              value={`${pronunciationStats.data.overview.avgDurationSeconds}초`}
              color="rgba(139, 92, 246, 0.3)"
            />
          </div>
        </div>
      )}

      {/* Content Statistics Section */}
      {contentStats && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📦 컨텐츠 현황</h2>

          <div style={styles.metricsGrid}>
            <MetricTile
              label="총 단어 수"
              value={contentStats.data.overview.totalWords.toLocaleString()}
              color="rgba(16, 185, 129, 0.3)"
            />
            <MetricTile
              label="이미지 있는 단어"
              value={`${contentStats.data.overview.wordsWithImage} (${contentStats.data.overview.imageCompletionRate}%)`}
              color="rgba(59, 130, 246, 0.3)"
            />
            <MetricTile
              label="총 오디오 수"
              value={contentStats.data.overview.totalAudio.toLocaleString()}
              color="rgba(251, 191, 36, 0.3)"
            />
            <MetricTile
              label="오디오 저장공간"
              value={`${contentStats.data.overview.audioStorageMB} MB`}
              color="rgba(139, 92, 246, 0.3)"
            />
          </div>

          {/* Words by Level and Category */}
          <div style={styles.twoColumnGrid}>
            <div style={styles.chartContainer}>
              <h3 style={styles.chartTitle}>레벨별 단어 분포</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={contentStats.data.wordsByLevel}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="_id"
                    stroke="rgba(255,255,255,0.7)"
                    tickFormatter={(value) => `Lv${value}`}
                  />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill={COLORS.primary} name="단어 수" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.chartContainer}>
              <h3 style={styles.chartTitle}>카테고리별 단어 분포</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={contentStats.data.wordsByCategory.slice(0, 10)}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="_id"
                    stroke="rgba(255,255,255,0.7)"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill={COLORS.secondary} name="단어 수" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Export Buttons */}
      <div style={styles.exportBar}>
        <button style={styles.exportButton} onClick={() => handleExport("csv")}>
          📥 CSV 다운로드
        </button>
        <button
          style={styles.exportButton}
          onClick={() => handleExport("json")}
        >
          📥 JSON 다운로드
        </button>
      </div>
    </div>
  );
};


export default AdminStatistics;
