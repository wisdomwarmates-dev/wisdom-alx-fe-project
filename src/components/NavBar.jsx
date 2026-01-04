function Navbar() {
  return (
    <nav className="bg-primary text-white p-4 flex justify-between items-center">
      <h1 className="text-4xl font-bold text-blue-400">Travel Planner</h1>
      <button className="bg-blue-600 px-4 py-2 rounded transition">
        Login</button>
    </nav>
  );
}

export default Navbar;
