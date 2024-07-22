// src/components/atoms/modal-stats/index.tsx
import React from 'react';

interface StatsProps {
  data: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
}

const Stats: React.FC<StatsProps> = ({ data }) => {
  const maxStat = 110; // Maximum stat value for scaling

  const getStatName = (name: string): string => {
    switch (name) {
      case 'hp': return 'HP';
      case 'attack': return 'Attack';
      case 'defense': return 'Defense';
      case 'special-attack': return 'Sp. Attack';
      case 'special-defense': return 'Sp. Def.';
      case 'speed': return 'Speed';
      default: return name;
    }
  };

  return (
    <div className="p-4 bg-secondbg rounded-lg">
      <h2 className="text-lg font-bold mb-4">Stats</h2>
      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="w-24 text-sm">{getStatName(item.stat.name)}</span>
            <div className="flex-grow bg-[#e0f1f1] h-5 rounded-full overflow-hidden">
              <div
                className="bg-statsbar h-full rounded-full text-xs text-white flex items-center justify-end pr-2"
                style={{ width: `${(item.base_stat / maxStat) * 100}%` }}
              >
                {item.base_stat}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;