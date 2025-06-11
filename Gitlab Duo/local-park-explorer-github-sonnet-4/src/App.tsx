import React from 'react';
import Map from './components/Map';
import ParkList from './components/ParkList';
import SearchBar from './components/SearchBar';
import Filter from './components/Filter';
import { useParks } from './hooks/useParks';

const App: React.FC = () => {
  const { parks, searchTerm, setSearchTerm, filteredParks, amenities, setAmenities } = useParks();

  return (
    <div className="app">
      <h1>Local Park Explorer</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Filter amenities={amenities} setAmenities={setAmenities} />
      <Map parks={filteredParks} />
      <ParkList parks={filteredParks} />
    </div>
  );
};

export default App;