import React, { useState } from 'react';

function HostLogin({ onLogin }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === '1106') {
      onLogin();
    } else {
      setError('Incorrect passcode');
      setPasscode('');
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h1 className="text-4xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Host Access</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="passcode">
          Enter Passcode
        </label>
        <input
          id="passcode"
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="bg-gray-900/50 border border-gray-700 rounded w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          placeholder="****"
        />
        {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
        <button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Enter
        </button>
      </form>
    </div>
  );
}

export default HostLogin;