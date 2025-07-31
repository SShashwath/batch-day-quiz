import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Host from './Host';
import Join from './Join';

function App() {
  return (
    <Router>
      {/* You can remove this nav later, it's just for testing */}
      <nav className="bg-gray-800 text-white p-4">
        <Link to="/host" className="mr-4">Host</Link>
        <Link to="/join">Join</Link>
      </nav>

      <Routes>
        <Route path="/host" element={<Host />} />
        <Route path="/join" element={<Join />} />
      </Routes>
    </Router>
  );
}

export default App;