import { useState } from 'react'

function TripItinerary ({ tripItems, onRemoveItems, onClose }) {

    const totalCost = tripItems.reduce((sum, item) => sum + item.price, 0);
    const flights = tripItems.filter(item => item.type === 'flight');
    const hotels = tripItems.filter(item => item.type === 'hotel');
    const activities = tripItems.filter(item => item.type === 'activity');

    return (
        <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex justify-between items-center mb-6 pb-4 border'>
                <div>
                    <h2 className='text-3xl font-bold text-gray-800'>My Trip Itinerary</h2>
                    <p className='text-gray-600 mt-1'>Plan your perfect journey</p>
                </div>
                <button onClick={onClose}
                className='text-gray-500 text-2x'> x </button>
            </div>

            {tripItems.length === 0 ? (
                <div className='text-center py-12'>
                    <div className='text-6xl mb-4'>🫙</div>
                    <h3 className='text-xl font-semibold text-gray-700 mb-2'>Your itinerary is empty</h3>
                    <p className='text-gray-500'>
                        start adding flights, hotels, and activities to plan your trip!
                    </p>
                    </div>
            ) : (
                <div className='space-y-6'>
            {flights.length > 0 && (
                <ItinerarySection
                title='Flights'
                icon='✈️'
                items={flights}
                onRemove={onRemoveItems} />
            )}

            {hotels.length > 0 && (
                <ItinerarySection
                title='Hotels'
                icon='🏠'
                items={hotels}
                onRemove={onRemoveItems} />
            )}

            {activities.length > 0 && (
                <ItinerarySelection
                title='Activities'
                icon='🍭'
                items={activities}
                onRemove={onRemoveItems} />
            )}

            <div className='mt-8 pt-6 border-t-2 border-grey-200'>
                <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <p className='text-blue-100 text-sm'>Total Trip Cost</p>
                            <p className='text-4xl font-bold'>${totalCost}</p>
                        </div>
                        <div className='text-right'>
                            <p className='text-blue-100 text-sm'>Total Items</p>
                            <p className='text-3xl font-bold'>{tripItems.length}</p>
                        </div>
                    </div>
                    <button className='w-full mt-4 bg-white text-blue-600 py-3 rounded-lg font-semibold transition'>
                        Proceed to Booking
                    </button>
                    </div>
                </div>
                </div> 

            )}
            </div>
        
    );
};

function ItinerarySection ({ title, icon, items, onRemove }) {
    return (
        <div>
            <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center'>
                <span className='text-2xl mr-2'>{icon}</span>
                {title}
            </h3>
            <div className='space-y-3'>
                {items.map((item) => (
                    <ItineraryItem
                    key={item.id}
                    item={item}
                    onRemove={onRemove} />
                ))}
            </div>
        </div>
    )
}

function ItineraryItem({ item, onRemove}) {
    return (
        <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg border-gray-200'>
            <div className='flex-1'>
                <p className='font-semibold text-gray-800'>{item.name}</p>
                {item.details && (
                    <p className='text-sm text-gray-600 mt-1'>{item.details}</p>
                )}
                {item.date && ((
                    <p className='text-xs text-gray-500 mt-1'>📅{item.date}</p>
                ))}
            </div>
            <div className='flex items-center space-x-4'>
                <span className='font-bold text-blue-600 text-lg'>${item.price}</span>
                <button onClick={() => (item.id)}
                    className='text-red-500 text-red-700 bg-red-50 p-2 rounded transition'
                    title='Remove from trip'>🗑️</button>
                
            </div>
        </div>
    )
};

export default TripItinerary;
