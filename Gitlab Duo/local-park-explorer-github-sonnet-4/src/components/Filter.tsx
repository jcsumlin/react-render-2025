import React from 'react';

interface FilterProps {
  amenities: string[];
  selectedAmenities: string[];
  onChange: (selected: string[]) => void;
}

const Filter: React.FC<FilterProps> = ({ amenities, selectedAmenities, onChange }) => {
  const handleCheckboxChange = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      onChange(selectedAmenities.filter(a => a !== amenity));
    } else {
      onChange([...selectedAmenities, amenity]);
    }
  };

  return (
    <div>
      <h3>Filter by Amenities</h3>
      {amenities.map(amenity => (
        <div key={amenity}>
          <label>
            <input
              type="checkbox"
              checked={selectedAmenities.includes(amenity)}
              onChange={() => handleCheckboxChange(amenity)}
            />
            {amenity}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Filter;