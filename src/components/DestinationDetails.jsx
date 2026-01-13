import { useState, useEffect } from 'react';
import { getCurrentWeather, getWeatherForecast } from '../services/weatherAPI';
import { searchFlights, searchHotels } from '../services/amadeusAPI';

function DestinationDetails({ destination, onClose, onAddToTrip }) {
  const [activeTab, setActiveTab] = useState('attractions');

  if (!destination) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      
      <div className="bg-primary text-white p-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold">
          {destination.city}, {destination.country}
        </h2>
        <button
          onClick={onClose}
          className="text-white hover:bg-blue-600 px-4 py-2 rounded transition"
        >
          ✕ Close
        </button>
      </div>

      
      <div className="relative h-64 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.city}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 px-6">
          <TabButton
            isActive={activeTab === 'attractions'}
            onClick={() => setActiveTab('attractions')}
          >
            Attractions
          </TabButton>
          <TabButton
            isActive={activeTab === 'flights'}
            onClick={() => setActiveTab('flights')}
          >
            Flights
          </TabButton>
          <TabButton
            isActive={activeTab === 'hotels'}
            onClick={() => setActiveTab('hotels')}
          >
            Hotels
          </TabButton>
          <TabButton
            isActive={activeTab === 'weather'}
            onClick={() => setActiveTab('weather')}
          >
            Weather
          </TabButton>
        </div>
      </div>

      
      <div className="p-6">
        {activeTab === 'attractions' && (
          <AttractionsTab destination={destination} />
        )}
        {activeTab === 'flights' && (
          <FlightsTab destination={destination} onAddToTrip={onAddToTrip} />
        )}
        {activeTab === 'hotels' && (
          <HotelsTab destination={destination} onAddToTrip={onAddToTrip} />
        )}
        {activeTab === 'weather' && (
          <WeatherTab destination={destination} />
        )}
      </div>
    </div>
  );
}


function TabButton({ isActive, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`
        py-4 px-2 border-b-2 font-semibold transition
        ${isActive 
          ? 'border-blue-500 text-blue-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700'
        }
      `}
    >
      {children}
    </button>
  );
}


