import React from 'react';

interface TypesProps {
  name?: string;
  id?: number;
  types?: { type: { name: string } }[];
  abilities?: { ability: { name: string } }[];
}

const CreatureInfo: React.FC<TypesProps> = ({ name, id, types, abilities }) => {
  const capitalizeEachWord = (str: string) => {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  };

  const abilitiesString = abilities?.map(item => capitalizeEachWord(item.ability.name)).join(', ') || '';

  const calculateWeaknesses = (types: { type: { name: string } }[]): string[] => {
    // ... (keep the existing weakness calculation logic)
    const typeWeaknesses: { [key: string]: string[] } = {
      normal: ['fighting'],
      fire: ['water', 'ground', 'rock'],
      water: ['electric', 'grass'],
      electric: ['ground'],
      grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
      ice: ['fire', 'fighting', 'rock', 'steel'],
      fighting: ['flying', 'psychic', 'fairy'],
      poison: ['ground', 'psychic'],
      ground: ['water', 'grass', 'ice'],
      flying: ['electric', 'ice', 'rock'],
      psychic: ['bug', 'ghost', 'dark'],
      bug: ['flying', 'rock', 'fire'],
      rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
      ghost: ['ghost', 'dark'],
      dragon: ['ice', 'dragon', 'fairy'],
      dark: ['fighting', 'bug', 'fairy'],
      steel: ['fire', 'fighting', 'ground'],
      fairy: ['poison', 'steel'],
    };

    const weaknesses = new Set<string>();
    types.forEach(typeObj => {
      const typeName = typeObj.type.name.toLowerCase();
      typeWeaknesses[typeName]?.forEach(weakness => weaknesses.add(weakness));
    });

    return Array.from(weaknesses);
  };

  const weaknesses = calculateWeaknesses(types || []);

  const badgeClass = "px-2 py-1 rounded-md mr-2 mb-2 capitalize border border-black";

  return (
    <div className="p-6 mt-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <h2 className="text-lg font-semibold">Abilities</h2>
          <p className="text-gray-700">{abilitiesString}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Types</h2>
          <div className="flex items-center">
            {types?.map((item, index) => (
              <span 
                key={index} 
                className={`bg-${item.type.name.toLowerCase()} text-maintext ${badgeClass}`}
              >
                {item.type.name}
              </span>
            ))}
          </div>
        </div>
        <div className="col-span-2 md:col-span-1">
          <h2 className="text-lg font-semibold">Weak Against</h2>
          <div className="flex flex-wrap items-center w-full">
            {weaknesses.map((weakness, index) => (
              <span 
                key={index} 
                className={`bg-${weakness.toLowerCase()} text-maintext ${badgeClass}`}
              >
                {weakness}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatureInfo;