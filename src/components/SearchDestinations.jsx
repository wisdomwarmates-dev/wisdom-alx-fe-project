import { useState } from 'react';
import { searchCities } from '../services/amadeusAPI';
import { mockDestinations } from '../utils/mockData';
import DestinationCard from './DestinationCard';

function SearchDestinations({ onSelectDestination }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations, setDestinations] = useState(mockDestinations);
  const [searching, setSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    
    if (searchQuery.trim() === '') {
      setDestinations(mockDestinations);
      setSearchPerformed(false);
      return;
    }

    try {
      setSearching(true);
      setSearchPerformed(true);

      console.log(`🔍 Searching for cities: "${searchQuery}"`);

      const results = await searchCities(searchQuery);

      if (results.length === 0) {
        console.log('⚠️ No cities found, showing default destinations');
        setDestinations(mockDestinations);
      } else {
        console.log(`✅ Found ${results.length} cities`);
        setDestinations(results);
      }
    } catch (error) {
      console.error('❌ Search error:', error);
      
      setDestinations(mockDestinations);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  
  const handleClearSearch = () => {
    setSearchQuery('');
    setDestinations(mockDestinations);
    setSearchPerformed(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
  
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for a destination... (e.g., London, Tokyo, Dubai)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={searching}
            />
            
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={searching}
            className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {searching ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : (
              'Search'
            )}
          </button>
        </div>

        
        <p className="text-xs text-gray-500 mt-2">
          💡 Try searching for cities like "London", "Dubai", "Singapore", "New York", or "Barcelona"
        </p>
      </div>

      
      {searchPerformed && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            {destinations.length > 0 ? (
              <>
                ✅ Found {destinations.length} destination{destinations.length > 1 ? 's' : ''} for "{searchQuery}"
              </>
            ) : (
              <>
                ❌ No destinations found for "{searchQuery}". Showing default destinations.
              </>
            )}
          </p>
        </div>
      )}

      
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
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌍</div>
            <p className="text-gray-600 font-semibold">No destinations found</p>
            <p className="text-sm text-gray-500 mt-2">
              Try searching for a different city
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchDestinations;
