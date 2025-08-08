import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Host from './Host';
import Join from './Join';
import Home from './Home';
import Leaderboard from './Leaderboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Routes>
          <Route path="/host/*" element={<Host />} />
          <Route path="/join" element={<Join />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;