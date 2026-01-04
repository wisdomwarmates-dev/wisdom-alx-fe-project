function DestinationCard ({ destination, onSelect }) {
    return (
        <div onClick={() => onSelect(destination)}
        className='flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer'>
            
            <img
            src={destination.image}
            alt={destination.city}
            className='w-32 h-24 object-cover rounded' />

                <div className='flex-1'>
                    <h3 className="text-xl font-bold text-gray-800">{destination.city},{destination.country}</h3>
                <p className='text-sm text-blue-600 mt-1'>
                    <span className='font-semibold'>Top Attraction</span>{''}{destination.attraction.join(',')}
                </p>
            </div>
            </div>
    );
}

export default DestinationCard;
