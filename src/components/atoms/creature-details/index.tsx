// src/components/atoms/creature-details/index.tsx
import React, { useEffect, useState } from 'react';
 
interface CreatureDetailProps {
  name?: string;
  id?: string;
  height?: number;
  weight?: number;
  eggGroups?: any;
  genderRate?: number;
}
 
const CreatureDetails: React.FC<CreatureDetailProps> = ({ name, id, height, weight, eggGroups, genderRate }) => {
  const [ftHeight, setFtHeight] = useState('');
  const [adjustedWeight, setAdjustedWeight] = useState(0);
  const [heightcm, setHeightcm] = useState(0);
 
  const eggGroupsArray = Array.isArray(eggGroups) ? eggGroups : [];
  var eggGroupsString = eggGroupsArray.map(item => item.name).join(', ');
 
  const convertHeight = () => {
    let temp = heightcm;
    temp *= 10;
    temp *= 0.0328084;
    let ft = Math.floor(temp);
    let inches = Math.round((temp - ft) * 12);
    setFtHeight(`${ft}'${inches}"`);
  }
 
  useEffect(() => {
    setHeightcm(height || 0);
  }, [height]);

  useEffect(() => {
    convertHeight();
  }, [heightcm]);
 
  useEffect(() => {
    setAdjustedWeight(weight ? weight / 10 : 0);
  }, [weight]);

  const getGenderString = () => {
    if (genderRate === -1) return 'Genderless';
    if (genderRate === undefined) return 'Unknown';
    
    const femalePercentage = (genderRate / 8) * 100;
    
    if (femalePercentage === 0) return 'Male';
    if (femalePercentage === 100) return 'Female';
    return 'Male, Female';
  }
 
  return (
    <div className="p-6 ">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <h2 className="text-lg font-semibold">Height</h2>
          <p className="text-gray-700">{ftHeight}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Weight</h2>
          <p className="text-gray-700">{adjustedWeight.toFixed(1)} Kg</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Gender(s)</h2>
          <p className="text-gray-700">{getGenderString()}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Egg Groups</h2>
          <p className="text-gray-700">{eggGroupsString}</p>
        </div>
      </div>
    </div>
  );
};
 
export default CreatureDetails;