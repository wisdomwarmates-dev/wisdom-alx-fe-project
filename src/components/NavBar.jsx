function Navbar({ tripItemCount, onViewItinerary }) {
  return (
    <nav className="bg-primary text-white p-4 flex justify-between items-center">
      <h1 className="text-4xl font-bold text-blue-400">Travel Planner</h1>
      <div className=";flex items-center space-x-4">
        <button onClick={onViewItinerary}
        className='relative bg-blue-600 px-4 py-2 rounded transition flex items-center space-x-2'>
         <span>My Trip</span> {tripItemCount > 0 && (
          <span className='absolute-top-2 right-2 bg-red-500 text-white text-xs font-bod rounded-full h-6 w-6 flex items-center justify-center'>
            {tripItemCount}
          </span>
         )}
        </button>
      <button className="bg-blue-600 px-4 py-2 rounded transition">
        Login</button>
        </div>
    </nav>
  );
}

export default Navbar;
