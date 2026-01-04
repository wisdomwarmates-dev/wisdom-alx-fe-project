import { useState } from 'react';
import { mockDestinations } from '../Utils/mockData';
import DestinationCard from './DestinationCard';

function SearchDestinations({ onSelectDestination }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations, setDestinations] = useState(mockDestinations);

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setDestinations(mockDestinations);
      return;
    }

    const filtered = mockDestinations.filter(dest =>
      dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setDestinations(filtered);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search for a destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-secondary text-white px-8 py-3 rounded-lg bg-blue-500 font-semibold"
          >
            Search
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {destinations.length > 0 ? (
          destinations.map(dest => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onSelect={onSelectDestination}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            No destinations found. Try a different search term.
          </p>
        )}
      </div>
    </div>
  );
}

export default SearchDestinations;
