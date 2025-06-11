import React from 'react';
import { Park } from '../types/park';

interface ParkListProps {
  parks: Park[];
  onSelectPark: (park: Park) => void;
}

const ParkList: React.FC<ParkListProps> = ({ parks, onSelectPark }) => {
  return (
    <div>
      <h2>Parks in Atlanta</h2>
      <ul>
        {parks.map((park) => (
          <li key={park.name} onClick={() => onSelectPark(park)}>
            <h3>{park.name}</h3>
            <p>Amenities: {park.amenities.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParkList;