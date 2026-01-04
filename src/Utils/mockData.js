export const mockDestinations = [{
    id: 1,
    city: 'paris',
    country: "France", 
    image:'https://share.google/SvdorSYQcLhfIWYfy',
    attraction: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame'],
    description: 'the City of Light'

},
{
    id:2,
    city:"Kyoto",
    country:"Japan",
    image: 'https://share.google/Rzt3cpSre3tQlAUtO',
    attraction: ['Fushimi Inari Shrine', 'Kiyomizu Temple', 'Arashiyama'],
    description:'Ancient temples and gardens'
},
{
    id: 3,
    city:'New York',
    country:'USA',
    image:'https://share.google/9OyiUcnhFXGrk62C3',
    attraction: ['Statue of Liberty', 'Central Park', 'Times Square'],
    description: 'The city that never sleeps'
}
];

export const mockFlight = [{
    id:1,
    airline: 'British Airways',
    price:350,
    departure: 'LHR',
    arrival: 'CDG'
},
{ 
    id:2,
    airline:'Air France',
    price: 420,
    departure: 'LHR',
    arrival: "CDG"

}
];

export const mockHotels = [{
    id: 1,
    name: 'Hotel Le Marais',
    Price: 120,
    rating: 4.5
},
{
    id: 2,
    name: 'Grand Paris Hotel',
    price: 175,
    rating: 4.8
}];

export const mockWeather = [{
    temp: 23,
    condition: 'Partly Cloudy',
    forecast: [{ day: 'Tue', high: 24, low: 16},{day: 'wed', high: 22, low: 15}]

}];
