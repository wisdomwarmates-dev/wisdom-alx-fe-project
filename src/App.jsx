import { useState } from 'react';
import Navbar from './components/NavBar';  // ✅ Fixed: added 's'
import SearchDestinations from './components/SearchDestinations';  // ✅ Fixed: added 's'

const testKey = import.meta.env.VITE_AMADEUS_API_KEY || 'HARDCODED_FALLBACK';
const testWeather = import.meta.env.VITE_WEATHER_API_KEY || 'HARDCODED_WEATHER';


console.log('Testing API Keys:');
console.log('Amadeus Key:', import.meta.env.VITE_AMADEUS_API_KEY);
console.log('Weather Key:', import.meta.env.VITE_WEATHER_API_KEY);

function App() {
  const [selectedDestination, setSelectedDestination] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Search Destinations
          </h2>
          <SearchDestinations onSelectDestination={setSelectedDestination} />

          {selectedDestination && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <p className="text-lg">
                You selected: <strong>{selectedDestination.city}, {selectedDestination.country}</strong>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                (We'll build the details view next!)
              </p>
            </div>
          )}         
        </div>
      </div>
    </div>
  );
}

export default App;
