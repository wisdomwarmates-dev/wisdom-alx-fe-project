import { useState } from 'react';
import Navbar from './components/Navbar';
import SearchDestinations from './components/SearchDestinations';
import DestinationDetails from './components/DestinationDetails';
import TripItinerary from './components/TripItinerary';

function App() {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [tripItems, setTripItems] = useState([]);
  const [showItinerary, setShowItinerary] = useState(false);

  
  const handleCloseDetails = () => {
    setSelectedDestination(null);
  };


  const handleAddToTrip = (item) => {
  
    const exists = tripItems.find(
      tripItem => tripItem.id === item.id && tripItem.type === item.type
    );
    
    if (exists) {
      alert('This item is already in your trip!');
      return;
    }

    setTripItems([...tripItems, item]);
    alert(`Added ${item.name} to your trip!`);
  };

  
  const handleRemoveFromTrip = (itemId) => {
    setTripItems(tripItems.filter(item => item.id !== itemId));
  };

  
  const toggleItinerary = () => {
    setShowItinerary(!showItinerary);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        tripItemsCount={tripItems.length} 
        onViewItinerary={toggleItinerary} 
      />
      
      <div className="container mx-auto px-4 py-8">
        {showItinerary ? (
          
          <div className="max-w-4xl mx-auto">
            <TripItinerary
              tripItems={tripItems}
              onRemoveItem={handleRemoveFromTrip}
              onClose={toggleItinerary}
            />
          </div>
        ) : !selectedDestination ? (
      
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Search Destinations
            </h2>
            <SearchDestinations onSelectDestination={setSelectedDestination} />
          </div>
        ) : (
        
          <div className="max-w-6xl mx-auto">
            <DestinationDetails
              destination={selectedDestination}
              onClose={handleCloseDetails}
              onAddToTrip={handleAddToTrip}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
