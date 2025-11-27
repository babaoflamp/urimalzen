import { useEffect, useState } from "react";
import "./DandelionBackground.css";

interface Seed {
  id: number;
  left: string;
  bottom: string;
  delay: string;
  char: string;
}

const DandelionBackground = () => {
  const [seeds, setSeeds] = useState<Seed[]>([]);

  useEffect(() => {
    // 한글 자음 리스트
    const consonants = [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄹ",
      "ㅁ",
      "ㅂ",
      "ㅅ",
      "ㅇ",
      "ㅈ",
      "ㅊ",
      "ㅋ",
      "ㅌ",
      "ㅍ",
      "ㅎ",
    ];
    // Generate random seeds
    const generateSeeds = () => {
      const newSeeds: Seed[] = [];
      const seedCount = 20; // Number of seeds

      for (let i = 0; i < seedCount; i++) {
        newSeeds.push({
          id: i,
          left: `${Math.random() * 100}%`,
          bottom: `${Math.random() * 30 + 10}%`,
          delay: `${Math.random() * 5}s`,
          char: consonants[Math.floor(Math.random() * consonants.length)],
        });
      }
      setSeeds(newSeeds);
    };

    generateSeeds();

    // Regenerate seeds every 7 seconds (animation duration)
    const interval = setInterval(generateSeeds, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dandelion-background">
      {/* Floating Seeds */}
      {seeds.map((seed) => (
        <div
          key={seed.id}
          className="dandelion-seed"
          style={{
            left: seed.left,
            bottom: seed.bottom,
            animationDelay: seed.delay,
          }}
        >
          <span className="dandelion-consonant">{seed.char}</span>
        </div>
      ))}
    </div>
  );
};

export default DandelionBackground;
