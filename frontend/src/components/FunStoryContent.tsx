import React from "react";

const funStories = [
  {
    id: 1,
    title: "금도끼 은도끼",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/Korean_fairy_tale_gold_axe.png",
    summary:
      "나무꾼은 연못에 빠트린 도끼를 돌려 받는다. 산신령님은 정직한 나무꾼에게 금도끼와 은도끼를 모두 준다. 정직함이 보상을 받는다는 교훈을 준다.",
  },
  {
    id: 2,
    title: "토끼와 거북이",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2c/Tortoise_and_the_Hare_Korea.png",
    summary:
      "토끼는 느린 거북이를 얕보고 경주를 제안합니다. 거북이는 포기하지 않고 천천히 끝까지 달립니다. 결국 자만한 토끼는 잠들고, 거북이가 승리합니다.",
  },
];

const FunStoryContent: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 style={{ textAlign: "center", color: "#1a7ec7" }}>재미있는 이야기</h2>
      <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
        {funStories.map((story) => (
          <div
            key={story.id}
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              width: 260,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={story.image}
              alt={story.title}
              style={{
                width: 180,
                height: 120,
                objectFit: "cover",
                borderRadius: 12,
                marginBottom: 12,
              }}
            />
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
              {story.title}
            </div>
            <div style={{ fontSize: 15, color: "#444", textAlign: "center" }}>
              {story.summary}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunStoryContent;
