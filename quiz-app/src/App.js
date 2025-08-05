import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Host from './Host';
import Join from './Join';
import Home from './Home'; // Import the new Home component

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Routes>
          <Route path="/host/*" element={<Host />} />
          <Route path="/join" element={<Join />} />
          <Route path="/" element={<Home />} /> {/* Set Home as the default route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;