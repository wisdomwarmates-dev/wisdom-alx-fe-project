import axios from 'axios';

const API_KEY = import.meta.env.VITE_AMADEUS_API_KEY;
const API_SECRET = import.meta.env.VITE_AMADEUS_API_SECRET;
const BASE_URL = 'https://test.api.amadeus.com/v1';


let accessToken = null;
let tokenExpiry = null;


const getAccessToken = async () => {
  
  if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
    return accessToken;
  }

  try {
    console.log('🔑 Getting new Amadeus access token...');
    
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: API_KEY,
        client_secret: API_SECRET
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    accessToken = response.data.access_token;
    
    tokenExpiry = new Date(Date.now() + (response.data.expires_in - 300) * 1000);
    
    console.log('✅ Access token obtained successfully');
    return accessToken;
  } catch (error) {
    console.error('❌ Error getting access token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Amadeus API');
  }
};

export const searchCities = async (keyword) => {
  try {
    const token = await getAccessToken();

    const response = await axios.get(
      `${BASE_URL}/reference-data/locations/cities`,
      {
        params: {
          keyword: keyword,
          max: 10,
          include: 'AIRPORTS'
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    
    return response.data.data.map(city => ({
      id: city.id,
      city: city.name,
      country: city.address.countryName,
      cityCode: city.iataCode,
      
      image: `https://source.unsplash.com/800x600/?${city.name},city`,
      attractions: [], 
      description: `Explore ${city.name}, ${city.address.countryName}`
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};


export const searchFlights = async (origin, destination, departureDate, adults = 1) => {
  try {
    const token = await getAccessToken();

    const response = await axios.get(
      `${BASE_URL}/shopping/flight-offers`,
      {
        params: {
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate: departureDate,
          adults: adults,
          max: 5,
          currencyCode: 'USD'
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    
    return response.data.data.map((offer, index) => {
      const segment = offer.itineraries[0].segments[0];
      return {
        id: `flight-${offer.id}-${index}`,
        airline: segment.carrierCode,
        price: Math.round(parseFloat(offer.price.total)),
        departure: segment.departure.iataCode,
        arrival: segment.arrival.iataCode,
        duration: offer.itineraries[0].duration.replace('PT', '').toLowerCase()
      };
    });
  } catch (error) {
    console.error('Error searching flights:', error.response?.data || error.message);
    
    return [];
  }
};

export const searchHotels = async (cityCode) => {
  try {
    const token = await getAccessToken();

    
    const hotelListResponse = await axios.get(
      `${BASE_URL}/reference-data/locations/hotels/by-city`,
      {
        params: {
          cityCode: cityCode,
          radius: 5,
          radiusUnit: 'KM',
          hotelSource: 'ALL'
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!hotelListResponse.data.data || hotelListResponse.data.data.length === 0) {
      console.log('No hotels found for city:', cityCode);
      return [];
    }

    
    const hotelIds = hotelListResponse.data.data
      .slice(0, 5)
      .map(hotel => hotel.hotelId)
      .join(',');

    
    const offersResponse = await axios.get(
      `${BASE_URL}/shopping/hotel-offers`,
      {
        params: {
          hotelIds: hotelIds,
          adults: 1,
          checkInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          checkOutDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    
    return offersResponse.data.data.map((hotelData, index) => ({
      id: `hotel-${hotelData.hotel.hotelId}-${index}`,
      name: hotelData.hotel.name,
      price: Math.round(parseFloat(hotelData.offers[0].price.total)),
      rating: hotelData.hotel.rating || 4.0
    }));
  } catch (error) {
    console.error('Error searching hotels:', error.response?.data || error.message);
    return [];
  }
};
