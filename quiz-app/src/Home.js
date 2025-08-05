import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="w-full max-w-md mx-auto text-center">
      <h1 className="text-5xl sm:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse">
        LIVE QUIZ
      </h1>
      <p className="text-gray-400 mb-12 text-lg">
        The real-time quiz platform for everyone.
      </p>
      <div className="space-y-6">
        <Link
          to="/host"
          className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg text-2xl transform hover:scale-105 transition-all duration-300 shadow-purple-500/50 hover:shadow-purple-400/80"
        >
          Host a Quiz
        </Link>
        <Link
          to="/join"
          className="block w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg text-2xl transform hover:scale-105 transition-all duration-300 shadow-blue-500/50 hover:shadow-blue-400/80"
        >
          Join a Quiz
        </Link>
      </div>
    </div>
  );
}

export default Home;
