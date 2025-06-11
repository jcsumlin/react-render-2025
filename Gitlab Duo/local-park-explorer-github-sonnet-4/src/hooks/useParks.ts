import { useEffect, useState } from 'react';
import { Park } from '../types/park';

const useParks = () => {
    const [parks, setParks] = useState<Park[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredParks, setFilteredParks] = useState<Park[]>([]);

    useEffect(() => {
        const fetchParks = async () => {
            const response = await fetch('/parks.json');
            const data: Park[] = await response.json();
            setParks(data);
        };

        fetchParks();
    }, []);

    useEffect(() => {
        const results = parks.filter(park =>
            park.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredParks(results);
    }, [searchTerm, parks]);

    const filterByAmenity = (amenity: string) => {
        const results = parks.filter(park => park.amenities.includes(amenity));
        setFilteredParks(results);
    };

    return { parks: filteredParks, searchTerm, setSearchTerm, filterByAmenity };
};

export default useParks;