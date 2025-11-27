import React from "react";

const stories = [
  {
    id: 1,
    title: "나무꾼과 선녀",
    description: "착한 나무꾼과 하늘에서 내려온 선녀의 만남과 이별 이야기.",
  },
  {
    id: 2,
    title: "토끼와 거북이",
    description: "경주에서 거북이가 토끼를 이기는 교훈적인 이야기.",
  },
];

interface StoryListProps {
  onSelect: (storyId: number) => void;
  selectedId?: number;
}

const StoryList: React.FC<StoryListProps> = ({ onSelect, selectedId }) => {
  return (
    <div className="story-list-container" style={{ padding: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        이야기 목록
      </h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {stories.map((story) => (
          <li
            key={story.id}
            onClick={() => onSelect(story.id)}
            style={{
              marginBottom: 18,
              padding: 14,
              border:
                selectedId === story.id
                  ? "2px solid #1a7ec7"
                  : "1px solid #e0e0e0",
              borderRadius: 10,
              background: selectedId === story.id ? "#e3f2fd" : "#f8fafc",
              cursor: "pointer",
              transition: "background 0.2s, border 0.2s",
            }}
            className="story-list-item"
          >
            <div style={{ fontWeight: 600, fontSize: 17 }}>{story.title}</div>
            <div style={{ color: "#666", fontSize: 14, marginTop: 4 }}>
              {story.description}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryList;