function AttractionsTab({ destination }) {
  const attractions = destination.attractions || [];
  
  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Top Attractions
      </h3>
      
      {attractions.length > 0 ? (
        <ul className="space-y-3">
          {attractions.map((attraction, index) => (
            <li
              key={index}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-2xl">📍</span>
              <span className="text-lg text-gray-700">{attraction}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No attractions listed for this destination.</p>
      )}
      
      <p className="mt-6 text-gray-600">
        {destination.description || 'Explore the beauty and culture of this amazing destination!'}
      </p>
    </div>
  );
}

function FlightsTab({ destination, onAddToTrip }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);
        setUsingMockData(false);

        
        const airportMap = {
          'Paris': 'CDG',
          'Kyoto': 'KIX',
          'New York': 'JFK',
          'London': 'LHR',
          'Tokyo': 'NRT',
          'Dubai': 'DXB',
          'Singapore': 'SIN'
        };

        const destCode = airportMap[destination.city] || 
                        destination.cityCode || 
                        destination.city.substring(0, 3).toUpperCase();
        
        console.log(`🔍 Searching: LHR → ${destCode}`);
        
        const flightData = await searchFlights('LHR', destCode);
        
        if (flightData.length === 0) {
          console.log('⚠️ Using example data');
          setUsingMockData(true);
          setFlights([
            {
              id: 'example-1',
              airline: 'British Airways',
              price: 350,
              departure: 'LHR',
              arrival: destCode,
              duration: '2h 15m',
              departureTime: '09:30 AM',
              arrivalTime: '12:45 PM'
            },
            {
              id: 'example-2',
              airline: 'Air France',
              price: 420,
              departure: 'LHR',
              arrival: destCode,
              duration: '2h 30m',
              departureTime: '11:00 AM',
              arrivalTime: '02:30 PM'
            }
          ]);
        } else {
          setFlights(flightData);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Unable to load flights');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [destination]);

  const handleAddFlight = (flight) => {
    if (onAddToTrip) {
      onAddToTrip({
        ...flight,
        type: 'flight',
        name: `${flight.airline} - ${flight.departure} to ${flight.arrival}`,
        details: `${flight.departureTime} - ${flight.arrivalTime} • ${flight.duration}`,
        date: 'Departure in 7 days'
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✈️</div>
        <p className="text-gray-600">Searching for flights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✈️</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Flights to {destination.city}
      </h3>
      
      {usingMockData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">
            ℹ️ Example data shown. Amadeus test API has limited routes.
          </p>
        </div>
      )}
      
      <p className="text-sm text-gray-600 mb-4">
        Departing in 7 days from London (LHR)
      </p>
      
      <div className="space-y-4">
        {flights.map((flight) => (
          <div
            key={flight.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">✈️</div>
              <div>
                <p className="font-semibold text-gray-800">{flight.airline}</p>
                <p className="text-sm text-gray-500">
                  {flight.departure} → {flight.arrival}
                </p>
                <p className="text-xs text-gray-500">
                  {flight.departureTime} - {flight.arrivalTime} • {flight.duration}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded font-semibold">
                ${flight.price}
              </span>
              <button
                onClick={() => handleAddFlight(flight)}
                className="bg-secondary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Add to Trip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HotelsTab({ destination, onAddToTrip }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        setUsingMockData(false);

        
        const cityCodeMap = {
          'Paris': 'PAR',
          'Kyoto': 'OSA',      
          'New York': 'NYC',
          'London': 'LON',
          'Tokyo': 'TYO',
          'Dubai': 'DXB',
          'Singapore': 'SIN',
          'Los Angeles': 'LAX',
          'Madrid': 'MAD',
          'Barcelona': 'BCN',
          'Rome': 'ROM',
          'Amsterdam': 'AMS'
        };

        const cityCode = cityCodeMap[destination.city] || 
                        destination.cityCode || 
                        destination.city.substring(0, 3).toUpperCase();
        
        console.log(`🔍 Searching hotels in ${cityCode} (${destination.city})`);
        
        const hotelData = await searchHotels(cityCode);
        
        
        if (hotelData.length === 0) {
          console.log('⚠️ No real hotels found, using example data');
          setUsingMockData(true);
          

          const today = new Date();
          const checkIn = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];
          const checkOut = new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];
          
          setHotels([
            {
              id: 'example-hotel-1',
              name: `Hotel Le ${destination.city}`,
              price: 120,
              currency: 'USD',
              rating: 4.5,
              checkIn: checkIn,
              checkOut: checkOut
            },
            {
              id: 'example-hotel-2',
              name: `Grand ${destination.city} Hotel`,
              price: 175,
              currency: 'USD',
              rating: 4.8,
              checkIn: checkIn,
              checkOut: checkOut
            },
            {
              id: 'example-hotel-3',
              name: `${destination.city} Plaza`,
              price: 95,
              currency: 'USD',
              rating: 4.2,
              checkIn: checkIn,
              checkOut: checkOut
            }
          ]);
        } else {
          setHotels(hotelData);
        }
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError('Unable to load hotel data');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destination]);

  const handleAddHotel = (hotel) => {
    if (onAddToTrip) {
      onAddToTrip({
        ...hotel,
        type: 'hotel',
        details: `⭐ ${hotel.rating.toFixed(1)} / 5 • Check-in: ${hotel.checkIn}`,
        date: `Check-in: ${hotel.checkIn}`
      });
    }
  };

  
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏨</div>
        <p className="text-gray-600">Searching for hotels...</p>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏨</div>
        <p className="text-gray-600">{error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Please try again later
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Hotels in {destination.city}
      </h3>
      
      
      {usingMockData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">
            ℹ️ Showing example hotel data. The Amadeus test API has limited coverage.
          </p>
        </div>
      )}
      
      <p className="text-sm text-gray-600 mb-4">
        Showing hotels for 1 night, check-in 7 days from now
      </p>
      
      <div className="space-y-4">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">🏨</div>
              <div>
                <p className="font-semibold text-gray-800">{hotel.name}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm text-gray-600">
                    {hotel.rating.toFixed(1)} / 5
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {hotel.checkIn} to {hotel.checkOut}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded font-semibold">
                  ${hotel.price}
                </span>
                <p className="text-xs text-gray-500 mt-1">per night</p>
              </div>
              <button
                onClick={() => handleAddHotel(hotel)}
                className="bg-secondary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Add to Trip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeatherTab({ destination }) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        
        const [currentWeather, forecastData] = await Promise.all([
          getCurrentWeather(destination.city),
          getWeatherForecast(destination.city)
        ]);

        setWeather(currentWeather);
        setForecast(forecastData);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Unable to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [destination.city]);

  
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🌤️</div>
        <p className="text-gray-600">Loading weather data...</p>
      </div>
    );
  }

  
  if (error || !weather) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-gray-600">{error || 'Unable to load weather'}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Weather in {destination.city}
      </h3>
      
      
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-5xl font-bold">{weather.temp}°C</p>
            <p className="text-xl mt-2 capitalize">{weather.description}</p>
          </div>
          <div className="text-6xl">
            {getWeatherEmojiFromCondition(weather.condition)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-blue-300">
          <div>
            <p className="text-blue-100 text-sm">Humidity</p>
            <p className="text-xl font-semibold">{weather.humidity}%</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Wind Speed</p>
            <p className="text-xl font-semibold">{weather.windSpeed} km/h</p>
          </div>
        </div>
      </div>

      
      <h4 className="text-lg font-semibold text-gray-700 mb-3">5-Day Forecast</h4>
      <div className="grid grid-cols-5 gap-3">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="bg-gray-50 p-3 rounded-lg text-center"
          >
            <p className="font-semibold text-gray-700">{day.day}</p>
            <p className="text-3xl my-2">{day.condition}</p>
            <p className="text-sm text-gray-600">{day.high}° / {day.low}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getWeatherEmojiFromCondition(condition) {
  const emojiMap = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '🌨️',
    'Mist': '🌫️',
    'Fog': '🌫️'
  };
  return emojiMap[condition] || '⛅';
}

export default DestinationDetails;
    