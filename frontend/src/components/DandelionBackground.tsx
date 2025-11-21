import { useEffect, useState } from "react";
import "./DandelionBackground.css";

interface Seed {
  id: number;
  left: string;
  bottom: string;
  delay: string;
}

const DandelionBackground = () => {
  const [seeds, setSeeds] = useState<Seed[]>([]);

  useEffect(() => {
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
      {/* Dandelion Flower SVG - Fixed position */}
      <div className="dandelion-flower">
        <svg viewBox="0 0 180 200" width="180" height="200">
          {/* Yellow dandelion flower */}
          <circle cx="90" cy="150" r="38" fill="yellow" opacity="0.88" />
          <circle cx="90" cy="150" r="26" fill="#ffeb66" opacity="0.9" />
          <circle cx="90" cy="150" r="14" fill="#fff7b3" />

          {/* White seed head */}
          <circle cx="90" cy="90" r="45" fill="white" opacity="0.85" />

          {/* Stem */}
          <line
            x1="90"
            y1="135"
            x2="90"
            y2="200"
            stroke="white"
            strokeWidth="6"
          />
        </svg>
      </div>

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
        />
      ))}
    </div>
  );
};

export default DandelionBackground;
